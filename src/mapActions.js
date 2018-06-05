import { normalizeMap } from './utils';
import { publicApi } from './VuexSearch';

/**
 * Generate actions with transformed payload for simpler api.
 *
 * @param {String} resourceName Unique resource identifier defined in the plugin.
 * @param {Object|Array} actions Object mapping from intented method name to actionType;
 *    or an array of actionTypes.
 * @return {Object}
 */
export default (resourceName, actions) => {
  const res = {};
  const publicApiTypes = Object.values(publicApi);

  normalizeMap(actions).forEach(({ key, val }) => {
    if (!publicApiTypes.includes(val) && process.env.NODE_ENV !== 'production') {
      throw new Error(`unknown actionType '${val}' is passed to mapActions`);
    }

    res[key] = function mappedAction(...args) {
      const vuexSearch = this.$store.search;

      return vuexSearch[val](resourceName, ...args);
    };
  });

  return res;
};
