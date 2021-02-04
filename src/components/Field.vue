<template lang="pug">
  div(class="b24-field" :class="{'b24-field--expanded': expanded}")
    button(
      v-if="value"
      class="b24-field__clear-btn"
      @click="clear"
      )
      svg-icon
    input(class="b24-field__input"
      ref="field"
      @focus="focusInput"
      @blur="blurInput"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :class="[`b24-field__input--${outline}`]")

</template>

<script>
import SvgIcon from "@/components/SvgIcon";
export default {
  name: "Field",
  components: {
    SvgIcon
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    outline: {
      type: String,
      default: '',
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    loader: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
  },
  methods: {
    clear() {
      this.$refs.field.value = ''
      this.$emit('input', '')
    },
    focusInput() {
      this.$refs.field.focus()
      this.$emit('focus')
    },
    blurInput() {
      this.$refs.field.blur()
      this.$emit('blur')
    }
  }
}
</script>

<style lang="scss">
.b24-field {
  position: relative;
  max-width: 300px;

  &--expanded {
    max-width: 100%;
    width: 100%;
  }

  &__input {
    width: 100%;
    padding: 0 41px 0 10px;
    height: 40px;
    background: transparent;
    color: #242424;
    font-size: 16px;
    line-height: 18px;
    border: 2px solid #C4C4C4;
    border-radius: 4px;
    font-family: 'Open Sans', sans-serif;


    &:focus {
      border-color: darken(#C4C4C4, 10%);
      outline: none;
    }

    &::placeholder {
      font-family: 'Open Sans', sans-serif;
    }

    &--solo {
      border: none;
    }
  }

  &__clear-btn {
    position: absolute;
    top: 10px;
    right: 9px;
    width: 21px;
    height: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;

    &:focus {
      outline: none;
    }

    svg {
      fill: #AEB4C2;
      &:hover, &:active {
        fill: darken(#AEB4C2, 15%);
      }
    }
  }
}
</style>