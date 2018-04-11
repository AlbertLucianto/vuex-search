import vuexSearchPlugin from './vuexSearchPlugin';

/**
 * Normalize the map
 * normalizeMap([1, 2]) => [ { key: 1, val: 1 }, { key: 2, val: 2 } ]
 * normalizeMap({a: 1, b: 2}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
export function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }));
}

/**
 * Return a function expect two param contains namespace and map.
 * it will normalize the namespace and then the param's function
 * will handle the new namespace and the map.
 *
 * @param {Function} fn
 * @return {Function}
 */
export function normalizeNamespace(fn) {
  return (name, map) => {
    const { defaultName, moduleBaseName } = vuexSearchPlugin.configs;

    let namespace;
    let _map = map;
    if (typeof name !== 'string') {
      _map = name;
      namespace = `${moduleBaseName}/${defaultName}`;
    } else {
      namespace = `${moduleBaseName}/${name}`;
    }

    return fn(namespace, _map);
  };
}
