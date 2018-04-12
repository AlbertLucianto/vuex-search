# Vuex Search

Vuex Search is a plugin for searching collections of objects. Search algorithms powered by [js-worker-search](https://github.com/bvaughn/js-worker-search).

Demo can be found [here]().

Installation:

```bash
npm install --save vuex-search
```

## Examples

```javascript
import vuexSearchPlugin from 'vuex-search';
```

Considering we have this structure of Vuex state. A unique `id` is required in each record.

```javascript
// store/state.js

export default {
  myResources: {
    contacts: [
      {
        id: '1',
        address: '06176 Georgiana Points',
        name: 'Dr. Katrina Stehr',
      },
      {
        id: '2',
        address: '06176 Georgiana Points',
        name: 'Edyth Grimes',
      },
    ],
  },
}
```

### Defining Vuex Search plugin

* __resourceIndexes__: Dictionary of `resourceName`s and their corresponding fields to be indexed by.
* __resourceGetter__: Tells Vuex Search for which state should be watched and reindexed on change.
* __name__ (optional): Identifier for Vue component to map `getters` and `actions` from Vuex Search's states.

```javascript
// store/index.js

const store = new Vuex.Store({
  state,
  plugins: [
    vuexSearchPlugin({
      name: 'myIndex',
      resourceIndexes: {
        contacts: ['address', 'name'],
      },
      resourceGetter: (resourceName, state) => state.myResources[resourceName],
    }),
  ],
});
```

### Binding with Vue Component

```javascript
import { composeSearchMappers, actionTypes, getterTypes } from 'vuex-search';

// Composing actions and getters from selected plugin name
const { mapSearchGetters, mapSearchActions } = composeSearchMappers('myIndex');
```

```javascript
// SomeComponent.vue

data() {
  return { text: '' },
},
computed: {
  ...mapSearchGetters('contacts', {
    resultIds: getterTypes.result,
    isLoading: getterTypes.isSearching,
  }),
},

methods: {
  ...mapSearchActions('contacts', {
    searchContacts: actionTypes.search,
  }),
  doSearch() {
    this.searchContacts(this.text);
  },
},
```