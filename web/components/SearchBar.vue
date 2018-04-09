<template>
  <div class="searchbar__container">
    <input placeholder="Search" class="searchbar"/>
    <svg v-if="!auto" class="arrow__container" viewBox="0 0 60 60">
      <polyline class="arrow__polyline" :points="$options.points"></polyline>
      <polyline class="arrow__polyline animate" :points="$options.points"></polyline>
    </svg>
  </div>
</template>

<script>
export default {
  points: '30,10 50,30 10,30 50,30 30,50',
  props: {
    auto: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.searchbar__container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba($color: #000, $alpha: .2);
  padding: 5px;
}
.searchbar {
  margin: 5px;
  border-width: 0;
  padding: 5px;
  outline: none;
  font-size: 24px;
  flex-grow: 1;
  text-decoration: underline;
  &::placeholder {
    font-size: 24px;
  }
}
.arrow__container {
  margin: 5px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  .arrow__polyline {
    fill: none;
    stroke-width: 3px;
    stroke: #232222;
    stroke-linecap: round;
    stroke-linejoin: round;
    &.animate {
      transition: .3s all ease;
      stroke: #BBB;
      stroke-dashoffset: 2;
      stroke-dasharray: 70 0;
    }
  }
  &:hover .arrow__polyline.animate {
    stroke-dasharray: 0 140;
  }
}
</style>
