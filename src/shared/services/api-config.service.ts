import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AdminSubscriber } from '../../entity-subscribers/admin-subsriber';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`${key} env var is not a boolean`);
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll(String.raw`\n`, '\n');
  }

  get dbConfig(): TypeOrmModuleOptions {
    return {
      type: this.getString('DB_TYPE') as any,
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      synchronize: this.getBoolean('DB_SYNC'),
      subscribers: [AdminSubscriber],
      migrationsRun: this.getBoolean('DB_MIGRATIONS_RUN'),
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      autoLoadEntities: true,
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (value == null) {
      throw new Error(`${key} environment variable does not set`); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
