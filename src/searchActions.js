import { mapActions } from 'vuex';
import vuexSearchPlugin from './vuexSearchPlugin';
import * as actionTypes from './action-types';

/**
 * Normalize the map
 * normalizeMap([1, 2]) => [ { key: 1, val: 1 }, { key: 2, val: 2 } ]
 * normalizeMap({a: 1, b: 2}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }));
}

function transformAction(resourceName, actionMap) {
  return (actions) => {
    const transformedActions = {};

    Object.entries(actions).forEach(([actionName, method]) => {
      let action = method;

      switch (actionMap[actionName]) {
        case actionTypes.SEARCH:
          action = function transformedAction(text) {
            method.bind(this)({ resourceName, searchString: text });
          };
          break;
        default:
          break;
      }
      transformedActions[actionName] = action;
    });

    return transformedActions;
  };
}

/**
 * Return a function expect two param contains namespace and map.
 * it will normalize the namespace and then the param's function
 * will handle the new namespace and the map.
 *
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace(fn) {
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

export default name => (
  resourceName,
  mapArg,
) => normalizeNamespace(
  (namespace, map) => {
    const actionMap = {};
    normalizeMap(map).forEach(({ key, val }) => {
      actionMap[key] = val;
    });

    return transformAction(resourceName, map)(mapActions(namespace, map));
  },
)(name, mapArg);
