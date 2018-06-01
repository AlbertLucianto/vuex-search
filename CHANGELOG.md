# Changelog

# 2.0.0

## Option schema changes for defining plugin

__In v1.x:__

Vuex can use multiple named plugins, where each plugin defines one `resourceGetter` and one `searchApi` to be shared by `resourceIndexes` in the plugin. Thus another plugin must be defined if different `searchApi` is to be used.

```js
searchPlugin({
  name: 'myIndex',
  resourceIndexes: {
    contacts: ['address', 'name'],
  },
  resourceGetter: (resourceName, state) => state.myResources[resourceName],
  searchApi: new SearchApi();
});
```

This sturcture may be confusing and redundant, since resource's name itself can already be a unique identifier for an index without plugin's name.

Also, this API makes impossible to support dynamic index registration.

__In v2.0:__

Similar to v1, custom `searchApi` can be defined in plugin option. However, now each resource has its own `getter` and optional `searchApi`.

```js
searchPlugin({
  resources: {
    contacts: {
      // what fields to index
      index: ['address', 'name'],
      // access the state to be watched by Vuex Search
      getter: state => state.myResources.contacts,
    },
  },
}),
```

vuex-search v2 also supports dynamic index registration.

Vuex Search can be accessed through `store.search` or `this.$store.search` in a Vue instance.

## Mappers

__In v1.x:__

Because plugin can be named, `mapActions` and `mapGetters` needs to be composed from `composeSearchMappers` like so.

```js
import { composeSearchMappers } from 'vuex-search';

// Composing actions and getters from selected plugin name
const { mapSearchGetters, mapSearchActions } = composeSearchMappers('myIndex');
```

__In v2.0:__

Plugin name option is removed. Now mappers needn't to be composed.

```js
import {
  mapActions as mapSearchActions,
  mapGetters as mapSearchGetters,
} from 'vuex-search';
```

# 1.0.0

Initial release.