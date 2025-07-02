import { Gender } from '../../../constants/gender';
import {
  DateField,
  EmailField,
  EnumField,
  PasswordField,
  StringField,
} from '../../../decorators/field.decorator';

export class AdminRegisterDto {
  @StringField({ minLength: 3 })
  readonly firstName: string;

  @StringField({ minLength: 3 })
  readonly lastName: string;

  @EmailField({ example: 'string@gmail.com' })
  readonly email: string;

  @PasswordField()
  readonly password: string;

  @EnumField(() => Gender)
  readonly gender: Gender;

  @DateField({ example: '2000-01-01' })
  readonly birthDate: string;
}
