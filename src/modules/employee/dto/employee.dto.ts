import { Type } from 'class-transformer';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { Gender } from '../../../constants/gender';
import {
  EnumFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorator';
import { LeaveDto } from '../../leave/dto/leave.dto';
import { EmployeeEntity } from '../entities/employee.entity';

export class EmployeeDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName: string;

  @StringFieldOptional({ nullable: true })
  lastName: string;

  @StringFieldOptional({ nullable: true })
  email: string;

  @StringFieldOptional({ nullable: true })
  phoneNumber: string;

  @StringFieldOptional({ nullable: true })
  address: string;

  @EnumFieldOptional(() => Gender, { nullable: true })
  gender: Gender;

  @Type(() => LeaveDto)
  leaves: LeaveDto[];

  constructor(employee: EmployeeEntity) {
    super(employee);
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.email = employee.email;
    this.phoneNumber = employee.phoneNumber;
    this.address = employee.address;
    this.gender = employee.gender;
    this.leaves = employee.leaves
  }
}
