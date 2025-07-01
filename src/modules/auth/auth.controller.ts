import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminService } from '../admin/admin.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { AdminEntity } from '../admin/entities/admin.entity';
import { AdminDto } from '../admin/dto/admin.dto';
import { Auth } from '../../decorators/http.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    const admin = await this.authService.validateAdmin(adminLoginDto);

    const token = await this.authService.createAccessToken({
      adminId: admin.id,
    });

    return new LoginPayloadDto(admin.toDto(), token);
  }

  @Post('register')
  async register(@Body() adminRegisterDto: AdminRegisterDto) {
    const createdAdmin = await this.adminService.create(adminRegisterDto);

    return createdAdmin.toDto();
  }

  @Get('me')
  @Auth()
  getCurrentUser(@AuthUser() user: AdminEntity): AdminDto {
    return user.toDto();
  }
}
