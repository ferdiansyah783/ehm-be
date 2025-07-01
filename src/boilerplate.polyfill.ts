import _ from 'lodash';
import type { ObjectLiteral } from 'typeorm';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { AbstractDto } from './common/dto/abstract.dto';
import { PageMetaDto } from './common/dto/page-meta.dto';
import { PageOptionsDto } from './common/dto/page-options.dto';
import { PageDto } from './common/dto/page.dto';
import { AbstractEntity } from './common/entities/abstract.entity';
import { KeyOfType } from './types';

declare global {
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,

      options?: unknown,
    ): PageDto<Dto>;
  }
}

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    searchByString(
      q: string,
      columnNames: string[],
      options?: {
        formStart: boolean;
      },
    ): this;

    filterByColumns(
      filters: Record<string, any>,
      excludeFields?: string[],
    ): this;

    orderByIfMissing(column: string, direction?: 'ASC' | 'DESC'): this;

    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
    ): Promise<[Entity[], PageMetaDto]>;
  }
}

Array.prototype.toDtos = function <
  Entity extends AbstractEntity<Dto>,
  Dto extends AbstractDto,
>(options?: unknown): Dto[] {
  return _.compact(
    _.map<Entity, Dto>(this as Entity[], (item) =>
      item.toDto(options as never),
    ),
  );
};

Array.prototype.toPageDto = function (
  pageMetaDto: PageMetaDto,
  options?: unknown,
) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

SelectQueryBuilder.prototype.searchByString = function (
  q: string,
  columnNames: string[],
  options?: {
    formStart: boolean;
  },
) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`LOWER(${item}) LIKE LOWER(:q)`);
      }
    }),
  );

  if (options?.formStart) {
    this.setParameter('q', `${q.toLowerCase()}%`);
  } else {
    this.setParameter('q', `%${q.toLowerCase()}%`);
  }

  return this;
};

SelectQueryBuilder.prototype.filterByColumns = function (
  filters: Record<string, any>,
  excludeFields: string[] = [],
) {
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || excludeFields.includes(key)) return;

    if (typeof value === 'string' && value !== '') {
      this.andWhere(`${this.alias}.${key} = :${key}`, { [key]: value });
    }
  });

  return this;
};

SelectQueryBuilder.prototype.orderByIfMissing = function (
  column: string,
  direction: 'ASC' | 'DESC' = 'ASC',
) {
  const hasOrderBy =
    this.expressionMap.orderBys &&
    Object.keys(this.expressionMap.orderBys).length > 0;

  if (!hasOrderBy) {
    this.orderBy(column, direction);
  }

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
  }>,
) {
  if (pageOptionsDto.orderBy) {
    this.orderByIfMissing(
      this.alias + '.' + pageOptionsDto.orderBy,
      pageOptionsDto.order,
    );
  }

  if (!options?.takeAll) {
    this.offset(pageOptionsDto.skip).limit(pageOptionsDto.take);
  }

  const [entities, itemCount] = await Promise.all([
    this.getMany(),
    options?.skipCount ? Promise.resolve(-1) : this.getCount(),
  ]);

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};
