import CancellablePromise from 'bluebird';

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
 * Adds '/'
 *
 * @param {string} namespace
 */
export function normalizeNamespaceName(namespace) {
  if (namespace === '') return '';
  return namespace.slice(-1) === '/' ? namespace : namespace.concat('/');
}

/**
 * With assumption Vuex Search module starts from root.
 *
 * @param {string | [string]} modulePath
 */
export function modulePathToNamespace(modulePath) {
  if (Array.isArray(modulePath)) {
    return modulePath.reduce((ns, path) => (path ? `${ns}${path}/` : ns), '');
  } else if (typeof modulePath === 'string') {
    return normalizeNamespaceName(modulePath);
  }
  return normalizeNamespaceName(JSON.stringify(modulePath));
}

/**
 * Basic Promise does not support promise cancellation.
 * This function wraps the basic promise and returns cancellable one.
 *
 * @param {Promise} promise
 */
export function cancellablePromiseWrapper(promise) {
  CancellablePromise.config({ cancellation: true });

  return new CancellablePromise(async (resolve, reject) => {
    try {
      const res = await promise;
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Postpone its execution until after wait milliseconds
 * have elapsed since the last time it was invoked.
 *
 * @param {Function} fn Function callback after delay
 * @param {Number} delay Debounce time
 */
export function debounce(fn, delay = 0) {
  let timeoutId;

  if (delay === 0) return fn;

  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
