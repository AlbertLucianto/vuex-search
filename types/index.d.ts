import { Plugin, Store } from 'vuex';
import { SearchApi, Resource } from './SearchApi';

export * from './mappers';
export * from './SearchApi';

export interface ResourceOptions<S> {
  index: string[];
  getter: (state: S) => any;
  searchApi?: SearchApi;
}

export interface VuexSearchOptions<S> {
  resources: { [resourceName: string]: ResourceOptions<S> };
  searchApi: SearchApi;
}

declare function vuexSearchPlugin<S>(options: VuexSearchOptions<S>): Plugin<S>;

export default vuexSearchPlugin;
