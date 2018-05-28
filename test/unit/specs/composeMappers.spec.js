import Vue from 'vue';
import Vuex from 'vuex';
import composeMappers from 'vuex-search/composeMappers';
import * as actionTypes from 'vuex-search/action-types';

Vue.use(Vuex);

describe('composeMappers', () => {
  test('should compose mapSearchActions and mapSearchGetters based on plugin\'s name', () => {
    const store = new Vuex.Store({});

    const fn = jest.fn();

    store.registerModule('base', {
      namespaced: true,
      state: {
        test: { count: 0 },
      },
      actions: {
        [actionTypes.SEARCH]: fn,
      },
      getters: {
        count: state => resourceName => state[resourceName].count,
      },
    });

    const { mapSearchActions, mapSearchGetters } = composeMappers('', 'base');

    const resourceName = 'test';

    const vm = new Vue({
      store,
      methods: mapSearchActions(resourceName, { search: actionTypes.SEARCH }),
      computed: mapSearchGetters(resourceName, ['count']),
    });

    expect(vm.count).toEqual(0);

    vm.search('word');
    expect(fn).toBeCalledWith(
      expect.anything(Object),
      { resourceName, searchString: 'word' },
      undefined,
    );
  });
});
