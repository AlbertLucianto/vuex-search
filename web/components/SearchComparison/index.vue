<template>
  <section id="comparison">
    <search-bar></search-bar>
    <div class="list__container">
      <list-vuex-search></list-vuex-search>
      <!-- <list-normal></list-normal> -->
    </div>
  </section>
</template>

<script>
import SearchBar from '@/components/SearchBar';

import ListVuexSearch from './ListVuexSearch';

export default {
  components: {
    ListVuexSearch,
    SearchBar,
  },
};
</script>

<style lang="scss" scoped>
#comparison {
  .list__container {
    display: flex;
    justify-content: center;
  }
}
</style>
