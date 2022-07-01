import { ROLES_KEY } from '@app/auth/constants';
import { SetMetadata } from '@nestjs/common';

export const Roles = <T>(...roles: T[]) => SetMetadata(ROLES_KEY, roles);
