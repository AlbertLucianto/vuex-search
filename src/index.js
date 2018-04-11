import { INDEX_MODES } from 'js-worker-search';

import vuexSearchPlugin from './vuexSearchPlugin';
import SearchApi from './SearchApi';
import composeSearchActions from './composeMapActions';
import composeSearchGetters from './composeMapGetters';
import composeSearchMappers from './composeMappers';
import { SEARCH as search } from './action-types';
import { api as getterTypes } from './getter-types';

const actionTypes = { search };

export {
  SearchApi,
  INDEX_MODES,
  composeSearchActions,
  composeSearchGetters,
  composeSearchMappers,
  actionTypes,
  getterTypes,
};

export default vuexSearchPlugin;
