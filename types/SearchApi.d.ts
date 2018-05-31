export declare class SearchApi {
  constructor(options: SearchApiOptions);

  subscribe(onNext: (searchResult: SearchResult) => any, onError: (message: any) => any): () => void;
  indexResource<R extends Resource>(options: IndexResourceOptions<R>): void;
  performSearch: (resourceName: string, text: string) => Promise<string[]>;
  stopSearch: (resourceName: string) => void;
}

export declare enum INDEX_MODES {
  PREFIXES,
  EXACT_WORDS,
}

export interface SearchApiOptions {
  indexMode?: INDEX_MODES;
  tokenizePattern?: RegExp;
  caseSensitive?: boolean;
}

export interface SearchResult {
  result: string[];
  text: string;
  resourceName: string;
}

export interface IndexResourceOptions<R extends Resource> {
  fieldNamesOrIndexFunction: string[] | IndexFunction<R>;
  resourceName: string;
  resources: Resources<R>;
  state?: any;
}

export type IndexFunction<R extends Resource> = (arg: IndexFunctionOptions<R>) => any;
export interface IndexFunctionOptions<R extends Resource> {
  indexDocument: (uid: string, text: string) => void;
  resources: Resources<R>;
  state: any;
}

export type Resources<R extends Resource> = { [key: string]: R } | R[];
export interface Resource {
  readonly id: string;
}
