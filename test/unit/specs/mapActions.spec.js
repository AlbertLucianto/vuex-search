import Vue from 'vue';
import Vuex from 'vuex';
import mapActions, { transformPayload } from 'vuex-search/mapActions';
import * as actionTypes from 'vuex-search/action-types';

describe('transformPayload', () => {
  test('should transform payload accordingly', () => {
    const resourceName = 'test';
    const args = ['arg1', 'arg2'];

    const searchPayload = transformPayload(resourceName, actionTypes.SEARCH, args);
    expect(searchPayload).toEqual([{ resourceName, searchString: 'arg1' }]);

    const otherPayload = transformPayload(resourceName, 'anActionType', args);
    expect(otherPayload).toEqual(args);
  });
});

Vue.use(Vuex);

describe('mapActions', () => {
  test('should map actions and convert payloads accordingly', () => {
    const base = 'test';
    const search = jest.fn();
    const otherMethod = jest.fn();
    const store = new Vuex.Store({});
    store.search = { _base: base };

    store.registerModule(base, {
      namespaced: true,
      actions: {
        [actionTypes.SEARCH]: search,
        otherMethod,
      },
    });

    const resourceName = 'test';
    const actionMap = {
      methodOne: actionTypes.SEARCH,
      methodTwo: 'otherMethod',
    };

    const vm = new Vue({
      store,
      methods: mapActions(resourceName, actionMap),
    });

    vm.methodOne('word');
    expect(search).toBeCalledWith(
      expect.anything(Object),
      { resourceName, searchString: 'word' },
      undefined,
    );

    const payload = { data: 'test' };
    vm.methodTwo(payload);
    expect(otherMethod).toBeCalledWith(
      expect.anything(),
      payload,
      undefined,
    );
  });
});
