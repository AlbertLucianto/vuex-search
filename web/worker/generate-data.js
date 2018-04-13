import faker from 'faker';

function execFromPath(object, paths) {
  return paths.reduce((acc, path) => acc[path], object)();
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
        result[field] = execFromPath(faker, fnPath);
      });

      results[id] = result;
    });

    self.postMessage(results);
  },
  false,
);
