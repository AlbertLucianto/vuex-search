import faker from 'faker';

function execFromPath(object, paths, args = []) {
  return paths.reduce((acc, path) => acc[path], object)(...args);
}

self.addEventListener(
  'message',
  (e) => {
    const { data } = e;
    const { quantity, getData } = data;

    const results = {};

    new Array(quantity).fill(null).forEach(() => {
      const id = faker.random.uuid();
      const result = { id };

      Object.entries(getData).forEach(([field, fnPath]) => {
        if (Array.isArray(fnPath)) {
          result[field] = execFromPath(faker, fnPath);
        } else {
          const { path, args } = fnPath;
          result[field] = execFromPath(faker, path, args);
        }
      });

      results[id] = result;
    });

    self.postMessage(results);
  },
  false,
);
