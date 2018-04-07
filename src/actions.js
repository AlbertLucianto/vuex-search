import * as mutationTypes from './mutation-types';
import * as actionTypes from './action-types';

/**
 * Middleware for interacting with the search API
 * @param {Search} Search object
 */
export default function actionsWithSearch(search) {
  return {
    [actionTypes.RECEIVE_RESULT]({ commit }, { resourceName, result, text }) {
      commit(mutationTypes.SET_SEARCH_RESULT, {
        resourceName,
        result,
        text,
      });
    },

    [actionTypes.INITIALIZE_RESOURCES]({ commit }, { resourceNames }) {
      commit(mutationTypes.SET_INIT_RESOURCES, { resourceNames });
    },

    [actionTypes.searchApi.INDEX_RESOURCE](_, params) {
      search.indexResource(params);
    },

    [actionTypes.searchApi.DEFINE_INDEX](_, params) {
      search.defineIndex(params);
    },

    [actionTypes.searchApi.PERFORM_SEARCH](_, { resourceName, searchString }) {
      search.performSearch(resourceName, searchString);
    },

    [actionTypes.SEARCH]({ commit, dispatch }, { resourceName, searchString }) {
      commit(mutationTypes.SET_SEARCH, { resourceName, searchString });
      dispatch(actionTypes.searchApi.PERFORM_SEARCH, { resourceName, searchString });
    },
  };
}
