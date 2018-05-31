import Vue from 'vue';
import Vuex from 'vuex';
import vuexSearch from 'vuex-search';

import * as getters from './getters';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const initialState = {
  resources: { contacts: [], generating: false },
};

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  state: initialState,
  plugins: [
    vuexSearch({
      resources: {
        contacts: {
          index: ['address', 'name', 'words'],
          getter: state => state.resources.contacts,
        },
      },
    }),
  ],
});
