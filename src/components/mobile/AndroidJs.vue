<template>
  <div class="mobile">
    <h1>{{ msg }}</h1>
    <div><input type="button" value="打招呼" onclick="androidJs.showToast('我是一个h5')"/></div>
  </div>
</template>

<script>
  export default {
    name: 'phone',
    data () {
      return {
        msg: 'HelloWorld,I am mobile'
      }
    },
    mounted () {
      window.androidCallJs = this.androidCallJs;
      window.androidCallReturn = this.androidCallReturn;
    },
    methods : {
      androidCallJs(androidMsg){
        alert(androidMsg);
      },
      androidCallReturn(){
        return "99999";
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
