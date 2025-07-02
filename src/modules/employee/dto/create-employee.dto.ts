import { Gender } from '../../../constants/gender';
import {
  EmailField,
  EnumField,
  PhoneField,
  StringField,
} from '../../../decorators/field.decorator';

export class CreateEmployeeDto {
  @StringField({ minLength: 3 })
  readonly firstName: string;

  @StringField({ minLength: 3 })
  readonly lastName: string;

  @EmailField({ example: 'string@gmail.com' })
  readonly email: string;

  @PhoneField({ example: '+6287894573986' })
  readonly phoneNumber: string;

  @StringField()
  readonly address: string;

  @EnumField(() => Gender)
  readonly gender: Gender;
}
