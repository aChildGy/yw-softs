import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createCipheriv, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoUtils {
  /**
   *
   * @param textToEncrypt textToEncrypt 要加密的文本
   * @param pwd 生成私钥的密码
   * @param iv 初始化向量(随机十六进制数字串，有效取值0-f/F) 比如在高级加密标准（AES）里，若使用长度为128位的密钥，加密的过程就是将整个明文切割成多个128位长度的子明文，然后依前后顺序用同一把密钥转换成对应的多个128位长度的子密文，这些子密文依产生的顺序连接起来便是完整的密文。这种作法其实就是把甲数据转换成固定的乙数据，这样的对应关系是绝对的，因此攻击者在收集足够的明文与密文的组合后可以轻易的比对并推导出明文或密钥。CBC模式的作法是对第一块明文投入随机的初始化向量，然后将明文与向量运算的结果加密，加密的结果再作为下一块明文的向量。这种做法的最终目的是要达到语义上的安全，让攻击者无法从密文中获取能助其破译的相关线索，避免遭受选择明文攻击法,初始化向量最好具有唯一性
   * @returns
   */
  static async encrypt(
    textToEncrypt: string,
    pwd: string,
    iv: string | Buffer,
  ): Promise<string> {
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(pwd, 'salt', 32)) as Buffer;

    if (!(iv instanceof Buffer)) {
      if (iv.length !== 32) {
        throw new InternalServerErrorException();
      }

      iv = Buffer.from(iv, 'hex');
    }

    const cipher = createCipheriv('aes-256-ctr', key, iv);

    // 加密后的字符串，是二进制Buffer，用toString('hex')来还原回字符串
    return Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]).toString('hex');
  }

  static async decrypt(
    encryptedText: string,
    pwd: string,
    iv: string | Buffer,
  ): Promise<string> {
    const key = (await promisify(scrypt)(pwd, 'salt', 32)) as Buffer;

    if (!(iv instanceof Buffer)) {
      if (iv.length !== 32) {
        throw new InternalServerErrorException();
      }

      iv = Buffer.from(iv, 'hex');
    }

    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    // 解密后的字符串，是十进制Buffer，用toString()来还原回字符串
    return Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]).toString();
  }

  /**
   *
   * @param text
   * @param roundsSalt
   * @returns 返回一个hash
   *
   * @example roundsSalt 迭代指数。此参数应该在安全和效率之间平衡
   * rounds=8 : ~40 hashes/sec
   * rounds=9 : ~20 hashes/sec
   * rounds=10: ~10 hashes/sec
   * rounds=11: ~5  hashes/sec
   * rounds=12: 2-3 hashes/sec
   * rounds=13: ~1 sec/hash
   * rounds=14: ~1.5 sec/hash
   * rounds=15: ~3 sec/hash
   * rounds=25: ~1 hour/hash
   * rounds=31: 2-3 days/hash
   */
  static async generateHash(
    text: string,
    roundsSalt?: number,
  ): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt(roundsSalt || 6);
    const hash = await bcrypt.hash(text, saltOrRounds);
    return hash;
  }

  static async compareHash(text: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(text, hash);
  }
}
