import { Plugin, Store } from 'vuex';
import { SearchApi, Resource } from './SearchApi';

export * from './mappers';
export * from './SearchApi';

export interface VuexSearchOptions<S> {
  resourceIndexes: { [resourceName: string]: string[] };
  resourceGetter: (resourceName: string, state: S) => any;
  searchApi: SearchApi;
  name?: string;
}

declare function vuexSearchPlugin<S>(options: VuexSearchOptions<S>): Plugin<S>;

export default vuexSearchPlugin;
