import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { PublicRoute } from './public-route.decorator';

export function Auth(options?: Partial<{ public: boolean }>): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    UseGuards(AuthGuard({ public: isPublicRoute })),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}
