import { Plugin, Store } from 'vuex';
import { SearchApi, Resource } from './SearchApi';

export interface ResourceOptions<S> {
  index: string[];
  getter: (state: S) => any;
  watch: Boolean;
  searchApi?: SearchApi;
}

export interface PluginOptions<S> {
  resources: { [resourceName: string]: ResourceOptions<S> };
  searchApi?: SearchApi;
}

declare function vuexSearchPlugin<S>(options: PluginOptions<S>): Plugin<S>;

export * from './mappers';
export * from './SearchApi';
export * from './VuexSearch';

export default vuexSearchPlugin;
