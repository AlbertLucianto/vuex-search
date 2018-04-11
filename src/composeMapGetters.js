import { mapGetters } from 'vuex';
import { normalizeNamespace } from './helpers';

function transformGetters(resourceName) {
  return (getters) => {
    const transformedGetters = {};

    Object.entries(getters).forEach(([getterType, getter]) => {
      transformedGetters[getterType] = function transformedGetter() {
        return getter.apply(this)(resourceName);
      };
    });

    return transformedGetters;
  };
}

export default name => (
  resourceName,
  map,
) => normalizeNamespace(
  (namespace, _map) => transformGetters(resourceName)(mapGetters(namespace, _map)),
)(name, map);
