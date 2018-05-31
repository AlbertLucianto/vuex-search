import VuexSearch from './VuexSearch';
import SubscribableSearchApi from './SearchApi';

/**
 * Vuex binding for client-side search with indexer and Web Workers
 *
 * @param {[resourceName: string]: { getter, indexes, searchApi? }} resources
 *    Resource to watch and index
 * @param {SearchApi} searchApi Optional, can also use custom SearchApi instances
 */
export default function plugin({
  resources = {},
  searchApi = new SubscribableSearchApi(),
} = {}) {
  return (store) => {
    /* eslint-disable no-new */
    new VuexSearch({ store, resources, searchApi });
  };
}
