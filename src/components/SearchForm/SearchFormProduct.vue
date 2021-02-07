<template lang="pug">
  .b24-search-product
    a.b24-search-product__img-wrapper(:href="product.link")
      img(:src="product.meta.image")
    .b24-search-product__info
      a(:href="product.link") {{product.title}}
      .b24-search-product__price-block
        span.b24-search-product__price(
            class="b24-search-product__price--main"
        ) {{product.meta.price}} р.
        span(v-if="discounted" class="b24-search-product__price b24-search-product__price--discount")
         | {{product.meta.original_price}} р.
        span(v-if="discounted" class="b24-search-product__discount")
          | {{`-${product.meta.discount}%`}}

</template>

<script>
export default {
  name: "SearchFormProduct",
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
.b24-search-product {
  display: flex;
  align-items: flex-start;

  &__img-wrapper {
    flex-shrink: 0;
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