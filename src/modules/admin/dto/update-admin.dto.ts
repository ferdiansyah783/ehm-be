import { PartialType } from '@nestjs/mapped-types';
import { AdminRegisterDto } from '../../auth/dto/admin-register.dto';

export class UpdateAdminDto extends PartialType(AdminRegisterDto) {}
