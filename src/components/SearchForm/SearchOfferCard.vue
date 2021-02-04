<template lang="pug">
  .b24-search-offer-card
    a.b24-search-offer-card__img-wrapper(:href="product.link")
      img(:src="product.meta.image")
    .b24-search-offer-card__info
      a(:href="product.link") {{product.title}}
      .b24-search-offer-card__price-block
        span.b24-search-offer-card__price(
            class="b24-search-offer-card__price--main"
        ) {{product.meta.price}} р.
        span(v-if="discounted" class="b24-search-offer-card__price b24-search-offer-card__price--discount")
         | {{product.meta.original_price}} р.
        span(v-if="discounted" class="b24-search-offer-card__discount")
          | {{`-${product.meta.discount}%`}}

</template>

<script>
export default {
  name: "SearchOfferCard",
  props: {
    product: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    discounted() {
      return this.product.meta.discount !== 0
    }
  }
}
</script>

<style lang="scss" scoped>
.b24-search-offer-card {
  display: flex;
  align-items: flex-start;

  &__img-wrapper {
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 60px;

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 2px;
    a {
      padding-bottom: 8px;
      text-decoration: none;
      color: #242424;
      font-size: 14px;
      line-height: 16px;
      cursor: pointer;

      &:hover, &:active {
        color: lighten(#242424, 15%);
      }
    }
  }

  &__price-block {
    display: flex;
    align-items: baseline;
  }

  &__price {
    color: #242424;
    font-size: 14px;
    line-height: 16px;

    &--main {
      font-weight: 700;
    }

    &--discount {
      text-decoration: line-through;
      color: #7D8290;
      margin: 0 8px;
    }
  }

  &__discount {
    background: #FE6564;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 24px;
    flex-shrink: 0;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
  }
}

</style>