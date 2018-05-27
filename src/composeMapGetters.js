import { mapGetters } from 'vuex';
import defaultConfigs from './defaultConfigs';
import { modulePathToNamespace } from './utils';

export function transformComputed(resourceName) {
  return (mappedGetters) => {
    const transformedComputed = {};

    Object.entries(mappedGetters).forEach(([getterType, getter]) => {
      transformedComputed[getterType] = function transformedGetter() {
        return getter.apply(this)(resourceName);
      };
    });

    return transformedComputed;
  };
}

export default function composeMapGetters(pluginName) {
  return (resourceName, map) => {
    const namespace = modulePathToNamespace([
      defaultConfigs.moduleBaseName,
      pluginName || defaultConfigs.defaultName,
    ]);

    const computedMap = mapGetters(namespace, map);
    const transformedComputed = transformComputed(resourceName)(computedMap);

    return transformedComputed;
  };
}
