import {
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';

type JwtConstants = {
  // jwt秘钥，可以是任意字符串，用于检验jwt token的合法性
  secret: string;
  // JWT token超时时间
  expiresIn: string;
};

type CryptoConstants = {
  // 秘钥签名，用于生成解密私钥
  sign: string;
  // 初始化向量，此应用中，iv应是一个32位长度的的随机16进制数字串，(16进制数据，0-f/F)
  iv: string;
};

export interface AuthModuleOptions {
  jwtOptions: JwtConstants;
  cryptoOptions: CryptoConstants;
  imports: (
    | Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[];
  providers: Provider<any>[];
}
