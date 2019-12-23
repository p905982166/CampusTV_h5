<template>
  <div class="mobile">
    <h1>{{ msg }}</h1>
    <div><input type="button" value="打招呼" onclick="androidJs.showToast('我是h5')"/></div>
  </div>
</template>

<script>
  export default {
    name: '手机版',
    data () {
      return {
        msg: 'HelloWorld,I am mobile'
      }
    },
    mounted () {
      window.androidCallJs = this.androidCallJs;
    },
    methods : {
      androidCallJs(androidMsg){
        alert(androidMsg)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
