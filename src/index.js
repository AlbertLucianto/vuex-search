import { SEARCH } from './action-types';

export { default } from './vuexSearch';
export { default as SearchApi } from './SearchApi';
export { getterNames as searchGetters } from './getters';
export const searchActions = { search: SEARCH };
