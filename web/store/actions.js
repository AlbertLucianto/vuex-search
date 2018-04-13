import faker from 'faker';
import * as mutationTypes from './mutation-types';

// eslint-disable-next-line
const GenerateDataWorker = require('worker-loader?inline=true!../worker/generate-data.js');
let currWorker;

export default {
  fetchContacts({ commit }, { quantity = 1000 } = {}) {
    if (currWorker instanceof Worker) currWorker.terminate();

    const gdWorker = new GenerateDataWorker();
    currWorker = gdWorker;

    if (gdWorker) {
      gdWorker.postMessage({
        quantity,
        getData: { // Use path because Web Worker only supports serializable object
          name: ['name', 'findName'],
          address: ['address', 'streetAddress'],
          avatar: ['image', 'avatar'],
        },
      });

      gdWorker.onmessage = (e) => {
        const contacts = e.data;
        commit(mutationTypes.SET_CONTACTS, { contacts });
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
        };
      });

      commit(mutationTypes.SET_CONTACTS, { contacts });
    }
  },
};
