import { INDEX_MODES } from 'js-worker-search';

import plugin from './plugin';
import SearchApi from './SearchApi';
import { SEARCH as search } from './action-types';
import { api as getterTypes } from './getter-types';
import mapActions from './mapActions';
import mapGetters from './mapGetters';
import VuexSearch from './VuexSearch';

const actionTypes = { search };

export {
  SearchApi,
  INDEX_MODES,
  actionTypes,
  getterTypes,
  mapActions,
  mapGetters,
  VuexSearch,
};

export default plugin;
