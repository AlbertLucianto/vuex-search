import { normalizeMap, normalizeNamespaceName } from './utils';
import * as actionTypes from './action-types';

/**
 * Get vuex-search module by checking base name in root store.
 *
 * @param {Store} store
 */
function getVuexSearchModule(store) {
  const base = normalizeNamespaceName(store.search._base);
  return store._modulesNamespaceMap[base];
}

/**
 * Inject resourceName to payload/args based on actionType
 *
 * @param {String} resourceName Unique resource identifier defined in the plugin.
 * @param {String} actionType
 * @param {Array} args
 */
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

/**
 * Generate actions with transformed payload for simpler api.
 *
 * @param {String} [resourceName] Unique resource identifier defined in the plugin.
 * @param {Object|Array} actions Object mapping from intented method name to actionType;
 *    or an array of actionTypes.
 * @return {Object}
 */
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
