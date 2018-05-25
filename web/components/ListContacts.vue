<template>
  <div class="listVuexSearch">
    <div class="inputs__container">
      <styled-button
        @click="fetchItems"
        solid
        class="button__generate">
        generate
      </styled-button>
      <input-field
        @keyup="searchChange"
        placeholder="Search"
        class="searchbar"
      />
    </div>
    <div class="empty__message centered" v-if="!items.length">Please generate</div>
    <div
      class="empty__message centered"
      v-if="items.length && searchText && !results.length">
      Empty result
    </div>
    <img
      class="loading__icon centered"
      src="../assets/loading-cubes.svg"
      v-if="generating"
    />
    <virtual-scroller
      class="scroller"
      :items="searchText ? results : items"
      item-height="135">
      <template slot-scope="props" v-if="items.length">
        <contact-detail
          :key="props.itemKey"
          :name="props.item.name"
          :address="props.item.address"
          :words="props.item.words"
          :avatar="props.item.avatar"
          :search="searchText">
        </contact-detail>
      </template>
    </virtual-scroller>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { actionTypes, getterTypes, composeSearchMappers } from 'vuex-search';
import ContactDetail from '@/components/ContactDetail';
import InputField from '@/components/InputField';
import StyledButton from '@/components/StyledButton';

const { mapSearchActions, mapSearchGetters } = composeSearchMappers();

export default {
  components: {
    ContactDetail,
    InputField,
    StyledButton,
  },
  data() {
    return {
      searchText: '',
    };
  },
  computed: {
    ...mapGetters({
      itemsMap: 'currentContacts',
      generating: 'isGenerating',
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
    searchChange(e) {
      this.searchText = e.target.value;
      this.searchContacts(this.searchText);
    },
  },
};
</script>

<style lang="scss" scoped>
.listVuexSearch {
  width: 450px;
  height: 500px;
  position: relative;
  .inputs__container {
    display: flex;
    justify-content: center;
    align-items: center;
    .button__generate {
      margin-right: 15px;
    }
    .searchbar {
      flex-grow: 1;
    }
  }
  .centered {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: 500;
    opacity: 0.5;
  }
  .loading__icon {
    width: 50px;
    filter: invert(100%);
    margin-top: 20px;
  }
  .scroller {
    background-color: #FBFBFB;
    border: 1px solid rgba($color: #000000, $alpha: .1);
    box-shadow: 0 5px 10px rgba(0,0,0,.05);
    border-radius: 5px;
    height: 500px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
