<template>
  <div class="listVuexSearch">
    <button @click="fetchItems">generate</button>
    <input v-model="searchText" @keyup="searchChange"/>
    <virtual-scroller class="scroller" :items="searchText ? results : items"
      item-height="70" v-if="items.length">
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
import { searchActionTypes } from 'vuex-search';
import ContactDetail from '@/components/ContactDetail';

const RESOURCE_NAME = 'contacts';
const SEARCH_MODULE_PATH = 'searchIndex';

export default {
  components: {
    ContactDetail,
  },
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
      resultIds: state => state[SEARCH_MODULE_PATH][RESOURCE_NAME].result,
    }),
    results() {
      return this.resultIds.map(id => this.itemsMap[id]);
    },
  },
  methods: {
    ...mapActions({
      fetchItems: 'fetchContacts',
      search: `${SEARCH_MODULE_PATH}/${searchActionTypes.SEARCH}`,
    }),
    searchChange() {
      this.search({
        resourceName: RESOURCE_NAME,
        searchString: this.searchText,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.listVuexSearch {
  width: 400px;
  .scroller {
    height: 500px;
    width: 100%;
  }
}
</style>
