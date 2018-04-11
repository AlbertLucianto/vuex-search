type Dictionary<T> = { [key: string]: T };
type Computed = () => any;
type ActionMethod = (...args: any[]) => void;

interface MapperWithResourceName<R, T> {
  (resourceName: string, map: T[]): Dictionary<R>;
  (resourceName: string, map: Dictionary<T>): Dictionary<R>;
}

export declare enum actionTypes {
  search,
}

export declare enum getterTypes {
  resourceIndex,
  isSearching,
  result,
}

export type SearchActionMappers = MapperWithResourceName<ActionMethod, actionTypes>;
export type SearchGetterMappers = MapperWithResourceName<Computed, getterTypes>;

export declare function composeSearchActions(name?: string): SearchActionMappers;
export declare function composeSearchGetters(name?: string): SearchGetterMappers;
export declare function composeSearchMappers(name?: string): {
  mapSearchActions: SearchActionMappers,
  mapSearchGetters: SearchGetterMappers,
}
