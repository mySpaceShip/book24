<template lang="pug">
  .b-24-search-suggestions
    div(class='b24-search-suggestions__item'
      v-for="item in suggestions.simple" :key="item.id"
      :class="{'b24-search-suggestions__item--selected': item.id === selectedOfferId}"
      @click="selectItem(item.title)")
      a.b24-search-suggestions__link(:href="item.link") {{item.title}}
    div(class=`b24-search-suggestions__item b24-search-suggestions__item--section`
      v-for="item in suggestions.breadcrumbs" :key="item.id"
      :class="{'b24-search-suggestions__item--selected': item.id === selectedOfferId}"
      @click="selectItem(item.title)")
      a(:href="item.link"
        class="b24-search-suggestions__link") {{item.title}}
      .b24-search-suggestions__breadcrumbs
        a(class="b24-search-suggestions__link b24-search-suggestions__link--breadcrumb"
          v-for="breadcrumb in item.meta.bread_crumb"
          :key="breadcrumb.id"
          :href="breadcrumb.url")
          | {{breadcrumb.name}}
    search-form-product(class="b24-search-suggestions__item"
      v-for="(item, index) in suggestions.product"
      :key="item.id"
      :product="item"
      @click.native="selectItem(item.title)"
      :class=`{'b24-search-suggestions__item--selected': item.id === selectedOfferId,
                'b24-search-suggestions__item--section': index === 0}`)
</template>

<script>
import SearchFormProduct from "@/components/SearchForm/SearchFormProduct";
export default {
  name: "SearchFormSuggestions",
  components: {
    SearchFormProduct
  },
  props: {
    selectedOfferId: {
      type: String,
      default: ''
    },
    suggestions: {
      type: Object,
      default: () => {}
    },
  },
  methods: {
    selectItem(value) {
      this.$emit('selectItem', value)
    }
  }
}
</script>

<style scoped lang="scss">
.b24-search-suggestions {

  &__item {
    padding: 14px 16px;
    cursor: pointer;

    &:hover {
      background: #F5F6F9;
    }

    &--section {
      border-top: 1px solid #C7CCD7;
    }

    &--selected {
      background: darken(#F5F6F9, 5%);
    }
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
    padding-top: 12px;
  }
}

</style>