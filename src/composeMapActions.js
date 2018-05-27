import { mapActions } from 'vuex';
import defaultConfigs from './defaultConfigs';
import { normalizeMap, modulePathToNamespace } from './utils';
import * as actionTypes from './action-types';

/**
 * ActionType specific transformation, the purpose is to:
 *   >Inject 'resourceName', to be placed like a 'namespace' instead of payload
 *   >Example result will be:
 *
 *   instead of
 *   'this.someAction({ resourceName: 'resource', ...otherParams })'
 *
 *   it will be
 *   'this.someAction('resource', ...otherParams)'
 *
 *   With 'otherParams' is set specifically for ease of method calls.
 *   For example, 'this.doSearch('resource', this.inputText)'
 *
 * @param {string} resourceName Resource name that will be injected in the payload
 * @param {object} actionMap User defined action mappings, it is required since
 *   Vuex's mapActions() does not have the actual actionType
 */
export function transformMethods(resourceName, actionMap) {
  return (methodMap) => {
    const transformedMethods = {};

    Object.entries(methodMap).forEach(([actionName, method]) => {
      let action = method;

      switch (actionMap[actionName]) {
        case actionTypes.SEARCH:
          action = function transformedMethod(text) {
            return method.bind(this)({ resourceName, searchString: text });
          };
          break;
        default:
          break;
      }
      transformedMethods[actionName] = action;
    });

    return transformedMethods;
  };
}

/**
 * A 'mapActions' composer based on vuexSearchPlugin name
 */
export default function composeMapActions(
  pluginName = defaultConfigs.defaultName,
  baseName = defaultConfigs.moduleBaseName,
) {
  return (resourceName, map) => {
    // This is required for transformMethods to recognise the 'actionType'.
    // Before that, it needs to ensure the map is not an array.
    const actionMap = {};
    normalizeMap(map).forEach(({ key, val }) => {
      actionMap[key] = val;
    });

    const namespace = modulePathToNamespace([
      baseName,
      pluginName,
    ]);

    const methodMap = mapActions(namespace, map);
    const transformedMethods = transformMethods(resourceName, actionMap)(methodMap);

    return transformedMethods;
  };
}
