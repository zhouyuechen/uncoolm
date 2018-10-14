<template>
 <div class="geshou">
 <h3>歌手分类</h3><hr>
  <ul class="hot" >
  
    <li v-text="item.tp"  v-for="(item,i) in singer" :key="i" ref="hots"
    @click="getPeople(item.code)"
     ></li>
   
  </ul><hr>
  <mt-cell v-for="(item,i) in singer2" :key="i"
  :title="item.name"
  @click.native="getDetails(item.name)"
  is-link
  value="查看详情">
</mt-cell>
 </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  export default{
    data(){
      return {
        is_active:"",
        singer:[{tp:"入驻歌手" ,code:5001,people:[]},
        {tp:"华语男歌手" ,code:1001,people:[]},
        {tp:"华语女歌手" ,code:1002,people:[]},
        {tp:"华语组合/乐队" ,code:1003,people:[]},
        {tp:"欧美男歌手" ,code:2001,people:[]},
        {tp:"欧美女歌手" ,code:2002,people:[]},
        {tp:"欧美组合/乐队" ,code:2003,people:[]},
        {tp:"日本男歌手" ,code:6001,people:[]},
        {tp:"日本女歌手" ,code:6002,people:[]},
        {tp:"韩国男歌手" ,code:7001,people:[]},
        {tp:"韩国女歌手" ,code:7002,people:[]},
        {tp:"韩国组合/乐队" ,code:7003,people:[]},
        {tp:"其他男歌手" ,code:4001,people:[]},
        {tp:"其他女歌手" ,code:4002,people:[]},
        {tp:"其他组合/乐队" ,code:4003,people:[]}
                            ],
        singer2:[]  
      }
    },
    methods:{
     getPeople(code){
        
           var url=`artist/list?cat=${code}&offset=0&limit=50`;
       this.$http.get(url).then(result => {
        this.singer2= result.body.artists;
        
       });
     
     
     },
      changeC() {
      /* 随机背景颜色 */
      for (var e = 0; e < this.$refs.hots.length; e++) {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        this.$refs.hots[e].style.backgroundColor = `rgba(${r},${g},${b},0.9 )`;
      }
     },
     getDetails(val){
           this.$emit("search_val", val);
     }
    
    },
    created(){
      
    },
    mounted(){
      setTimeout(() => {
      this.changeC();
    }, 300);
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
    .hot {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0;

  flex-wrap: wrap;
  p {
    width: 100%;
    text-align: left;
    border-bottom: 2px dashed #666;
    font-size: 1.1rem;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
  }
  li {
    list-style: none;
    max-width: 50%;
    min-width: 20%;
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 10px;
    background-color: transparent;
    margin: 0.1rem 0;
    color: white;
  }
}
  }
</style>