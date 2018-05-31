import Vue from 'vue';
import Vuex from 'vuex';
import plugin, { VuexSearch } from 'vuex-search';

Vue.use(Vuex);

function getStoreWithPlugins(plugins) {
  const documentA = { id: 1, name: 'One', description: 'The first document' };
  const documentB = { id: 2, name: 'Two', description: 'The second document' };
  const documentC = { id: 3, name: 'Three', description: 'The third document' };
  const documentD = { id: 4, name: 'Four', description: 'The 4th (fourth) document' };

  const initialState = {
    resources: {
      documents: [documentA, documentB, documentC, documentD],
    },
  };

  return new Vuex.Store({
    state: initialState,
    plugins,
  });
}

describe('plugin', () => {
  test('should instantiate VuexSearch and accessible through store.search', () => {
    const plugins = [
      plugin(),
    ];

    const store = getStoreWithPlugins(plugins);

    expect(store.search instanceof VuexSearch).toBe(true);
  });
});
