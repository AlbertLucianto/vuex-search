<template>
  <div id="app">
    <search-comparison></search-comparison>
  </div>
</template>

<script>
import SearchComparison from '@/components/SearchComparison';

export default {
  name: 'App',
  components: {
    SearchComparison,
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
