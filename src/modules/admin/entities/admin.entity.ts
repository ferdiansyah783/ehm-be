import { Column, Entity } from 'typeorm';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { AdminDto } from '../dto/admin.dto';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Gender } from '../../../constants/gender';

@Entity({
  name: 'admins',
})
@UseDto(AdminDto)
export class AdminEntity extends AbstractEntity<AdminDto> {
  @Column({ nullable: true, type: 'varchar', length: 100 })
  firstName: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  lastName: string;

  @Column({ nullable: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  password: string;

  @Column({ nullable: true, type: 'enum', enum: ['male', 'female'] })
  gender: Gender;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  birthDate: string;
}
