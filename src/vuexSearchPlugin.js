import actionsWithSearch from './actions';
import mutations from './mutations';
import getters, { getterNames } from './getters';
import * as actionTypes from './action-types';
import SubscribableSearchApi from './SearchApi';

import { resourceGetterWrapper } from './utils';

/**
 * Declared here to achieve encapsulation
 */
const _configs = {
  moduleBaseName: 'vuexSearch',
  defaultName: 'default',
  namespaced: true,
};

/**
 * Register VuexStore module
 *
 * @param {Store} store
 */
function initVuexSearch(store) {
  const {
    moduleBaseName,
    namespaced,
  } = _configs;

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
  name = _configs.defaultName,
  options = {},
} = {}) {
  return (store) => {
    const { namespaced = true } = options;
    const actions = actionsWithSearch(searchApi);

    const searchModulePath = [_configs.moduleBaseName, name];

    if (!store.state[_configs.moduleBaseName]) {
      initVuexSearch(store);
      vuexSearchPlugin._getNamespace = store._modules.getNamespace.bind(store._modules);
    }

    store.registerModule(searchModulePath, {
      namespaced,
      mutations,
      actions,
      getters,
      state: {},
    });

    if (!vuexSearchPlugin.instantiated) {
      Object.freeze(_configs);
      vuexSearchPlugin.instantiated = true;
    }

    const namespace = vuexSearchPlugin._getNamespace(searchModulePath);

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

/**
 * Configure VuexSearch Plugin before plugin creation.
 *
 * @param {string} moduleBaseName Defining vuex search module name in store (default: 'vuexSearch')
 * @param {boolean} namespaced Should this plugin namespaced in store (default: true)
 * @param {string} defaultName Unless 'name' is provided, index will use 'defaultName'
 *   config as submodule name
 */
vuexSearchPlugin.configure = (options) => {
  if (vuexSearchPlugin.instantiated) {
    const msg = `
      [Vuex Search] Can't set configuration once a plugin is created.
      It must be set before plugin creation.
    `;
    console.error(msg); // eslint-disable-line
    return;
  }

  const configurables = Object.keys(_configs);

  Object.entries(options).forEach(([key, value]) => {
    if (configurables.includes(key)) {
      _configs[key] = value;
    } else {
      console.error(`[Vuex Search] Unknown configuration '${key}'`); // eslint-disable-line
    }
  });
};

/**
 * Making gettable only property (unsettable).
 */
Object.defineProperty(vuexSearchPlugin, 'configs', {
  get() { return _configs; },
});
