import faker from 'faker';
import * as mutationTypes from './mutation-types';

// eslint-disable-next-line
const GenerateDataWorker = require('worker-loader?inline=true!../worker/generate-data.js');
const gdWorker = Worker ? new GenerateDataWorker() : null;
export default {
  fetchContacts({ commit }, { quantity = 1000 } = {}) {
    if (gdWorker) {
      gdWorker.postMessage({
        quantity,
        getData: { // Use path because Web Worker only supports serializable object
          name: ['name', 'findName'],
          address: ['address', 'streetAddress'],
          avatar: ['image', 'avatar'],
          words: { path: ['random', 'words'], args: [10] },
        },
      });
      commit(mutationTypes.SET_GENERATING, { generating: true });

      gdWorker.onmessage = (e) => {
        const contacts = e.data;
        commit(mutationTypes.SET_CONTACTS, { contacts });
        commit(mutationTypes.SET_GENERATING, { generating: false });
      };
    } else {
      const contacts = {};

      new Array(quantity).fill(null).forEach(() => {
        const id = faker.random.uuid();
        contacts[id] = {
          id,
          name: faker.name.findName(),
          address: faker.address.streetAddress(),
          avatar: faker.image.avatar(),
          words: faker.random.words(10),
        };
      });

      commit(mutationTypes.SET_CONTACTS, { contacts });
    }
  },
};
