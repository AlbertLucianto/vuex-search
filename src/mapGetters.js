import { normalizeMap, normalizeNamespaceName } from './utils';
import * as actionTypes from './action-types';

export const transformPayload = (
  resourceName,
  actionType,
  args,
) => {
  switch (actionType) {
    case actionTypes.SEARCH: {
      const [searchString] = args;
      return [{ resourceName, searchString }];
    }
    default:
      return args;
  }
};

export default (resourceName, getters) => {
  const res = {};
  normalizeMap(getters).forEach(({ key, val }) => {
    res[key] = function mappedGetter() {
      const namespace = normalizeNamespaceName(this.$store.search._base);
      return this.$store.getters[`${namespace}${val}`](resourceName);
    };
  });

  return res;
};
