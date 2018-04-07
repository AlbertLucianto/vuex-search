import Vue from 'vue';
import * as mutationTypes from './mutation-types';

export default {
  [mutationTypes.SET_CONTACTS](state, { contacts }) {
    Vue.set(state.resources, 'contacts', contacts);
  },
};
