<template lang="pug">
  .b24-history-phrases
    div(v-if="history.length")
      div(
        class=`b24-history-phrases__item b24-history-phrases__item--main`)
        span История поиска
        button.b24-history-phrases__clear-btn(@click="clearAllHistory") Очистить
      div.b24-history-phrases__item(
        @click="selectItem(item.value)"
        v-for="item in history" :key="item.id"
        :class="{'b24-history-phrases__item--selected': item.id === selectedOfferId}")
        span {{item.value}}
        button(class=`b24-history-phrases__clear-btn`
          @click.stop="removeHistoryItem(item.id)")
          img(src="@/assets/svg/close-second.svg" alt="icon")
    div(v-if="popularPhrases.length")
      div(class="b24-history-phrases__item b24-history-phrases__item--main")
        span Популярные запросы
      div.b24-history-phrases__item(
        v-for="item in popularPhrases"
        :key="item.id"
        @click="selectItem(item.attributes.phrase)"
        :class="{'b24-history-phrases__item--selected': item.id === selectedOfferId}"
      )
        span {{item.attributes.phrase}}

</template>

<script>
export default {
  name: "SearchOfferHistoryPhrases",
  props: {
    history: {
      type: Array,
      default: () => []
    },
    popularPhrases: {
      type: Array,
      default: () => []
    },
    selectedOfferId: {
      type: String,
      default: ''
    }
  },
  methods: {
    selectItem(value) {
      this.$emit('selectItem', value)
    },
    removeHistoryItem(id) {
      this.$emit('removeHistoryItem', this.history.filter(
          el => el.id !== id
      ))
    },
    clearAllHistory() {
      this.$emit('clearAllHistory', [])
    },
  }
}
</script>

<style lang="scss" scoped>
.b24-history-phrases {

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px 8px 16px;
    color: #242424;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    cursor: pointer;

    &:hover {
      background: #F5F6F9;
    }

    &--main {
      background: darken(#F5F6F9, 4%);
      color: #7D8290;
    }

    &--selected {
      background: #F5F6F9;
    }
  }

  &__clear-btn {
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #7D8290;
    font-family: 'Open Sans', sans-serif;

    &:focus {
      outline: none;
    }

    &:active, &:hover {
      color: darken(#7D8290, 15%);
    }
  }
}

</style>