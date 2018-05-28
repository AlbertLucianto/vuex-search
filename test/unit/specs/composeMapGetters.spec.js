import Vue from 'vue';
import Vuex from 'vuex';
import composeMapGetters, { transformComputed } from 'vuex-search/composeMapGetters';
import defaultConfigs from 'vuex-search/defaultConfigs';

describe('transformComputed', () => {
  test('should transform computed accordingly', () => {
    const resourceName = 'test';

    const propOne = jest.fn();
    const propTwo = jest.fn();
    const getterOne = () => propOne;
    const getterTwo = () => propTwo;
    const mappedGetters = {
      computedOne: getterOne,
      computedTwo: getterTwo,
    };

    const transformedComputed = transformComputed(resourceName)(mappedGetters);

    transformedComputed.computedOne();
    expect(propOne).toBeCalledWith(resourceName);

    transformedComputed.computedTwo();
    expect(propTwo).toBeCalledWith(resourceName);
  });
});

Vue.use(Vuex);

describe('composeMapGetters', () => {
  test('should return transformed computed on defaultName', () => {
    const store = new Vuex.Store({});

    store.registerModule(defaultConfigs.defaultName, {
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

    const mapGetters = composeMapGetters(undefined, '');

    const resourceName = 'test';
    const computedMap = { number: 'count' };

    const vm = new Vue({
      store,
      computed: mapGetters(resourceName, computedMap),
    });

    expect(vm.number).toEqual(0);

    store.commit(`${defaultConfigs.defaultName}/inc`);
    expect(vm.number).toEqual(1);
  });

  test('should return transformed computed with moduleBaseName', () => {
    const store = new Vuex.Store({});

    store.registerModule(defaultConfigs.moduleBaseName, {
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

    const mapGetters = composeMapGetters('');

    const resourceName = 'test';
    const computedMap = { number: 'count' };

    const vm = new Vue({
      store,
      computed: mapGetters(resourceName, computedMap),
    });

    expect(vm.number).toEqual(0);

    store.commit(`${defaultConfigs.moduleBaseName}/inc`);
    expect(vm.number).toEqual(1);
  });
});
