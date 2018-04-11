import Vue from 'vue';
import Vuex from 'vuex';
import vuexSearchPlugin from 'vuex-search';

import * as getters from './getters';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  resources: { contacts: [] },
};

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  state,
  plugins: [
    vuexSearchPlugin({
      resourceIndexes: {
        contacts: ['address', 'name'],
      },
      resourceGetter: (resourceName, store) => store.resources[resourceName],
    }),
  ],
});
