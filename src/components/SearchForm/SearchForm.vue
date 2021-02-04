<template lang="pug">
  form.b24-search-form(@submit.prevent="" v-on-clickaway="hideOfferList")
    .b24-search-field
      img.b24-search-field__icon(src="@/assets/svg/search.svg" alt="icon")
      field(v-model="searchValue"
        @keydown.native="selectOffer"
        @focus="showOffers"
        :expanded="true"
        outline="solo"
        placeholder="Поиск книг, авторов" )
      btn.b24-search-field__btn(type="submit" text="Найти" size="small")
    search-offer-list(
      v-if="visibleOfferList"
      :history="history"
      :popular-phrases="popularPhrases"
      @removeHistoryItem="removeHistoryItem"
      @clearAllHistory="clearAllHistory"
      @addItem="updateSearchValue"
      :visible-history-and-phrases="visibleHistoryAndPhrases"
      :visible-suggestions="visibleSuggestions"
      :suggestions="suggestions"
      :selected-offer-id="selectedByKeyOfferId"
      )


</template>

<script>
import SearchOfferList from "@/components/SearchForm/SearchOfferList";
import Field from "@/components/Field";
import Btn from "@/components/Button";
import {localStorageTest} from "@/utils/localStorage";
import makeRequest from "@/api";
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
    history: [],
    popularPhrases: [],
    visibleOfferList: false,
    visibleHistoryAndPhrases: true,
    visibleSuggestions: false,
    selectedItem: null,
    selectedByKeyOfferIndex: -1,
    selectedByKeyOfferId: '',
    suggestions: {
      simple: [],
      breadCrumbs: [],
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
  watch: {
    searchValue: function(val, newVal) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.visibleHistoryAndPhrases = !val ? true : false
      this.visibleSuggestions = !val ? false : true
      this.visibleOfferList = !val ? true : false

      if (val.toLowerCase().trim() !== newVal.toLowerCase().trim()) {
        this.timeout = setTimeout(() => {
          this.getSuggestions()
        }, 400);
      }
    },
    history(val) {
      localStorage.setItem('historyUserSearch', JSON.stringify(val))
    },
    visibleOfferList() {
      this.selectedByKeyOfferIndex = -1
      this.selectedByKeyOfferId = ''
    }
  },
  created() {
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
    getSuggestions() {
          this.queriesSuggests.forEach(el => {
            if (Object.prototype.hasOwnProperty.call(el, 'q')) {
              el.q = this.searchValue.toLowerCase()
            }
          })

      makeRequest("GET", 'api/v1/catalog/search/suggests/', this.queriesSuggests)
          .then(response => {
                this.mapSuggestions(response.DATA)
                this.visibleOfferList = response.DATA.length - 1 > 0 || !this.searchValue
          })
      this.updateHistory()
    },
    updateHistory() {
      if (!this.searchValue) {
        return
      }
      if (!this.history) {
        this.history.push({id: uuid.v4(), value: this.searchValue})
      } else {
        if (this.history.length-1 === 3) {
          this.history = [...this.history.slice(1, this.history.length), { id: uuid.v4(), value: this.searchValue} ]
        } else {
          this.history.push({ id: uuid.v4(), value: this.searchValue})
        }
      }
    },
    mapSuggestions(suggestions) {
      const options = {
        simpleSuggestionLimit: 5,
        suggestionBreadCrumbLimit: 3,
        suggestionProductLimit: 3
      }
      this.suggestions = {simple: [], breadCrumbs: [],  product: []}
      for (let i = 0; i<= suggestions.length - 1; i++) {
        if (suggestions[i].meta.length === 0) {
          if (this.suggestions.simple.length - 1 >= options.simpleSuggestionLimit - 1) {
            break
          }
            this.suggestions.simple.push({id: uuid.v4(), ...suggestions[i]})
        }

        if (Object.entries(suggestions[i].meta).length) {
          if (Object.hasOwnProperty.call(suggestions[i].meta,'bread_crumb')) {
            if (this.suggestions.breadCrumbs.length - 1 >= options.suggestionBreadCrumbLimit - 1) {
              break
            }
            this.suggestions.breadCrumbs.push({id: uuid.v4(), ...suggestions[i]})
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
      if (!this.visibleOfferList) {
        return
      }
      let allOffers = []
      if (this.visibleHistoryAndPhrases) {
        allOffers = [...this.history, ...this.popularPhrases]
      }

      if (this.visibleSuggestions) {
        Object.entries(this.suggestions).forEach(el => {
          allOffers.push(...el[el.length - 1])
        })
      }
      switch (event.keyCode) {
        case 13:
          if (this.selectedByKeyOfferId) {
            const selectedOffer = allOffers.filter(el=> el.id === this.selectedByKeyOfferId)[0]
            if (Object.hasOwnProperty.call(selectedOffer, 'link')) {
              this.$router.push(`${selectedOffer.link}`)
            }
          }
          break
        case 38:
          if (this.selectedByKeyOfferIndex <= 0) {
            return
          }
          this.selectedByKeyOfferIndex--
          this.selectedByKeyOfferId = allOffers[this.selectedByKeyOfferIndex].id
          break
        case 40:
          if (this.selectedByKeyOfferIndex >= allOffers.length - 1) {
            return
          }
          this.selectedByKeyOfferIndex++
          this.selectedByKeyOfferId = allOffers[this.selectedByKeyOfferIndex].id
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
    },
    showOffers() {
      if (this.searchValue) {
        this.getSuggestions()
      }
      this.visibleOfferList = true
    },
    hideOfferList() {
      this.visibleOfferList = false
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