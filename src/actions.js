import * as mutationTypes from './mutation-types';
import * as actionTypes from './action-types';

/**
 * Middleware for interacting with the search API
 * @param {Search} Search object
 */
export default function actionsWithSearch(searchMap) {
  return {
    [actionTypes.RECEIVE_RESULT]({ commit }, { resourceName, result, text }) {
      commit(mutationTypes.SET_SEARCH_RESULT, {
        resourceName,
        result,
        text,
      });
    },

    [actionTypes.INITIALIZE_RESOURCES]({ commit }, { resourceNames }) {
      resourceNames.forEach((resourceName) => {
        commit(mutationTypes.SET_INIT_RESOURCE, { resourceName });
      });
    },

    [actionTypes.searchApi.INDEX_RESOURCE](_, { resourceName, ...params }) {
      searchMap[resourceName].indexResource({ resourceName, ...params });
    },

    [actionTypes.searchApi.PERFORM_SEARCH](_, { resourceName, searchString }) {
      searchMap[resourceName].stopSearch(resourceName);
      searchMap[resourceName].performSearch(resourceName, searchString);
    },

    [actionTypes.SEARCH]({ commit, dispatch }, { resourceName, searchString }) {
      commit(mutationTypes.SET_SEARCH, { resourceName, searchString });
      dispatch(actionTypes.searchApi.PERFORM_SEARCH, { resourceName, searchString });
    },
  };
}
