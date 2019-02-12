<template>
  <!-- 假的登陆页面 -->
  <div class="my">
    <h2>这里需要您<br> 登陆您的网易云音乐账号</h2>
    <p>我知道你懒得且不想登陆~</p>
    <p>是的！你不想~</p>
    <p>好的~那这里就这样了</p>
    <div class="sorry"></div>
    <img src="../../assets/sorry.jpg" alt="加载失败">
  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";

  export default {
    data() {
      return {
        list: []
      };
    },
    methods: {},
    created() {
    }
  };
</script>
<style scoped>
  .sorry {
    width: 90%;
  }

  h2 {
    color: #3ddddd;
  }

  img {
    width: 100%;
    border-radius: 30px;
  }
</style>
