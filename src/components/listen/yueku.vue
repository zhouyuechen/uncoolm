<template>
 <div class="yueku">

  <div class="nav">
      <mt-button class="btns" size="small" @click.native.prevent="active = 't1'">推荐</mt-button>
      <mt-button class="btns" size="small" @click.native.prevent="active = 't2'">排行</mt-button>
      <mt-button class="btns" size="small" @click.native.prevent="active = 't3'">分类</mt-button>
      <div class="bor" ref="bor"></div>
    </div>
 <mt-tab-container v-model="active" swipeable>
  <mt-tab-container-item id="t1" >
    <infinite-box v-on:playThis="goup"   ></infinite-box>
  </mt-tab-container-item>
  <mt-tab-container-item id="t2">
    <ul class="res"  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="10" infinite-scroll-immediate-check="true" >
    <li v-for="(item,i) in rank_show" :key="i" > 
        <div class="num"><i>{{i+1}}</i></div> <div class="info"><p>{{item.name}}</p><span>{{item.ar[0].name}}</span></div>
        <mt-button class="play" @click="playthis(item.id)" >▶</mt-button>
        </li>
   
 </ul>
  </mt-tab-container-item>
  <mt-tab-container-item id="t3">
    <mt-cell v-for="(item,i) in kind_list" :key="i" :title="item.name"
    @click.native="goSearch(item.name)"
    ></mt-cell>
  </mt-tab-container-item>
</mt-tab-container>
 </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import infinite from "../subcomponents/infinite"
  import {Toast} from "mint-ui";
  export default{
    data(){
      return {
        kind_list:[],
        active:"t1",
        rank:[],
        rank_show:[],
        loading:true,
        kw:""
      }
    },
    components:{
       'infinite-box':infinite   //注册子组件
     },
    methods:{
      goup(mid){
        this.$emit("playThis", mid);
    },
       playthis(mid){
      this.mid=mid;
    
        this.$emit("playThis", this.mid);
      },
      goSearch(kw){
        this.kw=kw;
        this.$router.push(`/search/${this.kw}`);
      }
      ,
    loadMore() {
      /* 加载更多 */
      this.loading = true;
      Toast({
        message: "加载中...",
        position: "bottom",
        duration: 1000,
        className:'toast'
      });
      setTimeout(() => {
        var last = this.rank_show ? this.rank_show.length : 1;
        if (last == this.rank.length) {
          this.loading = true;
          Toast({message: "已经到底啦·",
        duration: 2000,
        className:"toast"});
          return;
        }
        this.rank_show = this.rank_show.concat(this.rank.slice(last , last + 10));
       

        this.loading = false;
        console.log("执行");
      }, 1000);
    },
    },
    watch:{
      active: {
      /* 监听父组件传来的res */
      immediate: true,
      handler: function() {
        switch(this.active)
        {
   case "t1":
   this.loading=true;
    setTimeout(() => {
     
   this.$refs.bor.style.left="0"
    }, 100); 
  break;
   case "t2":
  setTimeout(() => {
      this.loading=false;
   this.$refs.bor.style.left="33.3%"
    }, 100); 
  break;
   case "t3":
   this.loading=true;
  setTimeout(() => {
     
   this.$refs.bor.style.left="66.6%"
    }, 100); 
   break;
    default:
  break;
   }
      }
    }
    },
    created(){
      var url1=`top/list?idx=1`;
      this.$http.get(url1).then(result => {
        this.rank = result.body.playlist.tracks.slice(0,100);
        
        this.rank_show=this.rank.slice(0,10);
        this.loading=false;
      });
        var url2=`playlist/catlist`;
      this.$http.get(url2).then(result => {
        this.kind_list = result.body.sub.slice(0,50);
       
       
      });
    }
  }
</script>
<style scoped lang="scss">
$bgc: black;
$topc: rgba(32, 179, 125, 1);
$l20: 20%;
$l100: 100%;
$l50: 50%;
.yueku{
  -webkit-overflow-scrolling: touch;
}
.nav {
  display: flex;
  justify-content: space-between;
  margin: 1rem auto 0;
  width: $l100;
  position: relative;
  .btns {
    width: 33.3%;
    height: 3rem;
    color: $topc;
    font-size: 1.5rem;
    border: none;
    &:active{
      background-color: #f5f5f5;
    }
  }
  .bor {
    width: 33.3%;
    height: 3rem;
    position: absolute;
    border-bottom: 2px solid $topc;
    bottom: 0;
    left: 0;
    transition: all .3s;
  }
}
.res {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0;
  flex-direction: column;
  align-items: center;
  .num{
    width: 2rem;
    height: 2rem;
    background-color: gold;
    border: none;
    border-radius: 50%;
    line-height: 2rem;
    color: #f5f5f5;
    font-weight: 400

  }
  li {
    position: relative;
    display: flex;
    width: 100%;
    height: 6rem;
    border-bottom: 2px solid $topc;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .info {
      width: 80%;
      height: 80%;
      position: relative;
      margin-left: -0.8rem;

      p {
        font-size: 1.4rem;
        color: $topc;
        text-align: left;
      }
      span {
        font-size: 1rem;
        color: #667;
        text-align: left;
        position: absolute;
        bottom: 0rem;
        left: 0rem;
      }
    }
    .play {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: $topc;
      color: white;
      position: absolute;
      top: 50%;
      right: 1rem;
      margin-top: -1.25rem;
    }
  }
}
</style>