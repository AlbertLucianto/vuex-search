import Vue from 'vue';
import Vuex from 'vuex';
import mapActions from 'vuex-search/mapActions';
import { publicApi } from 'vuex-search/VuexSearch';

Vue.use(Vuex);

describe('mapActions', () => {
  test('should map actions, call VuexSearch, and dispatch action', () => {
    const base = 'test';
    const search = jest.fn();
    const store = new Vuex.Store({});
    const mockedVuexSearch = {
      _base: base,
      search,
    };

    store.search = mockedVuexSearch;

    const resourceName = 'test';
    const actionMap = {
      method: publicApi.search,
    };

    const vm = new Vue({
      store,
      methods: mapActions(resourceName, actionMap),
    });

    vm.method('word');
    expect(search).toBeCalledWith(
      resourceName,
      'word',
    );
  });

  test('should throw when unknown actionType is mapped', () => {
    const resourceName = 'test';
    const actionMap = {
      method: 'someUnknownMethod',
    };

    expect(() => mapActions(resourceName, actionMap)).toThrow('unknown');
  });
});
