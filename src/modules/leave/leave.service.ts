import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveEntity } from './entities/leave.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { EmployeeService } from '../employee/employee.service';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { LeaveDto } from './dto/leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveEntity)
    private readonly leaveRepository: Repository<LeaveEntity>,
    private readonly employeeService: EmployeeService,
  ) {}

  @Transactional()
  async create(
    employeeId: number,
    createLeaveDto: CreateLeaveDto,
  ): Promise<LeaveEntity> {
    const employee = await this.employeeService.findOne({ id: employeeId });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const start = new Date(createLeaveDto.startDate);
    const end = new Date(createLeaveDto.endDate);

    if (start > end)
      throw new BadRequestException('Start date must be before end date');

    const leaveDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1,
    );

    if (leaveDays !== 2) {
      throw new BadRequestException('Leave must be exactly 1 day');
    }

    const year = start.getFullYear();

    const totalLeaveThisYear = await this.leaveRepository
      .createQueryBuilder('leave')
      .where('leave.employeeId = :employeeId', { employeeId })
      .andWhere('YEAR(leave.startDate) = :year', { year })
      .select('SUM(DATEDIFF(leave.endDate, leave.startDate) + 1)', 'total')
      .getRawOne();

    const totalUsed = Number(totalLeaveThisYear?.total || 0);

    if (totalUsed + leaveDays > 12) {
      throw new BadRequestException(
        'You can only take up to 12 days of leave per year',
      );
    }

    const month = start.getMonth() + 1;

    const existingLeaveInMonth = await this.leaveRepository
      .createQueryBuilder('leave')
      .where('leave.employeeId = :employeeId', { employeeId })
      .andWhere(
        'MONTH(leave.startDate) = :month AND YEAR(leave.startDate) = :year',
        { month, year },
      )
      .getCount();

    console.log('existingLeaveInMonth', existingLeaveInMonth);

    if (existingLeaveInMonth >= 1) {
      throw new BadRequestException('Leave can only be taken once per month');
    }

    const leave = this.leaveRepository.create(createLeaveDto);

    leave.employee = employee;

    await this.leaveRepository.save(leave);

    return leave;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<LeaveDto>> {
    const queryBuilder = this.leaveRepository
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.employee', 'employee');

    const [items, PageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(PageMetaDto);
  }

  async findOne(
    findData: FindOptionsWhere<LeaveEntity>,
  ): Promise<LeaveDto | null> {
    const leave = await this.leaveRepository.findOneBy(findData);

    return leave;
  }

  async update(id: number, updateLeaveDto: UpdateLeaveDto): Promise<void> {
    const leave = await this.leaveRepository.findOneBy({ id });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    this.leaveRepository.merge(leave, updateLeaveDto);

    await this.leaveRepository.save(leave);
  }

  async remove(id: number): Promise<void> {
    const leave = await this.leaveRepository.findOneBy({ id });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    await this.leaveRepository.remove(leave);
  }
}
