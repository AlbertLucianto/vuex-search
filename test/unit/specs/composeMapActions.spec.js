import Vue from 'vue';
import Vuex from 'vuex';
import composeMapActions, { transformMethods } from 'vuex-search/composeMapActions';
import * as actionTypes from 'vuex-search/action-types';

describe('transformMethods', () => {
  test('should transform methods accordingly', () => {
    const resourceName = 'test';

    const actionMap = {
      methodOne: actionTypes.SEARCH,
      methodTwo: 'otherMethod',
    };

    const search = jest.fn();
    const otherMethod = jest.fn();
    const methodMap = {
      methodOne: search,
      methodTwo: otherMethod,
    };

    const transformedMethods = transformMethods(resourceName, actionMap)(methodMap);

    transformedMethods.methodOne('word');
    expect(search).toBeCalledWith({ resourceName, searchString: 'word' });

    const payload = { data: 'test' };
    transformedMethods.methodTwo(payload);
    expect(otherMethod).toBeCalledWith(payload);
  });
});

Vue.use(Vuex);

describe('composeMapActions', () => {
  test('should return transformed methods', () => {
    const search = jest.fn();
    const otherMethod = jest.fn();
    const store = new Vuex.Store({});

    store.registerModule('base', {
      namespaced: true,
      actions: {
        [actionTypes.SEARCH]: search,
        otherMethod,
      },
    });

    const mapActions = composeMapActions('', 'base');

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
