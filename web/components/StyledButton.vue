<template>
  <span
    v-bind="$attrs"
    v-on="$listeners"
    :class="{
      styled__button: true,
      outline,
      solid,
    }">
    <slot></slot>
    <slot name="icon"></slot>
  </span>
</template>

<script>
export default {
  props: {
    outline: Boolean,
    solid: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.styled__button {
  padding: 12px;
  margin: 5px;
  font-size: 14px;
  border-radius: 40px;
  text-transform: uppercase;
  font-weight: 500;
  transition: all .1s ease;
  box-shadow: 0 5px 10px #42b98380;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:active {
    box-shadow: 0 2px 5px #42b98380;
  }
  &.outline {
    border-width: 1px;
    border-style: solid;
    border-color: #42b983;
  }
  &.solid {
    background-color: #42b983;
    color: white;
  }
}
</style>
