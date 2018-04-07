export const getterNames = {
  resourceIndexByName: '@@vuexSearch/getter/resourceIndex',
  isSearchingByName: '@@vuexSearch/getter/isSearching',
  resultByName: '@@vuexSearch/getter/result',
};

export default {
  [getterNames.resourceIndexByName]: state => resourceName => state[resourceName],
  [getterNames.isSearchingByName]: state => resourceName => state[resourceName].isSearching,
  [getterNames.resultByName]: state => resourceName => state[resourceName].result,
};
