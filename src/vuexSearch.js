import actionsWithSearch from './actions';
import mutations from './mutations';
import getters, { getterNames } from './getters';
import * as actionTypes from './action-types';
import SubscribableSearchApi from './SearchApi';

import { normalizeNamespaceName, modulePathToNamespace, resourceGetterWrapper } from './utils';

export default function vuexSearch({
  resourceIndexes = {},
  resourceGetter,
  searchApi = new SubscribableSearchApi(),
  searchModulePath = 'search',
  options = {},
} = {}) {
  return (store) => {
    const { isNamespaced = true } = options;
    const actions = actionsWithSearch(searchApi);

    store.registerModule(searchModulePath, {
      namespaced: isNamespaced,
      mutations,
      actions,
      getters,
      state: {},
    });

    let namespace;

    if (options.namespace !== undefined) {
      namespace = normalizeNamespaceName(options.namespace);
    } else {
      namespace = (isNamespaced ? modulePathToNamespace(searchModulePath) : '');
    }

    const resourceNames = Object.keys(resourceIndexes);
    store.dispatch(`${namespace}${actionTypes.INITIALIZE_RESOURCES}`, { resourceNames });

    searchApi.subscribe(({ result, resourceName, text }) => {
      store.dispatch(`${namespace}${actionTypes.RECEIVE_RESULT}`, { result, resourceName, text });
    }, (error) => {
      throw error;
    });

    if (resourceGetter) {
      resourceNames.forEach((resourceName) => {
        const _resourceGetter = resourceGetterWrapper(resourceName, resourceGetter);

        store.watch(_resourceGetter, (data) => {
          const resourceIndex = resourceIndexes[resourceName];
          const searchString = store.getters[`${namespace}${getterNames.resourceIndexByName}`](resourceName).text;

          store.dispatch(`${namespace}${actionTypes.searchApi.INDEX_RESOURCE}`, {
            fieldNamesOrIndexFunction: resourceIndex,
            resourceName,
            resources: data,
          });
          store.dispatch(`${namespace}${actionTypes.SEARCH}`, { resourceName, searchString });
        });
      });
    }
  };
}
