import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validateHash } from '../../common/utils';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AdminService } from '../admin/admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { TokenPayloadDto } from './dto/token-paylod.dto';
import { AdminEntity } from '../admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async createAccessToken(data: { adminId: number }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      token: await this.jwtService.signAsync({
        adminId: data.adminId,
      }),
    });
  }

  async validateAdmin(adminLoginDto: AdminLoginDto): Promise<AdminEntity> {
    const admin = await this.adminService.findOne({
      email: adminLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      adminLoginDto.password,
      admin?.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Admin not found');
    }

    return admin!;
  }
}
