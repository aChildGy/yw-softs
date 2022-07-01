import { UserDetail } from '../entities/user.detail.entity';
import { User } from '../entities/user.entity';

export type RulesType = typeof User | typeof UserDetail;
