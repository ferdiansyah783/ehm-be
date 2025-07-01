import { DateField, NumberField, StringField } from '../../decorators/field.decorator';
import { AbstractEntity } from '../entities/abstract.entity';

export class AbstractDto {
  @NumberField()
  id!: number;

  @StringField()
  createdAt!: Date;

  @StringField()
  updatedAt!: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
    }
  }
}
