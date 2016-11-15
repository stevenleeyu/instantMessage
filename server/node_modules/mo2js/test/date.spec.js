/**
 date test
 */
define(['date'], function (date) {
	"use strict";

  describe('date', function () {
    var
      birthday2 = '/Date(562941040500+0800)/', // 非JS格式的时间戳,例如.NET
      birthday3 = '1987/11/03 20:30:40', // 需要重新格式化的字符串,注意12小时制不支持
      birthday4 = '1987/11/03', // 需要重新格式化的字符串
      birthday5 = 562941040500, // 时间戳(number/string)
      birthday6 = new Date('1987', '10', '03', '20', '30', '40', '500'); // Date实例

    it('format', function () {
      expect(date.format(birthday2, 'YYYY-MM-DD HH:mm:ss:SSS')).toEqual('1987-11-03 20:30:40:500');
      expect(date.format(birthday2, 'YY年M月D日 h时m分s秒 S毫秒 ddd')).toEqual('87年11月3日 8时30分40秒 500毫秒 周二');
      expect(date.format(birthday2, '\\Q\\ww\\a,第Q季度,第ww周季度,A')).toEqual('Qwwa,第4季度,第45周季度,PM');

      expect(date.format(birthday3, 'YYYY-MM-DD HH:mm:ss')).toEqual('1987-11-03 20:30:40');
      expect(date.format(birthday3, 'YY年M月D日 h时m分s秒 ddd')).toEqual('87年11月3日 8时30分40秒 周二');
      expect(date.format(birthday3, '\\Q\\ww\\a,第Q季度,第ww周季度,A')).toEqual('Qwwa,第4季度,第45周季度,PM');

      expect(date.format(birthday4, 'YYYY-MM-DD')).toEqual('1987-11-03');
      expect(date.format(birthday4, 'YY年M月D日 ddd')).toEqual('87年11月3日 周二');
      expect(date.format(birthday4, '\\Q\\ww\\a,第Q季度,第ww周季度,A')).toEqual('Qwwa,第4季度,第45周季度,AM');

      expect(date.format(birthday5, 'YYYY-MM-DD HH:mm:ss:SSS')).toEqual('1987-11-03 20:30:40:500');
      expect(date.format(birthday5, 'YY年M月D日 h时m分s秒 S毫秒 ddd')).toEqual('87年11月3日 8时30分40秒 500毫秒 周二');
      expect(date.format(birthday5, '\\Q\\ww\\a,第Q季度,第ww周季度,A')).toEqual('Qwwa,第4季度,第45周季度,PM');

      expect(date.format(birthday6, 'YYYY-MM-DD HH:mm:ss:SSS')).toEqual('1987-11-03 20:30:40:500');
      expect(date.format(birthday6, 'YY年M月D日 h时m分s秒 S毫秒 ddd')).toEqual('87年11月3日 8时30分40秒 500毫秒 周二');
      expect(date.format(birthday6, '\\Q\\ww\\a,第Q季度,第ww周季度,A')).toEqual('Qwwa,第4季度,第45周季度,PM');
    })

    it('add/sub', function () {
      expect(+date.add(birthday6, 'Time', 1)).toEqual(birthday6['setTime'](birthday6['getTime']() + 1));
      expect(+date.add(birthday6, 'Milliseconds', 1)).toEqual(birthday6['setMilliseconds'](birthday6['getMilliseconds']() + 1));
      expect(+date.add(birthday6, 'Seconds', 1)).toEqual(birthday6['setSeconds'](birthday6['getSeconds']() + 1));
      expect(+date.add(birthday6, 'Minutes', 1)).toEqual(birthday6['setMinutes'](birthday6['getMinutes']() + 1));
      expect(+date.add(birthday6, 'Hours', 1)).toEqual(birthday6['setHours'](birthday6['getHours']() + 1));
      expect(+date.add(birthday6, 'Date', 1)).toEqual(birthday6['setDate'](birthday6['getDate']() + 1));
      expect(+date.add(birthday6, 'Month', 1)).toEqual(birthday6['setMonth'](birthday6['getMonth']() + 1));
      expect(+date.sub(birthday6, 'FullYear', 1)).toEqual(birthday6['setFullYear'](birthday6['getFullYear']() - 1));
    })

  })
});