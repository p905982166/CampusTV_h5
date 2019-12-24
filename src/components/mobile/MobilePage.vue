<template>
  <div>
    <div>user_info {{user_info}}</div>
    <div>user_info {{user_info.username}} {{user_info.password}} </div>
    <div>info {{username}} {{password}} </div>
  </div>
</template>

<script>
  export default {
    name: 'mobilePage',
    data(){
      return{
        msg : '你好',
        user_info : '',
        username : '',
        password : ''
      }
    },
    created() {
      this.getUserInfo(1);
    },
    mounted() {

    },
    methods : {
      getUserInfo(id){
        this.$http.get("/controller/find?id=" + id ).then(res => {
          this.user_info = res.data;
          this.username = res.data.username;
          this.password = res.data.password;
        })

      }
    }

  }
</script>

<style scoped>
</style>
