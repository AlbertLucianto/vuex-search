# Vuex Search

<a href="https://npmcharts.com/compare/vuex-search?minimal=true"><img src="https://img.shields.io/npm/dm/vuex-search.svg" alt="Downloads"></a>
<a href="https://codecov.io/github/AlbertLucianto/vuex-search?branch=master"><img src="https://img.shields.io/codecov/c/github/AlbertLucianto/vuex-search/master.svg" alt="Coverage Status"></a>
<a href="https://travis-ci.org/AlbertLucianto/vuex-search"><img src="https://travis-ci.org/AlbertLucianto/vuex-search.svg?branch=master" alt="Build Status"></a>
<a href="https://www.npmjs.com/package/vuex-search"><img src="https://img.shields.io/npm/v/vuex-search.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/vuex-search"><img src="https://img.shields.io/npm/l/vuex-search.svg" alt="License"></a>

Vuex Search is a plugin for searching collections of objects. Search algorithms powered by [js-worker-search](https://github.com/bvaughn/js-worker-search).

Demo can be found [here](https://albertlucianto.github.io/vuex-search).

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
* __searchApi__ (optional): [Customizing search index.](#customizing-search-index)

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

### Customizing Search Index

By default, vuex-search builds an index to match all substrings.
You can override this behavior by providing your own, pre-configured `searchApi` param to the plugin like so:

```js
import vuexSearchPlugin, { SearchApi, INDEX_MODES } from 'vuex-search'

// all-substrings match by default; same as current
// eg "c", "ca", "a", "at", "cat" match "cat"
const allSubstringsSearchApi = new SearchApi()

// prefix matching (eg "c", "ca", "cat" match "cat")
const prefixSearchApi = new SearchApi({
  indexMode: INDEX_MODES.PREFIXES
})

// exact words matching (eg only "cat" matches "cat")
const exactWordsSearchApi = new SearchApi({
  indexMode: INDEX_MODES.EXACT_WORDS
})

const store = new Vuex.Store({
  state,
  plugins: [
    vuexSearchPlugin({
      name: 'myIndex',
      resourceIndexes: {
        contacts: ['address', 'name'],
      },
      resourceGetter: (resourceName, state) => state.myResources[resourceName],
      searchApi: exactWordsSearchApi, // or allSubstringSearchApi; or prefixSearchApi
    }),
  ],
});
```

### Custom word boundaries (tokenization) and case-sensitivity

You can also pass parameters to the SearchApi constructor that customize the way the
search splits up the text into words (tokenizes) and change the search from the default
case-insensitive to case-sensitive:

```js
import vuexSearchPlugin { SearchApi } from 'vuex-search'

const store = new Vuex.Store({
  state,
  plugins: [
    vuexSearchPlugin({
      name: 'myIndex',
      resourceIndexes: {
        contacts: ['address', 'name'],
      },
      resourceGetter: (resourceName, state) => state.myResources[resourceName],
      searchApi: new SearchApi({
        // split on all non-alphanumeric characters,
        // so this/that gets split to ['this','that'], for example
        tokenizePattern: /[^a-z0-9]+/,
        // make the search case-sensitive
        caseSensitive: true
      }),
    }),
  ],
});
```