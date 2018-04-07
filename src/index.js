/* @flow */

import { Store } from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import * as actionTypes from './action-types';
import SubscribableSearchApi from './SearchApi';

export default function vuexSearch({
  resourceIndexes = {},
  resourceGetter,
  searchApi = new SubscribableSearchApi(),
  searchModulePath = 'search',
} = {}) {
  return (store: Store) => {
    store.registerModule(searchModulePath, {
      mutations,
      actions,
      getters,
      state: {},
    });

    const resourceNames = Object.keys(resourceIndexes);
    store.dispatch(actionTypes.INITIALIZE_RESOURCES, { resourceNames });

    searchApi.subscribe(({ result, resourceName, text }) => {
      store.dispatch(actionTypes.RECEIVE_RESULT, { result, resourceName, text });
    });

    if (resourceGetter) {
      resourceNames.forEach((resourceName) => {
        store.watch(resourceGetter(resourceName), (data) => {

          const resourceIndex = resourceIndexes[resourceName];
          const searchString = store.getters.getResourceIndex(resourceName).text;

          store.dispatch(actionTypes.searchApi.INDEX_RESOURCE, {
            fieldNamesOrIndexFunction: resourceIndex,
            resourceName,
            resources: data,
          });
          store.dispatch(actionTypes.SEARCH, { resourceName, searchString });
        });
      });
    }
  };
}

export { SubscribableSearchApi as SearchApi };

