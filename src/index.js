import { SEARCH } from './action-types';

export { default } from './vuexSearchPlugin';
export { getterNames as searchGetters } from './getters';

export { default as composeSearchActions } from './searchActions';
export const actionTypes = { SEARCH };

export { default as SearchApi } from './SearchApi';
export { INDEX_MODES } from 'js-worker-search';
