import Vue from 'vue';
import Vuex from 'vuex';
import vuexSearchPlugin, { SearchApi } from 'vuex-search';
import { SEARCH } from 'vuex-search/action-types';
import dc from 'vuex-search/defaultConfigs';

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

function getStoreWithPlugins(plugins) {
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

  return new Vuex.Store({
    mutations,
    state: initialState,
    plugins,
  });
}

/** =====================================================
 *
 * Currently Vuex does not support plugin in submodules
 *
 * See: https://github.com/vuejs/vuex/issues/467
 *
 * ======================================================
 */
// function getSubmoduleWithPlugins(plugins, namespaced = false) {
//   const bookA = { id: 1, name: 'One', description: 'The first book' };
//   const bookB = { id: 2, name: 'Two', description: 'The second book' };
//   const bookC = { id: 3, name: 'Three', description: 'The third book' };
//   const bookD = { id: 4, name: 'Four', description: 'The 4th (fourth) book' };

//   const initialState = {
//     resources: {
//       books: [bookA, bookB, bookC, bookD],
//     },
//   };

//   return {
//     namespaced,
//     mutations,
//     state: initialState,
//     plugins,
//   };
// }

describe('one vuexSearchPlugin with: one resource; on main module', () => {
  test('should index and start searching on initialisation', (done) => {
    const store = getStoreWithPlugins([
      vuexSearchPlugin({
        resourceIndexes: {
          documents: ['name', 'description'],
        },
        resourceGetter: (resourceName, state) => state.resources[resourceName],
      }),
    ]);

    const documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex).not.toBeUndefined();

    expect(documentIndex.isSearching).toEqual(true);
    expect(documentIndex.result.length).toEqual(0);
    expect(documentIndex.text).toEqual('');
    done();
  });

  test('should dispatch search result after initialisation', async (done) => {
    const searchApi = new SearchApi();
    const store = getStoreWithPlugins([
      vuexSearchPlugin({
        searchApi,
        resourceIndexes: {
          documents: ['name', 'description'],
        },
        resourceGetter: (resourceName, state) => state.resources[resourceName],
      }),
    ]);

    let documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex).not.toBeUndefined();

    const subscribeCb = jest.fn();
    searchApi.subscribe(subscribeCb);
    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });
    expect(subscribeCb).toBeCalledWith(
      { result: ['1', '2', '3', '4'], resourceName: 'documents', text: '' },
    );

    documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex.isSearching).toEqual(false);
    expect(documentIndex.result.length).toEqual(4);
    expect(documentIndex.text).toEqual('');
    done();
  });

  test('should dispatch search result after search', async (done) => {
    const searchApi = new SearchApi();
    const store = getStoreWithPlugins([
      vuexSearchPlugin({
        searchApi,
        resourceIndexes: {
          documents: ['name', 'description'],
        },
        resourceGetter: (resourceName, state) => state.resources[resourceName],
      }),
    ]);

    let documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex).not.toBeUndefined();

    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });

    store.dispatch(`vuexSearch/default/${SEARCH}`, {
      resourceName: 'documents',
      searchString: 'One',
    });

    documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
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

    documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex.isSearching).toEqual(false);
    expect(documentIndex.result.length).toEqual(1);
    expect(documentIndex.text).toEqual('One');
    done();
  });

  test('should reindex and research on resource change', async (done) => {
    const searchApi = new SearchApi();
    const store = getStoreWithPlugins([
      vuexSearchPlugin({
        searchApi,
        resourceIndexes: {
          documents: ['name', 'description'],
        },
        resourceGetter: (resourceName, state) => state.resources[resourceName],
      }),
    ]);

    let documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex).not.toBeUndefined();

    await new Promise((resolve) => {
      searchApi.subscribe(resolve);
    });

    store.dispatch(`vuexSearch/default/${SEARCH}`, {
      resourceName: 'documents',
      searchString: 'New',
    });

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

      documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
      expect(documentIndex.isSearching).toEqual(false);
      expect(documentIndex.result.length).toEqual(1);
      expect(documentIndex.text).toEqual('New');

      done();
    });
  });

  test('should not watch any resources if resourceGetter is not defined', () => {
    const store = getStoreWithPlugins([
      vuexSearchPlugin({
        resourceIndexes: {
          documents: ['name', 'description'],
        },
      }),
    ]);

    const documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex).not.toBeUndefined();
  });

  test('should not add any indexer if resourceIndexes is not defined', () => {
    const store = getStoreWithPlugins([
      vuexSearchPlugin({}),
    ]);

    const documentIndex = store.state[dc.moduleBaseName][dc.defaultName].documents;
    expect(documentIndex).toBeUndefined();
  });

  test('should not throw error', () => {
    expect(() => getStoreWithPlugins([
      vuexSearchPlugin(),
    ])).not.toThrow();
  });

  /** =====================================================
   *
   * Currently Vuex does not support plugin in submodules
   *
   * See: https://github.com/vuejs/vuex/issues/467
   *
   * ======================================================
   */
  // test('should not reregister vuex search if already instantiated', () => {
  //   const store = getStoreWithPlugins([
  //     vuexSearchPlugin({
  //       resourceIndexes: {
  //         documents: ['name', 'description'],
  //       },
  //       resourceGetter: (resourceName, state) => state.resources[resourceName],
  //     }),
  //   ]);

  //   const submodule = getSubmoduleWithPlugins([
  //     vuexSearchPlugin({
  //       resourceIndexes: {
  //         books: ['name', 'description'],
  //       },
  //       name: 'submoduleIndex',
  //       resourceGetter: (resourceName, state) => state.resources[resourceName],
  //     }),
  //   ]);
  //   store.registerModule('submodule', submodule);

  //   const bookIndex = store.state[dc.moduleBaseName].submoduleIndex.books;
  //   expect(bookIndex).not.toBeUndefined();
  // });
});

describe('two vuexSearchPlugin with: one resource each; on main module', () => {
  test('should not reregister vuex search if already instantiated', () => {
    const store = getStoreWithPlugins([
      vuexSearchPlugin({
        resourceIndexes: {
          documents: ['name', 'description'],
        },
        resourceGetter: (resourceName, state) => state.resources[resourceName],
      }),
      vuexSearchPlugin({
        resourceIndexes: {
          contacts: ['name', 'description'],
        },
        name: 'contactIndex',
        resourceGetter: (resourceName, state) => state.resources[resourceName],
      }),
    ]);

    const contactIndex = store.state[dc.moduleBaseName].contactIndex.contacts;
    expect(contactIndex).not.toBeUndefined();
  });
});
