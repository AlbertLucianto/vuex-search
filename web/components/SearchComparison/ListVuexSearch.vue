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
import { mapGetters, mapActions } from 'vuex';
import { actionTypes, getterTypes, composeSearchMappers } from 'vuex-search';
import ContactDetail from '@/components/ContactDetail';

const { mapSearchActions, mapSearchGetters } = composeSearchMappers('searchIndex');

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
    ...mapSearchGetters('contacts', { resultIds: getterTypes.result }),
    results() {
      return this.resultIds.map(id => this.itemsMap[id]);
    },
  },
  methods: {
    ...mapActions({ fetchItems: 'fetchContacts' }),
    ...mapSearchActions('contacts', { searchContacts: actionTypes.search }),
    searchChange() {
      this.searchContacts(this.searchText);
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
