<template>
  <div>
    <div>{{ name }}</div>
    <div>{{ address }}</div>
    <div>{{ avatar }}</div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    address: String,
    avatar: String,
  },
};
</script>

<style lang="scss" scoped>

</style>
