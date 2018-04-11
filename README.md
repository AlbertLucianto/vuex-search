# Vuex Search

Vuex Search is a library for searching collections of objects. Search algorithms powered by [js-worker-search](https://github.com/bvaughn/js-worker-search).

Demo can be found [here]().

Installation:

```bash
npm install --save vuex-search
```

## Examples

```javascript
import vuexSearchPlugin from 'vuex-search';
```

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

```javascript
// store/index.js

const store = new Vuex.Store({
  getters,
  actions,
  mutations,
  state,
  plugins: [
    vuexSearchPlugin({
      name: 'myIndex',
      resourceIndexes: {
        contacts: ['address', 'name'],
      },
      resourceGetter: (resourceName, store) => store.myResources[resourceName],
    }),
  ],
});
```

```javascript
import { actionTypes, getterTypes, composeSearchMappers } from 'vuex-search';
```

```javascript
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