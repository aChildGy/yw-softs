import { CryptoUtils } from './crypto.utils.service';

describe('CryptoUtils', () => {
  it('Test CryptoUtils.encrypt and CryptoUtils.decrypt', async () => {
    // 此数据为IV, 是一个32位的字符串
    const ivData = '29057a89d249712f397ecc581c5c7c54';

    // 初始化向量 如果项目加密的数据 需要安全级别很高，则iv值每次需要随机
    // const ivData = randomBytes(16);
    // console.log(ivData.toString('hex'))

    // 私有签名用于生成私钥
    const privateSign = 'used to generate private key';

    // 待加密文本
    const text = 'kajsdashgnakjnjkahgka阿达';

    const enText = await CryptoUtils.encrypt(text, privateSign, ivData);

    const deText = await CryptoUtils.decrypt(enText, privateSign, ivData);

    expect(deText).toBe(text);
  });

  it('Test CryptoUtils.generateHash and CryptoUtils.compareHash', async () => {
    const pwd = '1233455';
    const hash1 = await CryptoUtils.generateHash(pwd);
    const hash2 = await CryptoUtils.generateHash(pwd);

    expect(await CryptoUtils.compareHash(pwd, hash1)).toBe(true);
    expect(await CryptoUtils.compareHash(pwd, hash2)).toBe(true);

    const pwd2 = '1233452';
    expect(await CryptoUtils.compareHash(pwd2, hash1)).toBe(false);
  });
});
