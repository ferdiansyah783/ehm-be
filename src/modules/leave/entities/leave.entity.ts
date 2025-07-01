import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { LeaveDto } from '../dto/leave.dto';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { EmployeeEntity } from '../../employee/entities/employee.entity';

@Entity({
  name: 'leaves',
})
@UseDto(LeaveDto)
export class LeaveEntity extends AbstractEntity<LeaveDto> {
  @Column({ nullable: true, type: 'text' })
  reason: string;

  @Column({ nullable: true, type: 'varchar' })
  startDate: string;

  @Column({ nullable: true, type: 'varchar' })
  endDate: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.leaves, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Relation<EmployeeEntity>;
}
