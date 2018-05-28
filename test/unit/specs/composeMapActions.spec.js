import Vue from 'vue';
import Vuex from 'vuex';
import composeMapActions, { transformMethods } from 'vuex-search/composeMapActions';
import * as actionTypes from 'vuex-search/action-types';
import defaultConfigs from 'vuex-search/defaultConfigs';

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
  test('should return transformed methods on defaultName', () => {
    const search = jest.fn();
    const otherMethod = jest.fn();
    const store = new Vuex.Store({});

    store.registerModule(defaultConfigs.defaultName, {
      namespaced: true,
      actions: {
        [actionTypes.SEARCH]: search,
        otherMethod,
      },
    });

    const mapActions = composeMapActions(undefined, '');

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

  test('should return transformed methods with moduleBaseName', () => {
    const search = jest.fn();
    const otherMethod = jest.fn();
    const store = new Vuex.Store({});

    store.registerModule(defaultConfigs.moduleBaseName, {
      namespaced: true,
      actions: {
        [actionTypes.SEARCH]: search,
        otherMethod,
      },
    });

    const mapActions = composeMapActions('');

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
