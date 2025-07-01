import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { EmployeeDto } from './dto/employee.dto';
import { PageDto } from '../../common/dto/page.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {}

  @Transactional()
  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    const existEmail = await this.findOne({ email: createEmployeeDto.email });

    if (existEmail) {
      throw new BadRequestException('Email already exist');
    }

    const employee = this.employeeRepository.create(createEmployeeDto);

    await this.employeeRepository.save(employee);

    return employee;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<EmployeeDto>> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.leaves', 'leave');

    const [items, PageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(PageMetaDto);
  }

  async findOne(
    findData: FindOptionsWhere<EmployeeEntity>,
  ): Promise<EmployeeEntity | null> {
    const employee = await this.employeeRepository.findOne({ where: findData });

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<void> {
    const employee = await this.findOne({ id });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    this.employeeRepository.merge(employee, updateEmployeeDto);

    await this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne({ id });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.employeeRepository.remove(employee);
  }
}
