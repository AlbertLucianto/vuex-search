import faker from 'faker';
import * as mutationTypes from './mutation-types';

export default {
  fetchContacts({ commit }, { quantity = 1000 } = {}) {
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
  },
};
