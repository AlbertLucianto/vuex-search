import mutations from './mutations';
import getters from './getters';
import actionsWithSearch from './actions';
import * as actionTypes from './action-types';
import * as getterTypes from './getter-types';
import * as mutationTypes from './mutation-types';

class VuexSearch {
  constructor({
    store,
    resources,
    searchApi,
  }) {
    this._base = VuexSearch.base;
    this._store = store;
    this._defaultSearchApi = searchApi;
    this._searchMap = {};
    this._unwatchResource = {};
    this._customSearch = new Map();
    /* eslint-disable-next-line no-param-reassign */
    store.search = this;

    this.initModule();
    this.initResources(resources);
  }

  initModule() {
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

  initResources(resources) {
    Object.entries(resources).forEach(([resourceName, config]) => {
      this.registerResource(resourceName, config);
    });
  }

  registerResource(resourceName, config) {
    const store = this._store;
    const namespace = this.getNamespace(this._base);

    store.commit(`${namespace}${mutationTypes.SET_INIT_RESOURCE}`, { resourceName });

    const { getter, index, searchApi = this._defaultSearchApi } = config;

    this._searchMap[resourceName] = searchApi;

    this.searchSubscribeIfNecessary(searchApi, resourceName, ({ result, text }) => {
      this._store.dispatch(`${namespace}${actionTypes.RECEIVE_RESULT}`, {
        result, resourceName, text,
      });
    });

    store.dispatch(`${namespace}${actionTypes.searchApi.INDEX_RESOURCE}`, {
      fieldNamesOrIndexFunction: index,
      resourceName,
      resources: getter(store.state),
    });

    const initialSearchString = store.getters[`${namespace}${getterTypes.resourceIndexByName}`](resourceName).text;
    store.dispatch(`${namespace}${actionTypes.SEARCH}`, {
      resourceName, searchString: initialSearchString,
    });

    this._unwatchResource[resourceName] = store.watch(getter, (data) => {
      const searchString = store.getters[`${namespace}${getterTypes.resourceIndexByName}`](resourceName).text;

      store.dispatch(`${namespace}${actionTypes.searchApi.INDEX_RESOURCE}`, {
        fieldNamesOrIndexFunction: index,
        resourceName,
        resources: data,
      });
      store.dispatch(`${namespace}${actionTypes.SEARCH}`, {
        resourceName, searchString,
      });
    }, { deep: true });
  }

  unregisterResource(resourceName) {
    const store = this._store;
    const namespace = this.getNamespace(this._base);

    const searchApi = this._searchMap[resourceName];
    this.searchUnsubscribeIfNecessary(searchApi, resourceName);
    searchApi.stopSearch(resourceName);
    delete this._searchMap[resourceName];

    const unwatch = this._unwatchResource[resourceName];
    unwatch();
    delete this._unwatchResource[resourceName];

    store.commit(`${namespace}${mutationTypes.DELETE_RESOURCE}`, { resourceName });
  }

  searchSubscribeIfNecessary(searchApi, resourceName, fn) {
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

  searchUnsubscribeIfNecessary(searchApi, resourceName) {
    const map = this._customSearch.get(searchApi);
    if (map.resources.length === 1) {
      map.unsubscribe();
      this._customSearch.delete(searchApi);
    } else {
      map.resources = map.resources.filter(name => name !== resourceName);
    }
  }

  getNamespace(...modulePath) {
    return this._store._modules.getNamespace(modulePath);
  }
}

let base = 'vuexSearch';

Object.defineProperty(VuexSearch, 'base', {
  get() { return base; },
  set(newBase) { base = newBase; },
});

export default VuexSearch;
