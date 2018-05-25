<template>
  <div id="app">
    <list-contacts></list-contacts>
  </div>
</template>

<script>
import ListContacts from '@/components/ListContacts';

export default {
  name: 'App',
  components: {
    ListContacts,
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
