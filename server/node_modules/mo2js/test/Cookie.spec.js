/**
 * Cookie test
 */
define(['Cookie'], function (Cookie) {
	"use strict";

  describe('Cookie', function () {
    var
      cookie = new Cookie(),
      cookie2 = new Cookie({isRaw: true, isJson: true});

    it('set get remove', function () {
      cookie.set('user', 'mo');
      expect(cookie.get('user')).toEqual('mo');
      cookie2.set('user2', {a: 'mojs', b: 'modoc'}, {expires: 1});
      expect(cookie2.get('user2')).toEqual({a: 'mojs', b: 'modoc'});
      cookie.remove('user');
      expect(cookie.get('user')).toEqual('');
      cookie.remove('user2');
      expect(cookie.get('user2')).toEqual('');
    })
  })
});