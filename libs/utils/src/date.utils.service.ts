import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class DateUtils {
  /**
   * 通过dayjs的format方法来格式化时间
   *
   * dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'
   *
   * dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') // 'YYYYescape 2019-01-25T00:00:00-02:00Z'
   *
   * @param date 要格式化的时间对象，可传入数字时间戳或Date对象，默然为当前时间Date
   * @param template 格式化字符串参数，默认'YYYY-MM-DD HH:mm:ss'
   * @returns 格式化后的时间字符串
   */
  static format(date?: number | Date, template?: string): string {
    return dayjs(date).format(template || 'YYYY-MM-DD HH:mm:ss');
  }
}
