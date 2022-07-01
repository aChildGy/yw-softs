import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Utils {
  /**
   * 异步方法变成同步方法
   * @param fn 异步方法
   * @param fnThis 异步方法的this指向
   * @param args fn方法的参数
   */

  // eslint-disable-next-line @typescript-eslint/ban-types
  static async syncify(fn: Function, fnThis: unknown, ...args: unknown[]) {
    try {
      const result = await fn.apply(fnThis, args);
      return () => {
        return result;
      };
    } catch (e) {
      return () => {
        throw e;
      };
    }
  }

  /**
   * 延迟函数
   * @param milliseconds 延迟毫秒数
   * @returns
   */
  static async delay(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * v4版本的uuid生成函数
   * @returns // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
   */
  static uuid() {
    return uuidv4();
  }
}
