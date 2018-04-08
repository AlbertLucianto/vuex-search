<template>
  <div id="app">
    <button @click="fetchItems">generate</button>
    <input v-model="searchText" @keyup="searchChange"/>
    <virtual-scroller class="scroller" :items="searchText ? results : items"
      item-height="50" v-if="items.length">
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
import { mapGetters, mapActions, mapState } from 'vuex';
import { searchActions } from 'vuex-search';
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
    items() {
      return Object.values(this.itemsMap);
    },
    ...mapState({
      resultIds: state => state.search[RESOURCE_NAME].result,
    }),
    results() {
      return this.resultIds.map(id => this.itemsMap[id]);
    },
  },
  methods: {
    ...mapActions({
      fetchItems: 'fetchContacts',
      search: searchActions.SEARCH,
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
  max-width: 500px;
  width: 100%;
}
</style>
