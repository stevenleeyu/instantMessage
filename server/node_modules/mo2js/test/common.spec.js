/**
 * common test
 */
define(['common'], function (c) {
	"use strict";

  describe('common', function () {
    var foo, obj1, obj2, obj3;

    function Foo () {
      this.a = 1
    };

    Foo.prototype.b = 2;

    foo = new Foo();

    obj1 = {
      a: 1,
      b: 2,
      toString: 3,
      isPrototypeOf: 4,
      constructor: 5
    };
    obj2 = {
      b: 22,
      c: {
        d: 6
      }
    };
    obj3 = {
      c: {
        e: 7,
        f: {
          g: 8,
          h: 9
        }
      }
    };

    it('has', function () {
      expect(c.has(foo, 'a')).toBeTruthy();
      expect(c.has(foo, 'b')).toBeFalsy();
    })

    it('forIn', function () {
      var ret = {};
      c.forIn(obj1, function(v, k) {
        ret[k] = v;
      });
      expect(ret).toEqual({
        a: 1,
        b: 2,
        toString: 3,
        isPrototypeOf: 4,
        constructor: 5
      });
    })

    it('extend', function () {
      expect(c.extend(obj1, obj2)).toEqual({
        a: 1,
        b: 22,
        c: {
          d: 6
        },
        toString: 3,
        isPrototypeOf: 4,
        constructor: 5
      });
      expect(c.extend(obj2, obj3)).toEqual({
        b: 22,
        c: {
          e: 7,
          f: {
            g: 8,
            h: 9
          }
        }
      });
      expect(c.extend(true, obj1, obj2, obj3)).toEqual({
        a: 1,
        b: 22,
        c: {
          d: 6,
          e: 7,
          f: {
            g: 8,
            h: 9
          }
        },
        toString: 3,
        isPrototypeOf: 4,
        constructor: 5
      });
    })

    it('type', function () {
      expect(c.type({a: 1})).toEqual('object');
      expect(c.type('mojs')).toEqual('string');
      expect(c.type(2)).toEqual('number');
      expect(c.type(true)).toEqual('boolean');
      expect(c.type(function(){})).toEqual('function');
      expect(c.type(new Date())).toEqual('date');
      expect(c.type(/r/)).toEqual('regexp');
      expect(c.type([1, 2, 3])).toEqual('array');
      expect(c.isObject({a: 1})).toBeTruthy();
      expect(c.isBoolean({a: 1})).toBeFalsy();
      expect(c.isArray([1, 2, 3])).toBeTruthy();
      expect(c.isArraylike([1, 2, 3])).toBeTruthy();
      expect(c.isArraylike({1: 1, 2: 2, 3: 3, length: 3})).toBeTruthy();
      expect(c.isArraylike({1: 1, 2: 2, 3: 3})).toBeFalsy();
      expect(c.isNaN(NaN)).toBeTruthy();
      expect(c.isNaN(undefined)).toBeFalsy();
    })

    it('baseCreate', function () {
      expect(c.baseCreate()).toEqual({});
      expect(c.baseCreate({ a: Foo }).a).toEqual(Foo);
    })
  })
});