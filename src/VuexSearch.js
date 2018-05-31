import mutations from './mutations';
import getters from './getters';
import actionsWithSearch from './actions';
import * as actionTypes from './action-types';
import * as getterTypes from './getter-types';
import * as mutationTypes from './mutation-types';

class VuexSearch {
  static base = 'vuexSearch';

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
    this._unsubscribeSearch = {};
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

    const ns = this.getNamespace(this._base);

    this._defaultSearchApi.subscribe(({ result, resourceName, text }) => {
      this._store.dispatch(`${ns}${actionTypes.RECEIVE_RESULT}`, {
        result, resourceName, text,
      });
    });
  }

  registerResource(resourceName, config) {
    const store = this._store;
    const namespace = this.getNamespace(this._base);

    store.commit(`${namespace}${mutationTypes.SET_INIT_RESOURCE}`, { resourceName });

    const { getter, index, searchApi } = config;

    this._searchMap[resourceName] = searchApi || this._defaultSearchApi;

    // If custom searchApi is provided, it needs to be subscribed and unsubscribed separately
    if (searchApi) {
      this._unsubscribeSearch[resourceName] = searchApi.subscribe(({ result, text }) => {
        this._store.dispatch(`${namespace}${actionTypes.RECEIVE_RESULT}`, {
          result, resourceName, text,
        });
      });
    }

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
    this._searchMap[resourceName].stopSearch(resourceName);
    delete this._searchMap[resourceName];

    const unsubscribe = this._unsubscribeSearch[resourceName];
    if (unsubscribe instanceof Function) {
      unsubscribe();
    }

    this._unwatchResource[resourceName]();
  }

  getNamespace(...modulePath) {
    return this._store._modules.getNamespace(modulePath);
  }
}

export default VuexSearch;
