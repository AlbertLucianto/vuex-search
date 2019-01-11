import {
  normalizeMap,
  normalizeNamespaceName,
  modulePathToNamespace,
  cancellablePromiseWrapper,
  debounce,
  cancellationSymbol,
} from 'vuex-search/utils';

describe('normalizeMap', () => {
  test('should convert object to array of key value', () => {
    const map = {
      keyOne: 'valueOne',
      keyTwo: 'valueTwo',
    };

    const normalizedMap = normalizeMap(map);

    expect(normalizedMap).toEqual([
      { key: 'keyOne', val: 'valueOne' },
      { key: 'keyTwo', val: 'valueTwo' },
    ]);
  });

  test('should convert array of strings to array of key value', () => {
    const array = [
      'one',
      'two',
    ];

    const normalizedMap = normalizeMap(array);

    expect(normalizedMap).toEqual([
      { key: 'one', val: 'one' },
      { key: 'two', val: 'two' },
    ]);
  });
});

describe('normalizeNamespaceName', () => {
  test('should directly returns empty string if namespace is empty', () => {
    const namespace = '';
    const normalizedNamespace = normalizeNamespaceName(namespace);

    expect(normalizedNamespace).toEqual('');
  });

  test('should add slash at the end when none', () => {
    const namespace = 'test';
    const normalizedNamespace = normalizeNamespaceName(namespace);

    expect(normalizedNamespace).toEqual('test/');
  });

  test('should not change if slash is at the end', () => {
    const namespace = 'test/';
    const normalizedNamespace = normalizeNamespaceName(namespace);

    expect(normalizedNamespace).toEqual('test/');
  });
});

describe('modulePathToNamespace', () => {
  test('should convert to namespace when modulePath is an array', () => {
    const modulePath = ['test', 'path'];
    const namespace = modulePathToNamespace(modulePath);

    expect(namespace).toEqual('test/path/');
  });

  test('should ignore empty string in array', () => {
    const modulePath = ['test', ''];
    const namespace = modulePathToNamespace(modulePath);

    expect(namespace).toEqual('test/');
  });

  test('should normalize namespace when modulePath is a string', () => {
    const modulePath = 'test/path';
    const namespace = modulePathToNamespace(modulePath);

    expect(namespace).toEqual('test/path/');
  });

  test('should fallback to stringify when modulePath is not a string nor an array', () => {
    const modulePath = { test: 'path' };
    const namespace = modulePathToNamespace(modulePath);

    expect(namespace).toEqual('{"test":"path"}/');
  });
});

describe('cancellablePromiseWrapper', () => {
  test('should proxy resolve from actual promise to cancellable promise', async (done) => {
    const resolvedData = { data: 'test' };

    let resolveCb;
    const promise = new Promise((resolve) => {
      resolveCb = resolve;
    });

    const cancellable = cancellablePromiseWrapper(promise);

    cancellable.then((data) => {
      expect(data).toBe(resolvedData);
      done();
    });

    resolveCb(resolvedData);
  });

  test('should proxy reject from actual promise to cancellable promise', async (done) => {
    const rejectMessage = { data: 'test' };

    let rejectCb;
    const promise = new Promise((_, reject) => {
      rejectCb = reject;
    });

    const cancellable = cancellablePromiseWrapper(promise);

    cancellable.catch((data) => {
      expect(data).toBe(rejectMessage);
      done();
    });

    rejectCb(rejectMessage);
  });

  test('should reject with cancellationSymbol if cancelled', async (done) => {
    const promise = new Promise(() => {});

    const cancellable = cancellablePromiseWrapper(promise);

    cancellable.catch((data) => {
      expect(data).toBe(cancellationSymbol);
      done();
    });

    cancellable.cancel();
  });

  test('should debounce function call and forward arguments', (done) => {
    const fn = jest.fn();
    const dFn = debounce(fn, 1);

    dFn();
    dFn('foo');
    expect(fn).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith('foo');
      done();
    }, 2);
  });

  test('should immediate if delay is zero', () => {
    const fn = jest.fn();
    const dFn = debounce(fn); // delay = 0

    dFn();
    dFn();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
