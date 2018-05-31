import { normalizeMap, normalizeNamespaceName } from './utils';
import * as actionTypes from './action-types';

function getVuexSearchModule(store) {
  const base = normalizeNamespaceName(store.search._base);
  return store._modulesNamespaceMap[base];
}

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

export default (resourceName, actions) => {
  const res = {};
  normalizeMap(actions).forEach(({ key, val }) => {
    res[key] = function mappedAction(...args) {
      const module = getVuexSearchModule(this.$store);
      const { dispatch } = module.context;

      const payloads = transformPayload(resourceName, val, args);

      return dispatch.apply(this.$store, [val].concat(payloads));
    };
  });

  return res;
};
