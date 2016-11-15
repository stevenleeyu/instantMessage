/**
 * objectPath test
 */
define(['objectPath'], function (objectPath) {
	"use strict";

  describe('objectPath', function () {
    var obj = { f: { g: 'blog' } };
    it('set', function () {
      expect(objectPath.set(obj, 'a.d', 'mojs')).toBeTruthy();
      expect(objectPath.set(obj, 'a.b.e', 'modoc')).toBeTruthy();
    })
    it('get', function () {
      expect(objectPath.get(obj, 'f.g')).toEqual('blog');
      expect(objectPath.get(obj, 'a.b.e')).toEqual('modoc');
    })
  })
});