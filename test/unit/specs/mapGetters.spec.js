import Vue from 'vue';
import Vuex from 'vuex';
import mapGetters from 'vuex-search/mapGetters';

Vue.use(Vuex);

describe('mapGetters', () => {
  test('should return basic getter with resourceName', () => {
    const base = 'test';
    const store = new Vuex.Store({});
    store.search = { _base: base };

    store.registerModule(base, {
      namespaced: true,
      state: {
        test: { count: 0 },
      },
      mutations: {
        inc: (state) => {
          state.test.count += 1;
        },
      },
      getters: {
        count: state => resourceName => state[resourceName].count,
      },
    });

    const resourceName = 'test';
    const getterMap = { number: 'count' };

    const vm = new Vue({
      store,
      computed: mapGetters(resourceName, getterMap),
    });

    expect(vm.number).toEqual(0);

    store.commit(`${base}/inc`);
    expect(vm.number).toEqual(1);
  });
});
