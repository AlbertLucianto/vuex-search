import { mapGetters } from 'vuex';
import { normalizeNamespace } from './helpers';

function transformMapGetters(resourceName) {
  return (mappedGetters) => {
    const transformedMapGetters = {};

    Object.entries(mappedGetters).forEach(([getterType, getter]) => {
      transformedMapGetters[getterType] = function transformedGetter() {
        return getter.apply(this)(resourceName);
      };
    });

    return transformedMapGetters;
  };
}

export default name => function mapSearchGetters(
  resourceName,
  map,
) {
  const transformed = (
    namespace,
    _map,
  ) => transformMapGetters(resourceName)(mapGetters(namespace, _map));

  return normalizeNamespace(transformed)(name, map);
};
