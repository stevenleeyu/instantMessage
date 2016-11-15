/**
 * store test
 */
define(['AbstractStore', 'LocalStore', 'AbstractStorage'], function (AbstractStore, LocalStore, AbstractStorage) {
	"use strict";

  describe('AbstractStore LocalStore', function () {
    var
      timeout = +new Date + 2 * 24 * 60 * 60 * 1000,
      store = new LocalStore({ key: 'USER', rollbackEnabled: true }),
      store2 = new AbstractStore({
        proxy: new AbstractStorage({
          storage: window.localStorage
        }),
        key: 'JOB',
        lifeTime: '1D'
      });

    it('all', function () {
      store.set({a: 1, b: 2, c: 3});
      store.setAttr('c', 33);
      store.setAttr('d', 4);
      expect(store.get()).toEqual({a: 1, b: 2, c: 33, d: 4});

      store.set({a: 11, b: 22, c: 33}, null, true);
      store.setAttr('b', 222, null, true);
      store.setAttr('d', 44, null, true);222222
      expect(store.get(null, true)).toEqual({a: 11, b: 222, c: 33, d: 44});

      expect(store.getAttr('c')).toEqual(33);
      expect(store.getAttr('d')).toEqual(4);
      expect(store.getAttr('c', null, true)).toEqual(33);
      expect(store.getAttr('d', null, true)).toEqual(44);
      expect(store.getTag()).not.toBeDefined();

      store.setExpireTime(timeout);
      expect(store.getExpireTime()).toEqual(timeout);

      store.rollback();
      expect(store.get()).toEqual({a: 11, b: 222, c: 33, d: 44});
      expect(store.get(null, true)).toEqual({a: 11, b: 222, c: 33, d: 44});
      store.rollback(true);
      expect(store.get()).toEqual({a: 11, b: 222, c: 33, d: 44});
      expect(store.get(null, true)).not.toBeDefined();

      store.setAttr('h', '设置tag时如果之前的tag没有或者不同，会清除此store下所有内容', 'tag');
      expect(store.get()).toEqual({h: '设置tag时如果之前的tag没有或者不同，会清除此store下所有内容'});
      expect(store.getTag()).toEqual('tag');

      store2.set({a: 1, b: 2, c: 3});
      expect(store2.get()).toEqual({a: 1, b: 2, c: 3});
      store2.remove();
      expect(store2.get()).toBeNull();

      store.setExpireTime(+new Date - 1000);
      store2.set({a: 1, b: 2, c: 3});
      window.localStorage.setItem('else', '测试gc是否清除此storage key');
      store2.options.proxy.gc();
      expect(window.localStorage.getItem('else')).toEqual('测试gc是否清除此storage key');
      expect(store.get()).toBeNull();
      expect(store2.get()).toEqual({a: 1, b: 2, c: 3});
      store2.options.proxy.clear();
      expect(store2.get()).toBeNull();
      expect(window.localStorage.getItem('else')).toBeNull();
    })
  })
});