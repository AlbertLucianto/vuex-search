import { Plugin, Store } from 'vuex';
import { SearchApi, Resource } from './SearchApi';

export * from './mappers';
export * from './SearchApi';

export interface VuexSearchOptions<S, R extends Resource> {
  resourceIndexes: { [resourceName: string]: string[] };
  resourceGetter: (resourceName: string, store: Store<S>) => any;
  searchApi?: SearchApi<R>;
  name?: string;
}

declare function vuexSearchPlugin<S, R extends Resource>(options: VuexSearchOptions<S, R>): Plugin<S>;

export default vuexSearchPlugin;
