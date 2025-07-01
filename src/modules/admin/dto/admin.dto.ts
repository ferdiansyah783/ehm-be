import { AbstractDto } from '../../../common/dto/abstract.dto';
import { Gender } from '../../../constants/gender';
import {
  DateFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorator';
import { AdminEntity } from '../entities/admin.entity';

export class AdminDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName: string;

  @StringFieldOptional({ nullable: true })
  lastName: string;

  @StringFieldOptional({ nullable: true })
  email: string;

  @EnumFieldOptional(() => Gender, { nullable: true })
  gender: Gender;

  @DateFieldOptional({ nullable: true })
  birthDate: string;

  constructor(admin: AdminEntity) {
    super(admin);
    this.firstName = admin.firstName;
    this.lastName = admin.lastName;
    this.email = admin.email;
    this.gender = admin.gender;
    this.birthDate = admin.birthDate;
    this.createdAt = admin.createdAt;
    this.updatedAt = admin.updatedAt;
  }
}
