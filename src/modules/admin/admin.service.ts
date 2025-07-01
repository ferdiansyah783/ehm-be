import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { AdminRegisterDto } from '../auth/dto/admin-register.dto';
import { AdminDto } from './dto/admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  @Transactional()
  async create(adminRegisterDto: AdminRegisterDto): Promise<AdminEntity> {
    const existEmail = await this.findOne({ email: adminRegisterDto.email });

    if (existEmail) {
      throw new BadRequestException('Email already exist');
    }

    const admin = this.adminRepository.create(adminRegisterDto);

    await this.adminRepository.save(admin);

    return admin;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AdminDto>> {
    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

    const [items, PageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(PageMetaDto);
  }

  findOne(
    findData: FindOptionsWhere<AdminEntity>,
  ): Promise<AdminEntity | null> {
    const admin = this.adminRepository.findOneBy(findData);

    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<void> {
    const admin = await this.findOne({ id });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    this.adminRepository.merge(admin, updateAdminDto);

    await this.adminRepository.save(admin);
  }

  async remove(id: number): Promise<void> {
    const admin = await this.findOne({ id });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    await this.adminRepository.remove(admin);
  }
}
