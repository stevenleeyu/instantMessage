/**
 * util test
 */
define(['util'], function (util) {
	"use strict";

  describe('util', function () {
    it('guid', function () {
      expect(util.guid()).toMatch(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/);
    })
    it('getByteInfo', function () {
      expect(util.getByteInfo('我的生日是1987年11月03日', 5)).toEqual({length: 24, index: 2});
      expect(util.getByteInfo('生日：1987-08-05')).toEqual({length: 16});
    })
    it('pad', function () {
      expect(util.pad('mo', 4, '-')).toEqual('--mo');
      expect(util.pad(19871103, 14, 0, true)).toEqual('19871103000000');
      expect(util.pad(19871103, 6, null, false, true)).toEqual('871103');
    })
  })
});