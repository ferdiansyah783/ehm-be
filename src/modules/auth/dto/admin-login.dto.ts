import { EmailField, PasswordField } from '../../../decorators/field.decorator';

export class AdminLoginDto {
  @EmailField()
  readonly email: string;

  @PasswordField()
  readonly password: string;
}
