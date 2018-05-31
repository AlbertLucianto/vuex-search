import { normalizeMap, normalizeNamespaceName } from './utils';

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
