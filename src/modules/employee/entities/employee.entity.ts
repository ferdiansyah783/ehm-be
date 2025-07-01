import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { EmployeeDto } from '../dto/employee.dto';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { LeaveEntity } from '../../leave/entities/leave.entity';
import { Gender } from '../../../constants/gender';

@Entity({
  name: 'employees',
})
@UseDto(EmployeeDto)
export class EmployeeEntity extends AbstractEntity<EmployeeDto> {
  @Column({ nullable: true, type: 'varchar', length: 100 })
  firstName: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  lastName: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar', length: 25 })
  phoneNumber: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true, type: 'enum', enum: ['male', 'female'] })
  gender: Gender;

  @OneToMany(() => LeaveEntity, (leave) => leave.employee)
  leaves: Relation<LeaveEntity[]>;
}
