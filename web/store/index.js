import Vue from 'vue';
import Vuex from 'vuex';
import vuexSearchPlugin from 'vuex-search';

import * as getters from './getters';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const initialState = {
  resources: { contacts: [] },
};

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  state: initialState,
  plugins: [
    vuexSearchPlugin({
      resourceIndexes: {
        contacts: ['address', 'name', 'words'],
      },
      resourceGetter: (resourceName, state) => state.resources[resourceName],
    }),
  ],
});
