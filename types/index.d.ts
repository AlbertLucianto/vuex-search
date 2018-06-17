import { Plugin, Store } from 'vuex';
import { SearchApi, Resource } from './SearchApi';

interface WatchOptions {
  delay: number;
}

export interface ResourceOptions<S> {
  index: string[];
  getter: (state: S) => any;
  watch: boolean|WatchOptions;
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
