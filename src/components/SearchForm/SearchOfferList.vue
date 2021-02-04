<template lang="pug">
  .b24-search-offers
    search-offer-history-phrases(
      v-if="visibleHistoryAndPhrases"
      :history="history"
      :popular-phrases="popularPhrases"
      :selectedOfferId="selectedOfferId"
      @selectItem="selectItem"
      @clearAllHistory="clearAllHistory"
      @removeHistoryItem="removeHistoryItem")
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
import SearchOfferProduct from "@/components/SearchForm/SearchOfferProduct";
import SearchOfferHistoryPhrases from "@/components/SearchForm/SearchOfferHistoryPhrases";

export default {
  name: "SearchOfferList",
  components: {
    SearchOfferProduct,
    SearchOfferHistoryPhrases
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
    removeHistoryItem(value) {
      this.$emit('removeHistoryItem', value)
    },
    clearAllHistory(value) {
      this.$emit('clearAllHistory', value)
    },
    selectItem(value) {
      this.$emit('selectItem', value)
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