import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '../admin/admin.service';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AdminEntity } from '../admin/entities/admin.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: { adminId: number }): Promise<AdminEntity> {
    const user = await this.adminService.findOne({
      id: args.adminId as never,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
