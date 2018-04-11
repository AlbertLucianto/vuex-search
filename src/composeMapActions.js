import { mapActions } from 'vuex';
import { normalizeNamespace, normalizeMap } from './helpers';
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
function transformActions(resourceName, actionMap) {
  return (mappedActions) => {
    const transformedActions = {};

    Object.entries(mappedActions).forEach(([actionName, method]) => {
      let action = method;

      switch (actionMap[actionName]) {
        case actionTypes.SEARCH:
          action = function transformedAction(text) {
            return method.bind(this)({ resourceName, searchString: text });
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
 * A 'mapActions' composer based on vuexSearchPlugin name
 */
export default name => function mapSearchActions(
  resourceName,
  map,
) {
  const transformed = (
    namespace,
    _map,
  ) => {
    // This is required for transformActions to recognise the 'actionType'.
    // Before that, it needs to ensure the map is not an array.
    const actionMap = {};
    normalizeMap(map).forEach(({ key, val }) => {
      actionMap[key] = val;
    });
    return transformActions(resourceName, actionMap)(mapActions(namespace, _map));
  };

  return normalizeNamespace(transformed)(name, map);
};
