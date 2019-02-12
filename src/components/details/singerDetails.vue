<template>
  <div class="sing_de">
    <h1>歌手详情{{this.sid}}</h1>

  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";

  export default {
    data() {
      return {
        list: []
      }
    },
    props: {
      sid: {
        type: [String, Number]
      },
    },
    methods: {},
    created() {

    }
  }
</script>
<style>
  /*图片轮播组件高度为0 */
  .listen .mint-swipe {
    height: 200px;
  }

  .listen .mint-swipe img {
    width: 100%;
  }

</style>
