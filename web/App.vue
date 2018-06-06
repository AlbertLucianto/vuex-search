<template>
  <div id="app">
    <div class="info__container">
      <a href="https://github.com/AlbertLucianto/vuex-search">
        <h1 class="info__header main">Vuex Search</h1>
      </a>
      <p class="info__description">
        Vuex Search is a plugin for searching collections of objects.
        Search algorithms powered by <a href="https://github.com/bvaughn/js-worker-search">js-worker-search.</a>
      </p>
      <h3 class="info__header">Installation</h3>
      <pre class="info__preformat">npm install --save vuex-search</pre>
      <h3 class="info__header">Usage</h3>
      <p class="info__description">Please read the documentation
        <a href="https://github.com/AlbertLucianto/vuex-search/blob/master/README.md">here.</a>
      </p>
    </div>
    <div class="demo__container">
      <list-contacts :searchText="search"></list-contacts>
    </div>
  </div>
</template>

<script>
import ListContacts from '@/components/ListContacts';

export default {
  name: 'App',
  components: {
    ListContacts,
  },
  data() {
    return {
      search: '',
    };
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
  margin: auto;
  margin-top: calc(25vh - 100px);
  width: 1000px;
  height: 600px;
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat(5, 200px);
  justify-items: center;
  .info__container {
    grid-column-start: 1;
    grid-column-end: 3;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .info__header {
      padding-bottom: 5px;
      border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
      &.main {
        color: #42b983;
      }
    }
    .info__description {
      margin-top: 0;
    }
    .info__preformat {
      padding: 20px;
      background-color: #FBFBFB;
      border-radius: 5px;
    }
    a:link, a:visited {
      color: #42b983;
      text-decoration: none;
    }
  }
  .demo__container {
    grid-column-start: 3;
    grid-column-end: 6;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
