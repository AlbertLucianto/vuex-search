<template>
  <div id="app">
    <button @click="fetchItems">generate</button>
    <input v-model="searchText" @keydown="searchChange"/>
    <virtual-scroller class="scroller" :items="searchText ? results : items"
      item-height="42" v-if="items.length">
      <template slot-scope="props">
        <contact-detail
          :key="props.itemKey"
          :name="props.item.name"
          :address="props.item.address"
          :avatar="props.item.avatar">
        </contact-detail>
      </template>
    </virtual-scroller>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { searchGetters, searchActions } from 'vuex-search';
import ContactDetail from './components/ContactDetail';

const RESOURCE_NAME = 'contacts';

export default {
  name: 'App',
  data() {
    return {
      searchText: '',
    };
  },
  computed: {
    ...mapGetters({
      itemsMap: 'currentContacts',
    }),
    ...mapGetters({
      searchResultByName: searchGetters.resultByName,
    }),
    items() {
      return Object.values(this.itemsMap);
    },
    results() {
      return this
        .searchResultByName(RESOURCE_NAME)
        .map(id => this.itemsMap[id]);
    },
  },
  methods: {
    ...mapActions({
      fetchItems: 'fetchContacts',
    }),
    ...mapActions({
      search: searchActions.search,
    }),
    searchChange() {
      this.search({
        resourceName: RESOURCE_NAME,
        searchString: this.searchText,
      });
    },
  },
  components: {
    ContactDetail,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.scroller {
  height: 500px;
}
</style>
