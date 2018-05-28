import actionsWithSearch from './actions';
import defaultConfigs from './defaultConfigs';
import mutations from './mutations';
import getters from './getters';
import * as getterTypes from './getter-types';
import * as actionTypes from './action-types';
import SubscribableSearchApi from './SearchApi';

import { resourceGetterWrapper } from './utils';

/**
 * Register VuexStore module
 *
 * @param {Store} store
 */
export function initVuexSearch(store) {
  const {
    moduleBaseName,
    namespaced,
  } = defaultConfigs;

  store.registerModule(moduleBaseName, { state: {}, namespaced });
}

/**
 * Vuex binding for client-side search with indexer and Web Workers
 *
 * @param {[resourceName: string]: [string]} resourceIndexes
 *   Dictionary for which to index
 * @param {(resourceName: string, store: Store) => State} resourceGetter
 *   Resource to watch and index
 * @param {SearchApi} searchApi Optional, can also use custom SearchApi instances
 * @param {string} name Submodule name in VuexSearch module
 * @param {object} options
 */
export default function vuexSearchPlugin({
  resourceIndexes = {},
  resourceGetter,
  searchApi = new SubscribableSearchApi(),
  name = defaultConfigs.defaultName,
} = {}) {
  return (store) => {
    const actions = actionsWithSearch(searchApi);

    const searchModulePath = [defaultConfigs.moduleBaseName, name];

    if (!store.state[defaultConfigs.moduleBaseName]) {
      initVuexSearch(store);
      vuexSearchPlugin._modules = store._modules;
    }

    store.registerModule(searchModulePath, {
      namespaced: true,
      root: true,
      mutations,
      actions,
      getters,
      state: {},
    });

    const namespace = vuexSearchPlugin._modules.getNamespace(searchModulePath);

    const resourceNames = Object.keys(resourceIndexes);
    store.dispatch(`${namespace}${actionTypes.INITIALIZE_RESOURCES}`, { resourceNames });

    searchApi.subscribe(({ result, resourceName, text }) => {
      store.dispatch(`${namespace}${actionTypes.RECEIVE_RESULT}`, { result, resourceName, text });
    });

    if (resourceGetter) {
      resourceNames.forEach((resourceName) => {
        const _resourceGetter = resourceGetterWrapper(resourceName, resourceGetter);

        store.dispatch(`${namespace}${actionTypes.searchApi.INDEX_RESOURCE}`, {
          fieldNamesOrIndexFunction: resourceIndexes[resourceName],
          resourceName,
          resources: _resourceGetter(store.state),
        });
        const initialSearchString = store.getters[`${namespace}${getterTypes.resourceIndexByName}`](resourceName).text;
        store.dispatch(`${namespace}${actionTypes.SEARCH}`, { resourceName, searchString: initialSearchString });

        store.watch(_resourceGetter, (data) => {
          const resourceIndex = resourceIndexes[resourceName];
          const searchString = store.getters[`${namespace}${getterTypes.resourceIndexByName}`](resourceName).text;

          store.dispatch(`${namespace}${actionTypes.searchApi.INDEX_RESOURCE}`, {
            fieldNamesOrIndexFunction: resourceIndex,
            resourceName,
            resources: data,
          });
          store.dispatch(`${namespace}${actionTypes.SEARCH}`, { resourceName, searchString });
        }, { deep: true });
      });
    }
  };
}
