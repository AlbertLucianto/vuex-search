import { normalizeMap, normalizeNamespaceName } from './utils';

/**
 * Generate getters with injected resourceName for simpler api.
 *
 * @param {String} [resourceName] Unique resource identifier defined in the plugin.
 * @param {Object|Array} actions Object mapping from intented method name to getterType;
 *    or an array of getterTypes.
 * @return {Object}
 */
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
