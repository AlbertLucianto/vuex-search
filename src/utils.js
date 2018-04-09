import CancellablePromise from 'bluebird';

export function normalizeNamespaceName(namespace) {
  if (namespace === '') return '';
  return namespace.slice(-1) === '/' ? namespace : namespace.concat('/');
}

export function modulePathToNamespace(modulePath) {
  if (Array.isArray(modulePath)) {
    return modulePath.join('/').concat('/');
  } else if (typeof modulePath === 'string') {
    return normalizeNamespaceName(modulePath);
  }
  return JSON.stringify(modulePath);
}

export function resourceGetterWrapper(resourceName, resourceGetter) {
  return store => resourceGetter(resourceName, store);
}

export function cancellablePromiseWrapper(promise) {
  CancellablePromise.config({ cancellation: true });

  return new CancellablePromise((resolve, reject) => {
    promise
      .then(resolve)
      .catch(reject);
  });
}
