import { Type } from 'class-transformer';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringFieldOptional } from '../../../decorators/field.decorator';
import { LeaveEntity } from '../entities/leave.entity';
import { EmployeeDto } from '../../employee/dto/employee.dto';

export class LeaveDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  reason: string;

  @StringFieldOptional({ nullable: true })
  startDate: string;

  @StringFieldOptional({ nullable: true })
  endDate: string;

  @Type(() => EmployeeDto)
  employee: EmployeeDto;

  constructor(leave: LeaveEntity) {
    super(leave);
    this.reason = leave.reason;
    this.startDate = leave.startDate;
    this.endDate = leave.endDate;
    this.employee = leave.employee
  }
}
