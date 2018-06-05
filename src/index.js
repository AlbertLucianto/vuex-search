import { INDEX_MODES } from 'js-worker-search';

import plugin from './plugin';
import SearchApi from './SearchApi';
import { api as getterTypes } from './getter-types';
import mapActions from './mapActions';
import mapGetters from './mapGetters';
import VuexSearch, { publicApi as actionTypes } from './VuexSearch';

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
