import Vue from 'vue';
import Vuex from 'vuex';
import getters from 'vuex-search/getters';
import * as getterTypes from 'vuex-search/getter-types';

Vue.use(Vuex);

function getStore() {
  const initialState = {
    test: {
      result: [],
      isSearching: false,
      text: '',
    },
  };

  return new Vuex.Store({
    getters,
    state: initialState,
  });
}

describe('getters', () => {
  test('should get resource details by resourceName', () => {
    const store = getStore();
    const resource = store.getters[getterTypes.resourceIndexByName]('test');

    expect(resource).toEqual({
      result: [],
      isSearching: false,
      text: '',
    });
  });

  test('should get isSearching by resourceName', () => {
    const store = getStore();
    const isSearching = store.getters[getterTypes.isSearchingByName]('test');

    expect(isSearching).toEqual(false);
  });

  test('should get isSearching by resourceName', () => {
    const store = getStore();
    const result = store.getters[getterTypes.resultByName]('test');

    expect(result).toEqual([]);
  });
});
