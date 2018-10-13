<template>
 <div class="geshou">
 <h3>歌手分类</h3><hr>
 <mt-index-list>
  <mt-index-section class="index"  v-for="(item,i) in singer" :key="i" :index="item.tp">
    <mt-cell :title="item.code.toString()"></mt-cell>
   
  </mt-index-section>
  
</mt-index-list>
 </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  export default{
    data(){
      return {
        singer:[{tp:"入驻歌手" ,code:5001},
        {tp:"华语男歌手" ,code:1001},
        {tp:"华语女歌手" ,code:1002},
        {tp:"华语组合/乐队" ,code:1003},
        {tp:"欧美男歌手" ,code:2001},
        {tp:"欧美女歌手" ,code:2002},
        {tp:"欧美组合/乐队" ,code:2003},
        {tp:"日本男歌手" ,code:6001},
        {tp:"日本女歌手" ,code:6002},
        {tp:"韩国男歌手" ,code:7001},
        {tp:"韩国女歌手" ,code:7002},
        {tp:"韩国组合/乐队" ,code:7003},
        {tp:"其他男歌手" ,code:4001},
        {tp:"其他女歌手" ,code:4002},
        {tp:"其他组合/乐队" ,code:4003}
                            ]
      }
    },
    methods:{
     
    },
    created(){
      
    }
  }
</script>
<style scoped lang="scss">
$bgc: black;
$topc: rgba(32, 179, 125, 1);
$l20: 20%;
$l100: 100%;
$l50: 50%;
  .h3{
    color: $topc;
  }
  .geshou{
    .mint-indexlist-navitem{
       color: $topc;
       font-weight: 500;
    }
  }
</style>