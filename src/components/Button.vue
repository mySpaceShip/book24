<template lang="pug">
  button(class="b24-button"
    :type="type"
    :class="[`b24-button--${size}`, `b24-button--${color}`, disabled ? 'b24-button--disabled' : '']")
    | {{text}}
</template>

<script>
export default {
  name: "Btn",
  props: {
    text: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
.b24-button {
    padding: 0 16px;
    background: #6EBC63;
    text-align: center;
    color: #fff;
    max-width: 220px;
    height: 52px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Open Sans', sans-serif;
    line-height: 18px;
    font-weight: 600;

  &:focus {
    outline: none;
  }

  &:hover, &:active {
    background: darken(#6EBC63, 5%);
  }

  &--white {
    background: #fff;
    color: #2c3e50;
    border: 1px solid #2c3e50;

    &:hover, &:active {
      background: darken(#fff, 5%);
    }
  }
  &--disabled {
    background: #B4C0CA;
    color: #fff;
    cursor: not-allowed;
  }

  &--small {
    max-width: 114px;
    width: 100%;
    height: 40px;
    font-size: 14px;
    line-height: 16px;
  }
}
</style>