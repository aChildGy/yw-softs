import { DateUtils } from './date.utils.service';

describe('DateUtils', () => {
  it('Test DateUtils.format function', () => {
    /**
     * DateUtils.format 因为底层使用dayjs.format方法，所以此处只测试传入参数是否正常运行，忽略测试边界值
     */
    const format = DateUtils.format;
    const time = '2022-05-25 21:02:33';
    expect(format(new Date('2022-05-25 21:02:33'))).toBe(time);
    expect(format(new Date('2022-05-25 21:02:33').getTime())).toBe(time);
    const expectVal = '25/05/2022-21:02:33';
    expect(format(new Date('2022-05-25 21:02:33'), 'DD/MM/YYYY-HH:mm:ss')).toBe(
      expectVal,
    );
  });
});
