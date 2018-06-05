import { Store } from 'vuex';
import { ResourceOptions } from '.';
import { SearchApi } from './SearchApi';

export declare class VuexSearch<S> {
  constructor(options: VuexSearchOptions<S>);

  registerResource: (resourceName: string, config: ResourceOptions<S>) => void;
  search: (resourceName: string, searchString: string) => void;
  reindex: (resourceName: string) => void;
  unregisterModule: (resourceName: string) => void;
}

export interface VuexSearchOptions<S> {
  store: Store<S>;
  resources: { [resourceName: string]: ResourceOptions<S> };
  searchApi: SearchApi;
}
