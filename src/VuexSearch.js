import mutations from './mutations';
import getters from './getters';
import actionsWithSearch from './actions';
import * as actionTypes from './action-types';
import * as getterTypes from './getter-types';
import * as mutationTypes from './mutation-types';
import { debounce } from './utils';

/* eslint-disable no-underscore-dangle */

/**
 * Class that creates submodule in Vuex Store, and manages watched
 * states registration and unregistration, and SearchApi subscriptions.
 */
class VuexSearch {
  /**
   * Constructor.
   *
   * @param {Store} store A vuex store instance.
   * @param {[resourceName: string]: { getter, indexes, searchApi? }} resources
   *    Options of resources and its index fields, getter, and optional searchApi.
   * @param {SearchApi} searchApi Custom SearchApi to be used and shared by resources
   *    with no custom searchApi.
   */
  constructor({
    store,
    resources,
    searchApi,
  }) {
    this._base = VuexSearch.base;
    this._store = store;
    this._defaultSearchApi = searchApi;
    this._searchMap = {};
    this._resourceOptions = {};
    this._unwatchResource = {};
    this._customSearch = new Map();
    /* eslint-disable-next-line no-param-reassign */
    store.search = this;

    this._initModule();
    this._initResources(resources);
  }

  /**
   * Share map from resourceName to searchApi with actions
   * and register VuexSearch submodule on Vuex Store.
   */
  _initModule() {
    const actions = actionsWithSearch(this._searchMap);

    this._store.registerModule(this._base, {
      namespaced: true,
      root: true,
      mutations,
      actions,
      getters,
      state: {},
    });
  }

  /**
   * Initialize all resources which are statically defined in store.
   *
   * @param {[resourceName: string]: { getter, indexe, watch?, searchApi? }} resources
   *    Options of resources and its index fields, getter, and optional watch and searchApi
   */
  _initResources(resources) {
    Object.entries(resources).forEach(([resourceName, config]) => {
      this.registerResource(resourceName, config);
    });
  }

  /**
   * - Public API -
   * Dynamically register resource for indexing.
   *
   * @param resourceName Uniquely identifies the resource (eg. "databases").
   *
   * config:
   * @param {(state: Object) => Array|Object} getter Function getter
   *    to access resource and to be watched.
   * @param {string[]} index Fields to be indexed.
   * @param {Boolean|Object} [watch] Options to reindex if resource changes
   * @param {SearchApi} [searchApi] Custom SearchApi for this resource.
   */
  registerResource(resourceName, config) {
    const store = this._store;
    const namespace = this._getNamespace(this._base);

    store.commit(`${namespace}${mutationTypes.SET_INIT_RESOURCE}`, { resourceName });

    const { getter, index, watch = true, searchApi = this._defaultSearchApi } = config;

    this._searchMap[resourceName] = searchApi;
    this._resourceOptions[resourceName] = { getter, index };

    this._searchSubscribeIfNecessary(searchApi, resourceName, ({ result, text }) => {
      this._store.dispatch(`${namespace}${actionTypes.RECEIVE_RESULT}`, {
        result, resourceName, text,
      });
    });

    this.reindex(resourceName);

    const initialSearchString = this._getSearchText(resourceName);
    this.search(resourceName, initialSearchString);

    if (watch) {
      const watchCb = () => {
        const searchString = this._getSearchText(resourceName);

        this.reindex(resourceName);
        this.search(resourceName, searchString);
      };

      const { delay = 0 } = watch;

      this._unwatchResource[resourceName] = store.watch(
        getter,
        debounce(watchCb, delay),
        { deep: true },
      );
    }
  }

  /**
   * - Public API -
   * Search wrapper function for dispatching search action.
   *
   * @param {String} resourceName Uniquely identifies the resource (eg. "databases").
   * @param {String} searchString Text to search.
   */
  search(resourceName, searchString) {
    const store = this._store;
    const namespace = this._getNamespace(this._base);

    store.dispatch(`${namespace}${actionTypes.SEARCH}`, {
      resourceName, searchString,
    });
  }

  /**
   * - Public API -
   * Reindex resource wrapper function for dispatching reindex action.
   *
   * This method is useful to avoid passing index fields and getter function
   * of the resource.
   *
   * @param {String} resourceName Uniquely identifies the resource (eg. "databases").
   */
  reindex(resourceName) {
    const store = this._store;
    const namespace = this._getNamespace(this._base);

    const { getter, index } = this._resourceOptions[resourceName];

    store.dispatch(`${namespace}${actionTypes.searchApi.INDEX_RESOURCE}`, {
      fieldNamesOrIndexFunction: index,
      resourceName,
      resources: getter(store.state),
    });

    const searchString = this._getSearchText(resourceName);
    this.search(resourceName, searchString);
  }

  /**
   * - Public API -
   * Unregister resource from indexing.
   * This method will unwatch state changes and unsubscribe from searchApi
   * used by the resource.
   *
   * @param resourceName Resource name to be unregistered.
   */
  unregisterResource(resourceName) {
    const store = this._store;
    const namespace = this._getNamespace(this._base);

    delete this._resourceOptions[resourceName];

    const searchApi = this._searchMap[resourceName];
    this._searchUnsubscribeIfNecessary(searchApi, resourceName);
    searchApi.stopSearch(resourceName);
    delete this._searchMap[resourceName];

    const unwatch = this._unwatchResource[resourceName];
    if (unwatch instanceof Function) unwatch();
    delete this._unwatchResource[resourceName];

    store.commit(`${namespace}${mutationTypes.DELETE_RESOURCE}`, { resourceName });
  }

  /**
   * Register resourceName to be kept tracked by customSearch map and check
   * whether need to subscribe if the searchApi is not yet subscribed.
   *
   * customSearch is a map from searchApi instance to list of resources using it
   * and unsubscribe callback.
   *
   * @param {SearchApi} searchApi SearchApi instance to be subscribed.
   *    Will be checked if already been subscribed to prevent duplication.
   * @param resourceName Resource to be kept tracked by the map.
   * @param {({ result: string[], resourceName, text }) => void} fn callback to be subscribed.
   */
  _searchSubscribeIfNecessary(searchApi, resourceName, fn) {
    const map = this._customSearch.get(searchApi);
    if (!map) {
      this._customSearch.set(
        searchApi, {
          unsubscribe: searchApi.subscribe(fn),
          resources: [resourceName],
        });
    } else {
      map.resources.push(resourceName);
    }
  }

  /**
   * Remove a resource from searchApi's resources list and
   * unsubscribe searchApi if no resources using it anymore.
   *
   * @param {SearchApi} searchApi SearchApi instance to be unsubscribed.
   * @param resourceName Resource to be removed from customSearch map.
   */
  _searchUnsubscribeIfNecessary(searchApi, resourceName) {
    const map = this._customSearch.get(searchApi);
    if (map.resources.length === 1) {
      map.unsubscribe();
      this._customSearch.delete(searchApi);
    } else {
      map.resources = map.resources.filter(name => name !== resourceName);
    }
  }

  /**
   * Wrapper function for getting resource index search text.
   *
   * @param {String} resourceName
   * @returns {String}
   */
  _getSearchText(resourceName) {
    const store = this._store;
    const namespace = this._getNamespace(this._base);

    return store.getters[`${namespace}${getterTypes.resourceIndexByName}`](resourceName).text;
  }

  /**
   * Get namespace from Vuex Store's modules' internal map of
   * module path to namespace.
   * @param {String} path
   * @returns {String}
   */
  _getNamespace(...modulePath) {
    return this._store._modules.getNamespace(modulePath);
  }
}

/**
 * Generate map of actions to be exposed.
 */
function getPublicApi() {
  const publicApi = {};
  Object
    .getOwnPropertyNames(VuexSearch.prototype)
    .filter(methodName => !methodName.startsWith('_'))
    .forEach((methodName) => { publicApi[methodName] = methodName; });

  Object.freeze(publicApi);

  return publicApi;
}

/**
 * VuexSearch static property 'base'.
 */
let base = 'vuexSearch';
Object.defineProperty(VuexSearch, 'base', {
  get() { return base; },
  set(newBase) { base = newBase; },
});

export const publicApi = getPublicApi();
export default VuexSearch;
