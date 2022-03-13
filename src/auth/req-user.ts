import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export type RequestUser = Pick<User, 'id' | 'email' | 'name'>;

export const ReqUser = createParamDecorator(
  (path: keyof RequestUser, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as RequestUser | undefined;

    return path ? user?.[path] : user;
  },
);
