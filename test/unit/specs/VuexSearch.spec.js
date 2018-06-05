import Vue from 'vue';
import Vuex from 'vuex';
import { INDEX_MODES } from 'js-worker-search';
import SearchApi from 'vuex-search/SearchApi';
import VuexSearch from 'vuex-search/VuexSearch';

Vue.use(Vuex);

function getByPath(obj, path) {
  return path.reduce((acc, key) => acc[key], obj);
}

const mutationTypes = {
  EDIT_VALUE: 'EDIT_VALUE',
};

const mutations = {
  [mutationTypes.EDIT_VALUE]: (state, {
    resourcePath,
    key,
    value,
  }) => {
    Vue.set(getByPath(state, resourcePath), key, value);
  },
};

function getPlugin({ resources, searchApi = new SearchApi() }) {
  const documentA = { id: 1, name: 'One', description: 'The first document' };
  const documentB = { id: 2, name: 'Two', description: 'The second document' };
  const documentC = { id: 3, name: 'Three', description: 'The third document' };
  const documentD = { id: 4, name: 'Four', description: 'The 4th (fourth) document' };

  const contactA = { id: 1, name: 'One', description: 'The first contact' };
  const contactB = { id: 2, name: 'Two', description: 'The second contact' };
  const contactC = { id: 3, name: 'Three', description: 'The third contact' };
  const contactD = { id: 4, name: 'Four', description: 'The 4th (fourth) contact' };

  const initialState = {
    resources: {
      documents: [documentA, documentB, documentC, documentD],
      contacts: [contactA, contactB, contactC, contactD],
    },
  };

  const store = new Vuex.Store({
    mutations,
    state: initialState,
  });

  return new VuexSearch({
    store,
    resources,
    searchApi,
  });
}

describe('VuexSearch', () => {
  test('should index and start searching on initialisation', () => {
    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
        },
      },
    });

    const store = vuexSearch._store;
    const documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).not.toBeUndefined();

    expect(documentIndex.isSearching).toEqual(true);
    expect(documentIndex.result.length).toEqual(0);
    expect(documentIndex.text).toEqual('');
  });

  test('should dispatch search result after initialisation', async (done) => {
    const searchApi = new SearchApi();
    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
        },
      },
      searchApi,
    });

    const store = vuexSearch._store;
    let documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).not.toBeUndefined();

    const subscribeCb = jest.fn();
    searchApi.subscribe(subscribeCb);
    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });
    expect(subscribeCb).toBeCalledWith(
      { result: ['1', '2', '3', '4'], resourceName: 'documents', text: '' },
    );

    documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex.isSearching).toEqual(false);
    expect(documentIndex.result.length).toEqual(4);
    expect(documentIndex.text).toEqual('');
    done();
  });

  test('should dispatch search result after search', async (done) => {
    const searchApi = new SearchApi();
    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
        },
      },
      searchApi,
    });

    const store = vuexSearch._store;
    let documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).not.toBeUndefined();

    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });

    vuexSearch.search('documents', 'One');

    documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex.isSearching).toEqual(true);
    expect(documentIndex.text).toEqual('One');

    const subscribeCb = jest.fn();
    searchApi.subscribe(subscribeCb);
    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });

    expect(subscribeCb).toBeCalledWith(
      { result: [1], resourceName: 'documents', text: 'One' },
    );

    documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex.isSearching).toEqual(false);
    expect(documentIndex.result.length).toEqual(1);
    expect(documentIndex.text).toEqual('One');

    done();
  });

  test('should reindex and research on resource change', async (done) => {
    const searchApi = new SearchApi();
    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
        },
      },
      searchApi,
    });

    const store = vuexSearch._store;
    let documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).not.toBeUndefined();

    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });

    vuexSearch.search('documents', 'New');

    const subscribeCb = jest.fn();
    searchApi.subscribe(subscribeCb);
    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });

    expect(subscribeCb).toBeCalledWith(
      { result: [], resourceName: 'documents', text: 'New' },
    );

    store.commit(mutationTypes.EDIT_VALUE, {
      resourcePath: ['resources', 'documents', 0],
      key: 'name',
      value: 'NewOne',
    });

    Vue.nextTick(async () => {
      await new Promise((resolve) => {
        searchApi.subscribe(resolve);
      });

      documentIndex = store.state[vuexSearch._base].documents;
      expect(documentIndex.isSearching).toEqual(false);
      expect(documentIndex.result.length).toEqual(1);
      expect(documentIndex.text).toEqual('New');

      done();
    });
  });

  test('should use custom searchApi if defined in resource option', async (done) => {
    const searchApiCustom = new SearchApi({ indexMode: INDEX_MODES.PREFIXES });
    const searchApiShared = new SearchApi();

    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
          searchApi: searchApiCustom,
        },
        contacts: {
          index: ['name', 'description'],
          getter: state => state.resources.contacts,
        },
      },
      searchApi: searchApiShared,
    });

    const store = vuexSearch._store;
    let documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).not.toBeUndefined();

    expect(vuexSearch._searchMap.documents).not.toBe(searchApiShared);
    expect(vuexSearch._searchMap.documents).toBe(searchApiCustom);
    expect(vuexSearch._searchMap.contacts).not.toBe(searchApiCustom);
    expect(vuexSearch._searchMap.contacts).toBe(searchApiShared);

    vuexSearch.search('documents', 'econd');

    let subscribeCb = jest.fn();
    searchApiCustom.subscribe(subscribeCb);
    await new Promise((resolve) => {
      searchApiCustom.subscribe(resolve);
    });

    // Documents index uses PREFIXES mode, thus search should yield 0 result
    documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex.isSearching).toEqual(false);
    expect(documentIndex.result.length).toEqual(0);
    expect(documentIndex.text).toEqual('econd');

    vuexSearch.search('contacts', 'econd');

    subscribeCb = jest.fn();
    searchApiShared.subscribe(subscribeCb);
    await new Promise((resolve) => {
      searchApiShared.subscribe(resolve);
    });

    // Contacts index uses default, thus search should yield 1 result
    const contactIndex = store.state[vuexSearch._base].contacts;
    expect(contactIndex.isSearching).toEqual(false);
    expect(contactIndex.result.length).toEqual(1);
    expect(contactIndex.text).toEqual('econd');

    done();
  });

  test('should unwatch / unsubscribe things related to resourceName', () => {
    const searchApiCustom = new SearchApi();
    const searchApiShared = new SearchApi();

    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
          searchApi: searchApiCustom,
        },
        contacts: {
          index: ['name', 'description'],
          getter: state => state.resources.contacts,
          watch: false,
        },
      },
      searchApi: searchApiShared,
    });

    const store = vuexSearch._store;
    let documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).not.toBeUndefined();

    expect(vuexSearch._unwatchResource.documents instanceof Function).toBe(true);
    expect(vuexSearch._unwatchResource.contacts).toBeUndefined();
    expect(searchApiCustom._onNextSubscribers.length).toEqual(1);

    vuexSearch.unregisterResource('documents');
    expect(vuexSearch._unwatchResource.documents).toBeUndefined();
    expect(vuexSearch._searchMap.documents).toBeUndefined();
    // Ensure searchApi itself is not deleted
    expect(searchApiCustom).not.toBeUndefined();
    documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).toBeUndefined();
    expect(searchApiCustom._onNextSubscribers.length).toEqual(0);

    vuexSearch.unregisterResource('contacts');
    expect(vuexSearch._searchMap.contacts).toBeUndefined();
    // Ensure searchApi itself is not deleted
    expect(searchApiShared).not.toBeUndefined();
    const contactIndex = store.state[vuexSearch._base].contacts;
    expect(contactIndex).toBeUndefined();
  });

  test('should keep track same custom searchApi for multiple resources', () => {
    const searchApi = new SearchApi();

    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
          searchApi,
        },
        contacts: {
          index: ['name', 'description'],
          getter: state => state.resources.contacts,
          searchApi,
        },
      },
    });

    expect(searchApi._onNextSubscribers.length).toEqual(1);

    vuexSearch.unregisterResource('documents');
    expect(searchApi._onNextSubscribers.length).toEqual(1);

    vuexSearch.unregisterResource('contacts');
    expect(searchApi._onNextSubscribers.length).toEqual(0);
  });

  test('should not auto reindex if set watch to false', async (done) => {
    const searchApi = new SearchApi();
    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
          watch: false,
        },
      },
      searchApi,
    });

    const store = vuexSearch._store;
    let documentIndex = store.state[vuexSearch._base].documents;
    expect(documentIndex).not.toBeUndefined();

    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });

    store.commit(mutationTypes.EDIT_VALUE, {
      resourcePath: ['resources', 'documents', 0],
      key: 'name',
      value: 'Five',
    });

    Vue.nextTick(async () => {
      vuexSearch.search('documents', 'Five');

      await new Promise((resolve) => {
        searchApi.subscribe(resolve);
      });

      documentIndex = store.state[vuexSearch._base].documents;
      expect(documentIndex.isSearching).toEqual(false);
      expect(documentIndex.result.length).toEqual(0);
      expect(documentIndex.text).toEqual('Five');

      vuexSearch.reindex('documents');

      await new Promise((resolve) => {
        searchApi.subscribe(resolve);
      });

      documentIndex = store.state[vuexSearch._base].documents;
      expect(documentIndex.isSearching).toEqual(false);
      expect(documentIndex.result.length).toEqual(1);
      expect(documentIndex.text).toEqual('Five');

      done();
    });
  });

  test('should use new base name before plugin definition', () => {
    const oldBase = VuexSearch.base;
    const newBase = 'newBaseName';
    VuexSearch.base = newBase;

    const vuexSearch = getPlugin({
      resources: {
        documents: {
          index: ['name', 'description'],
          getter: state => state.resources.documents,
        },
      },
    });

    expect(vuexSearch._base).toEqual(newBase);

    const store = vuexSearch._store;
    const documentIndex = store.state[newBase].documents;
    expect(documentIndex).not.toBeUndefined();

    VuexSearch.base = oldBase;
  });
});
