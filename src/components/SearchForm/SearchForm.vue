<template lang="pug">
  form.b24-search-form(@submit.prevent="findSearch" v-on-clickaway="hideOfferList")
    .b24-search-field
      img.b24-search-field__icon(src="@/assets/svg/search.svg" alt="icon")
      field(
        v-model="searchValue"
        @keydown.native="selectOffer"
        @focus="showOffers"
        :expanded="true"
        outline="solo"
        placeholder="Поиск книг, авторов" )
      btn.b24-search-field__btn(type="submit" text="Найти" size="small")
    search-offer-list(
      v-if="visibleOffersList"
      :history="history"
      :popular-phrases="popularPhrases"
      @removeHistoryItem="removeHistoryItem"
      @clearAllHistory="clearAllHistory"
      @selectItem="updateSearchValue"
      :visible-history-and-phrases="visibleHistoryAndPhrases"
      :visible-suggestions="!visibleHistoryAndPhrases"
      :suggestions="suggestions"
      :selected-offer-id="selectedByArrowKeyOfferId"
      )


</template>

<script>
import SearchOfferList from "@/components/SearchForm/SearchFormList";
import Field from "@/components/Field";
import Btn from "@/components/Button";
import {localStorageTest} from "@/utils/localStorage";
import makeRequest from "@/api";
import {debounce} from "@/utils/helpers";
import { uuid } from 'vue-uuid'
import { directive as onClickaway } from 'vue-clickaway';

export default {
name: "SearchForm",
  directives: {
    onClickaway: onClickaway,
  },
  components: {
  Btn,
  Field,
  SearchOfferList
  },
  data: () => ({
    searchValue: '',
    debouncedSearchValue: '',
    history: [],
    popularPhrases: [],
    visibleOffersList: false,
    visibleHistoryAndPhrases: false,
    selectedByArrowKeyOfferIndex: -1,
    selectedByArrowKeyOfferId: '',
    suggestions: {
      simple: [],
      breadcrumbs: [],
      product: [],
    },
    queriesPopularPhrases: [
      {
        limit_suggest: 5,
      },
      {
        limit_product: 2,
      },
      {
        limit_section: 3,
      }
    ],
    queriesSuggests: [
      {
        q: '',
      },
      {
        limit_suggest: 5,
      },
      {
        limit_product: 3,
      },
      {
        limit_section: 3,
      }
    ],
  }),
  computed: {
    foundedOffers() {
      let mappedOffers = []
      if (this.visibleHistoryAndPhrases) {
        mappedOffers = this.history
        if (this.popularPhrases.length - 1 >= 0) {
          const mappedPhrases = this.popularPhrases.map(el => {
            return {id : el.id, value: el.attributes.phrase}
          })
          mappedOffers = [...this.history, ...mappedPhrases]
        }
      }

      if (!this.visibleHistoryAndPhrases) {
        Object.entries(this.suggestions).forEach(el => {
          el[el.length - 1].forEach(suggestion => mappedOffers.push({id: suggestion.id, value: suggestion.title}))
        })
      }
      return mappedOffers
    },
    sameQuery() {
      let res = false
      if (Object.hasOwnProperty.call(this.$route.query, 'q')) {
        res = this.$route.query.q.toLowerCase().trim() === this.searchValue.toLowerCase().trim()
      }
      return res
    }
  },
  watch: {
    searchValue(val) {
      this.selectedByArrowKeyOfferIndex = -1
      this.selectedByArrowKeyOfferId = ''
      this.debouncedSearchValue = val
      this.visibleHistoryAndPhrases = !val
      this.visibleOffersList = !val
    },
    debouncedSearchValue: debounce(function (val) {
      if (!this.sameQuery) {
        this.getSuggestions(val)
      }
    }, 400),
    history(val) {
      localStorage.setItem('historyUserSearch', JSON.stringify(val))
    },
  },
  created() {
      this.searchValue = Object.hasOwnProperty.call(this.$route.query, 'q') ? this.$route.query.q : ''
      if (localStorageTest()) {
        const historyStorage = JSON.parse(localStorage.getItem('historyUserSearch'))
        this.history = historyStorage ? historyStorage : []
      } else {
        alert('Пожалуйста включите в вашем браузере хранилище данных, такие как coockie и localStorage')
      }
      makeRequest("GET", 'api/v1/catalog/search/popular-phrase/', this.queriesPopularPhrases)
      .then(response => {
        this.popularPhrases = response.data.data
      })
  },
  methods: {
    getSuggestions(query) {
      if (!this.searchValue) {
        return
      }
      this.queriesSuggests.forEach(el => {
        if (Object.prototype.hasOwnProperty.call(el, 'q')) {
          el.q = query.toLowerCase()
        }
      })

      makeRequest("GET", 'api/v1/catalog/search/suggests/', this.queriesSuggests)
          .then(response => {
                this.mapSuggestions(response.DATA)
                this.visibleOffersList = response.DATA.length - 1 >= 0 || !query
          })
    },
    updateHistory() {
      const hasItem = this.history.filter(el => el.value.toLowerCase().trim() === this.searchValue.toLowerCase().trim())
      if (hasItem.length > 0 || !this.searchValue) {
        return
      }
      const newItem = {id: uuid.v4(), value: this.searchValue}
        if (this.history.length-1 === 3) {
          this.history = [...this.history.slice(1, this.history.length), newItem ]
        } else {
          this.history.push(newItem)
      }
    },
    mapSuggestions(suggestions) {
      if (suggestions.length - 1 === -1) {
        return
      }
      const options = {
        simpleSuggestionLimit: 5,
        suggestionBreadCrumbLimit: 3,
        suggestionProductLimit: 3
      }
      this.suggestions = {simple: [], breadcrumbs: [],  product: []}
      for (let i = 0; i<= suggestions.length - 1; i++) {
        if (suggestions[i].meta.length === 0) {
          if (this.suggestions.simple.length - 1 >= options.simpleSuggestionLimit - 1) {
            break
          }
            this.suggestions.simple.push({id: uuid.v4(), ...suggestions[i]})
        }

        if (Object.entries(suggestions[i].meta).length) {
          if (Object.hasOwnProperty.call(suggestions[i].meta,'bread_crumb')) {
            if (this.suggestions.breadcrumbs.length - 1 >= options.suggestionBreadCrumbLimit - 1) {
              break
            }
            this.suggestions.breadcrumbs.push({id: uuid.v4(), ...suggestions[i]})
          }
          if (
              Object.hasOwnProperty.call(suggestions[i].meta,'author')) {
            if (this.suggestions.product.length - 1 >= options.suggestionProductLimit - 1) {
              break
            }
            this.suggestions.product.push({id: uuid.v4(), ...suggestions[i]})
          }
        }
      }
    },
    selectOffer(event) {
      if (event.keyCode !== 38 && event.keyCode !== 40) {
        return
      }
      switch (event.keyCode) {
        case 38:
          if (this.selectedByArrowKeyOfferIndex <= 0) {
            return
          }
          this.selectedByArrowKeyOfferIndex--
          this.selectedByArrowKeyOfferId = this.foundedOffers[this.selectedByArrowKeyOfferIndex].id
          break
        case 40:
          if (this.selectedByArrowKeyOfferIndex >= this.foundedOffers.length - 1) {
            return
          }
          this.selectedByArrowKeyOfferIndex++
          this.selectedByArrowKeyOfferId = this.foundedOffers[this.selectedByArrowKeyOfferIndex].id
          break
      }
    },
    clearAllHistory(res) {
      this.history = res
    },
    removeHistoryItem(res) {
      this.history = res
    },
    updateSearchValue(value) {
      this.searchValue = value
      this.updateRouter()
    },
    showOffers() {
      if (!this.searchValue) {
        this.visibleOffersList  = true
        this.visibleHistoryAndPhrases = true
      }
      if (this.searchValue && !this.sameQuery && !this.visibleOffersList) {
        this.getSuggestions(this.searchValue)
      }
    },
    hideOfferList() {
      this.visibleOffersList = false
    },
    findSearch() {
      if (this.selectedByArrowKeyOfferId) {
        this.searchValue = this.foundedOffers.filter(el => el.id === this.selectedByArrowKeyOfferId)[0].value
      }
      this.updateRouter()
      this.visibleOffersList = false
    },
    updateRouter() {
      if (this.sameQuery) {
        return
      }
      this.updateHistory()
      if (this.$route.path === '/search') {
        this.$router.push({query: {q: this.searchValue.toLowerCase()}}).catch(()=>{})
      } else {
        this.$router.push( { path: '/search', query: { q: this.searchValue.toLowerCase() }} )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.b24-search-form {
  max-width: 890px;
  width: 100%;

  .b24-search-field {
    background: #fff;
    position: relative;
    padding-left: 40px;
    padding-right: 110px;
    border: 2px solid #3D70B2;
    border-radius: 4px;

    &__icon {
      width: 14px;
      height: 14px;
      position: absolute;
      left: 13px;
      top: 12px;
    }

    &__btn {
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 0;
    }
  }
}
</style>