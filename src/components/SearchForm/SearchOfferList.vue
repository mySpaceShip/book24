<template lang="pug">
  .b24-search-offers
    div(v-if="visibleHistoryAndPhrases")
      div(v-if="history.length")
        div(
          class=`b24-search-offers__item
                b24-search-offers__item--flex-between
                b24-search-offers__item--main`)
          span История поиска
          button.b24-search-offers__clear-btn(@click="clearAllHistory") Очистить
        div.b24-search-offers__item.b24-search-offers__item--flex-between(
            @click="addItem(item.value)"
            v-for="item in history" :key="item.id"
            :class="{'b24-search-offers__item--main': item.id === selectedOfferId}")
          span {{item.value}}
          button(class=`b24-search-offers__clear-btn`
                @click.stop="removeHistoryItem(item.id)")
            img(src="@/assets/svg/close-second.svg" alt="icon")
      div(v-if="popularPhrases.length")
        div(class="b24-search-offers__item b24-search-offers__item--main")
          span Популярные запросы
        div.b24-search-offers__item(
            v-for="item in popularPhrases"
            :key="item.id"
            @click="addItem(item.attributes.phrase)"
            :class="{'b24-search-offers__item--main': item.id === selectedOfferId}"
           )
          a(class="b24-search-offers__link")
            | {{item.attributes.phrase}}
    div(v-if="visibleSuggestions")
      div.b24-search-offers__list
        div(class=`b24-search-offers__item`
            v-for="(item, index) in suggestions.simple" :key="index"
            :class="{'b24-search-offers__item--main': item.id === selectedOfferId}")
          a.b24-search-offers__link(:href="item.link") {{item.title}}
      div.b24-search-offers__list
        div(class=`b24-search-offers__item`
            v-for="item in suggestions.breadCrumbs" :key="item.id"
            :class="{'b24-search-offers__item--main': item.id === selectedOfferId}")
          a(:href="item.link"
            class="b24-search-offers__link") {{item.title}}
          p.b24-search-offers__breadcrumbs
            a(class="b24-search-offers__link b24-search-offers__link--breadcrumb"
              v-for="breadcrumb in item.meta.bread_crumb"
              :key="breadcrumb.id"
              :href="breadcrumb.url")
              | {{breadcrumb.name}}
      div.b24-search-offers__list
        search-offer-card(class="b24-search-offers__item"
          v-for="item in suggestions.product"
          :key="item.id"
          :product="item"
          :class="{'b24-search-offers__item--main': item.id === selectedOfferId}")
</template>

<script>
import SearchOfferCard from "@/components/SearchForm/SearchOfferCard";

export default {
  name: "SearchOfferList",
  components: {
    SearchOfferCard
  },
  props: {
    history: {
      type: Array,
      default: () => []
    },
    visibleHistoryAndPhrases: {
      type: Boolean,
      default: false
    },
    visibleSuggestions: {
      type: Boolean,
      default: false
    },
    popularPhrases: {
      type: Array,
      default: () => []
    },
    suggestions: {
      type: Object,
      default: () => {}
    },
    selectedOfferId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
  }),
  methods: {
    removeHistoryItem(id) {
      this.$emit('removeHistoryItem', this.history.filter(
          el => el.id !== id
      ))
    },
    clearAllHistory() {
      this.$emit('clearAllHistory', [])
    },
    addItem(value) {
      this.$emit('addItem', value)
    }
  }
}
</script>

<style scoped lang="scss">
.b24-search-offers {
  border: 1px solid #C7CCD7;
  background: #fff;
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0 2px 8px 0 rgba(36,36,36,.25);

  &__item {
    padding: 8px 20px 8px 16px;
    color: #242424;
    font-size: 14px;
    line-height: 16px;
    font-family: 'Open Sans', sans-serif;
    text-align: left;
    cursor: pointer;

    &:hover {
      background: #F5F6F9;
    }

    &--main {
      background: darken(#F5F6F9, 4%);
      color: #7D8290;
    }

    &--flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__list {
    border-bottom: 1px solid #C7CCD7;
  }

  &__link {
    color: #242424;
    text-decoration: none;

    &:hover, &:active {
      color: lighten(#242424, 15%);
    }

    &--breadcrumb {
      color:  #7D8290;

      &:after {
        content: '\00a0/\00a0';
        color: #7D8290;
      }

      &:last-child {
        &:after {
          content: none;
        }
      }
    }
  }

  &__breadcrumbs {
    padding-top: 8px;
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