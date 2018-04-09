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
  height: 69px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
  padding: 5px;
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
