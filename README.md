<p align="center"><a href="https://albertlucianto.github.io/vuex-search" target="_blank" rel="noopener noreferrer"><img width="800" src="./web/assets/vuex-search-header.png" alt="Vuex Search"></a></p>

<a href="https://codecov.io/github/AlbertLucianto/vuex-search?branch=master"><img src="https://img.shields.io/codecov/c/github/AlbertLucianto/vuex-search/master.svg" alt="Coverage Status"></a>
<a href="https://travis-ci.org/AlbertLucianto/vuex-search"><img src="https://travis-ci.org/AlbertLucianto/vuex-search.svg?branch=master" alt="Build Status"></a>
<a href="https://npmcharts.com/compare/vuex-search?minimal=true"><img src="https://img.shields.io/npm/dm/vuex-search.svg" alt="Downloads"></a>
<a href="https://npmcharts.com/compare/vuex-search?minimal=true"><img src="https://img.shields.io/npm/dt/vuex-search.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/vuex-search"><img src="https://img.shields.io/npm/v/vuex-search.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/vuex-search"><img src="https://img.shields.io/npm/l/vuex-search.svg" alt="License"></a>

Vuex Search is a plugin for searching collections of objects. Search algorithms powered by [js-worker-search](https://github.com/bvaughn/js-worker-search).

## [Demo](https://albertlucianto.github.io/vuex-search)

Installation:

```bash
npm i vuex-search
```

## Overview

vuex-search searches collections of documents and returns results as an `Array` of document ids. It is important to note that the documents themselves aren't returned. This is because the actual search is performed in a web-worker thread for performance reasons. In order to avoid serializing the documents and passing them back and forth, vuex-search simply passes their ids.

Because of this, __each document must contain an `id` attribute.__

## Examples

```javascript
// store/state.js

export default {
  myResources: {
    contacts: [
      {
        // id is required for each record
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

### Vuex Search plugin

#### `vuexSearch(options)`

* `options: Object`: List of options for defining the plugin. Available options are:

  * `resources`: Dictionary of `resourceName` and their index options.
  * `searchApi` (optional): [Customizing search index.](#customizing-search-index)

```javascript
// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import vuexSearch from 'vuex-search';
import state from './state';

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  plugins: [
    vuexSearch({
      resources: {
        contacts: {
          // what fields to index
          index: ['address', 'name'],
          // access the state to be watched by Vuex Search
          getter: state => state.myResources.contacts,
        },
        // otherResource: { index, getter },
      },
    }),
  ],
});
```

Where each resource has options:

* `index: string[]`: List of fields to be indexed.
* `getter: (state) => resource`: Getter function to access the resource from root state and to watch.
* `searchApi: SearchApi` (optional): [Custom search index.](#customizing-search-index) If defined, it is used instead of the shared `searchApi` instance.

### Binding with Vue Component

```javascript
import {
  mapActions as mapSearchActions,
  mapGetters as mapSearchGetters,
  getterTypes,
  actionTypes,
} from 'vuex-search';
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

#### `mapGetters(resourceName, getterMap): mappedGetters`

Similar to Vuex helper for mapping attributes, `getterMap` can be either an object or an array.

#### `mapActions(resourceName, actionMap): mappedActions`

Similar to Vuex helper for mapping attributes, `actionMap` can be either an object or an array.

#### `getterTypes`

* `result`
* `isSearching`
* `resourceIndex`: full state of resource index (including `result`, `isSearching`, and current `search`)

#### `actionTypes`

* `search`: mapped action has its first argument the text to search.

### Customizing Search Index

By default, vuex-search builds an index to match all substrings.
You can override this behavior by providing your own, pre-configured `searchApi` param to the plugin like so:

```js
import vuexSearch, { SearchApi, INDEX_MODES } from 'vuex-search';

// all-substrings match by default; same as current
// eg "c", "ca", "a", "at", "cat" match "cat"
const allSubstringsSearchApi = new SearchApi();

// prefix matching (eg "c", "ca", "cat" match "cat")
const prefixSearchApi = new SearchApi({
  indexMode: INDEX_MODES.PREFIXES,
});

// exact words matching (eg only "cat" matches "cat")
const exactWordsSearchApi = new SearchApi({
  indexMode: INDEX_MODES.EXACT_WORDS,
});

const store = new Vuex.Store({
  state,
  plugins: [
    vuexSearch({
      resources: {
        contacts: {
          index: ['address', 'name'],
          getter: state => state.myResources.contacts,
        },
      },
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
import vuexSearch, { SearchApi } from 'vuex-search';

const store = new Vuex.Store({
  state,
  plugins: [
    vuexSearch({
      resources: {
        contacts: {
          index: ['address', 'name'],
          getter: state => state.myResources.contacts,
        },
      },
      searchApi: new SearchApi({
        // split on all non-alphanumeric characters,
        // so this/that gets split to ['this','that'], for example
        tokenizePattern: /[^a-z0-9]+/,
        // make the search case-sensitive
        caseSensitive: true,
      }),
    }),
  ],
});
```

### Dynamic Index Registration

When a module needs to be loaded or registered dynamically, statically defined plugin can be a problem. The solution is to use vuex-search dynamic index registration.

Vuex Search can be accessed through `store.search` or `this.$store.search` in a Vue instance and available methods are:

#### `registerResource(resourceName, config)`

* `config: Object`: A list of options for indexing resource. Currently available options are:
  * `index: string[]`: List of fields to be indexed.
  * `getter: (state) => resource`: Getter function to access the resource from root state and to watch.
  * `searchApi: SearchApi` (optional): Custom `SearchApi`

#### `unregisterResource(resourceName)`

Remove outdated resource indexes, and unwatch/unsubscribe any watchers/subscriptions related to `resourceName`.
