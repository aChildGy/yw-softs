import { Module } from '@nestjs/common';
import { CryptoUtils } from './crypto.utils.service';
import { DateUtils } from './date.utils.service';

@Module({
  providers: [DateUtils, CryptoUtils],
  exports: [DateUtils, CryptoUtils],
})
export class UtilsModule {}
