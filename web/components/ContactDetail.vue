<template>
  <div class="contactDetail__container">
    <img :src="avatar" class="contact__avatar"/>
    <div class="contact__text">
      <div>{{ name }}</div>
      <div>{{ address }}</div>
    </div>
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
.contactDetail__container {
  height: 60px;
  display: flex;
  align-items: center;
  .contact__avatar {
    width: 50px;
    height: 50px;
  }
  .contact__text {
    text-align: left;
    padding: 10px;
  }
}
</style>
