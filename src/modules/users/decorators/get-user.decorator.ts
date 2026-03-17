import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/types/jwt-payload.interface';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new Error('User not found in request!');
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
