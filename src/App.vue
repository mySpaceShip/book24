<template>
  <div id="app">
    <book-app class="b24-app" />
  </div>
</template>

<script>
import BookApp from "@/app/BookApp";

export default {
  name: 'App',
  components: {BookApp},
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
#app {
  font-family: 'Open Sans', sans-serif;

  .b24-app {
    margin-top: 100px;
    margin-left: 100px;
  }
}
</style>
