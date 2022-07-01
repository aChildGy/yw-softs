import { IS_PUBLIC_KEY } from '@app/auth/constants';
import { SetMetadata } from '@nestjs/common';

export const PublicApi = () => SetMetadata(IS_PUBLIC_KEY, true);
