import * as mutationTypes from './mutation-types';
import * as actionTypes from './action-types';

/**
 * Actions with injected search API mapper.
 *
 * @param {{ [resourceName: string]: Search }} searchMap mapper of each resources searchApi
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

    [actionTypes.searchApi.INDEX_RESOURCE](_, params) {
      const { resourceName } = params;
      searchMap[resourceName].indexResource(params);
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
