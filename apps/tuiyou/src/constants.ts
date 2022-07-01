export const jwtConstants = {
  // jwt秘钥，可以是任意字符串，用于检验jwt token的合法性
  secret: 'eaef0350Hde82K11ecD9bc1M5de87ba79769',
  // JWT token超时时间
  expiresIn: '12h', // '60s',
};

export const cryptoConstants = {
  // 秘钥签名，用于生成解密私钥
  sign: 'a126ce60-740b-11ec-bb73-73938e6e6407',
  // 初始化向量，此应用中，iv应是一个32位长度的的随机16进制数字串，(16进制数据，0-f/F)
  iv: '29057a89d249712f3d7ecc381c5c7c54',
};
