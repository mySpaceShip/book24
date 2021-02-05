<template lang="pug">
  .b24-search-offers
    search-form-history-phrases(
      v-if="visibleHistoryAndPhrases"
      :history="history"
      :popular-phrases="popularPhrases"
      :selectedOfferId="selectedOfferId"
      @selectItem="selectItem"
      @clearAllHistory="clearAllHistory"
      @removeHistoryItem="removeHistoryItem")
    search-form-suggestions(
      v-if="visibleSuggestions"
      :suggestions="suggestions"
      :selectedOfferId="selectedOfferId")
</template>

<script>
import SearchOfferProduct from "@/components/SearchForm/SearchFormProduct";
import SearchFormHistoryPhrases from "@/components/SearchForm/SearchFormHistoryPhrases";
import SearchFormSuggestions from "@/components/SearchForm/SearchFormSuggestions";

export default {
  name: "SearchOfferList",
  components: {
    SearchOfferProduct,
    SearchFormHistoryPhrases,
    SearchFormSuggestions
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
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 8px 0 rgba(36,36,36,.25);
}

</style>