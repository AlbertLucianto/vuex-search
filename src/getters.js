import * as getterTypes from './getter-types';

export default {
  [getterTypes.resourceIndexByName]: state => resourceName => state[resourceName],
  [getterTypes.isSearchingByName]: state => resourceName => state[resourceName].isSearching,
  [getterTypes.resultByName]: state => resourceName => state[resourceName].result,
};
