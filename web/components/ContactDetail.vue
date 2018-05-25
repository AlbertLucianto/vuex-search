<template>
  <div class="contactDetail__container">
    <div class="avatar__wrapper">
      <img :src="avatar" class="contact__avatar"/>
    </div>
    <div class="contact__text">
      <div class="contact__name">
        <text-highlighter :queries="search.split(/\s+/)">{{ name }}</text-highlighter>
      </div>
      <div>
        <text-highlighter :queries="search.split(/\s+/)">{{ address }}</text-highlighter>
      </div>
      <div class="contact__words">
        <text-highlighter :queries="search.split(/\s+/)">{{ words }}</text-highlighter>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    address: String,
    avatar: String,
    words: String,
    search: String,
  },
};
</script>

<style lang="scss" scoped>
.contactDetail__container {
  height: 120px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
  padding: 10px;
  margin: 5px 15px 15px 15px;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0,0,0,.05);
  background: white;
  .avatar__wrapper {
    width: 55px;
    height: 55px;
    margin: 5px;
    .contact__avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .contact__name {
    font-weight: 600;
  }
  .contact__text {
    text-align: left;
    padding: 10px;
  }
  .contact__words {
    font-size: 11px;
  }
}
</style>
