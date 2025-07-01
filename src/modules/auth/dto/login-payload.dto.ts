import { ClassField } from '../../../decorators/field.decorator';
import { AdminDto } from '../../admin/dto/admin.dto';
import { TokenPayloadDto } from './token-paylod.dto';

export class LoginPayloadDto {
  @ClassField(() => AdminDto)
  user: AdminDto;

  @ClassField(() => TokenPayloadDto)
  accessToken: TokenPayloadDto;

  constructor(admin: AdminDto, token: TokenPayloadDto) {
    this.user = admin;
    this.accessToken = token;
  }
}