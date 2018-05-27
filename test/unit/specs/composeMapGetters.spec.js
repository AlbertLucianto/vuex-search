import Vue from 'vue';
import Vuex from 'vuex';
import composeMapGetters, { transformComputed } from 'vuex-search/composeMapGetters';

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
