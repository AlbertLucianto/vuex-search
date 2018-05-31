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

export type mapActions = MapperWithResourceName<ActionMethod, actionTypes>;
export type mapGetters = MapperWithResourceName<Computed, getterTypes>;
