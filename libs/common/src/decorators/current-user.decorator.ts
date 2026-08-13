import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersDocument } from '../models';

const getCurrentUserByContext = (context: ExecutionContext): UsersDocument => {
  const request = context.switchToHttp().getRequest<{ user?: UsersDocument }>();
  const user = request.user;

  if (!user) {
    throw new Error('User not found in request');
  }

  return user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
