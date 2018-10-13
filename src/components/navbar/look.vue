<template>
 <div class="look">
 <h3>MV精选 ></h3>
  <ul class="res"  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="30" infinite-scroll-immediate-check="true" >
    <li v-for="(item,i) in data" :key="i" class="mvs"  > 
        <div class="mv_de" ref="mvs">
          <img v-lazy="item.cover" alt="加载失败">
          <div class="playcount">▶:{{item.playCount}}</div>
          <div class="intr">
            <p class="name">{{item.name}}</p>
            <p>{{item.artistName}}</p>
          </div>
        </div>
        <p>{{item.briefDesc}}</p>
        </li>
   
 </ul>
 </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  export default{
    data(){
      return {
        data:[],
        res:[],
        loading:true
      }
    },
    methods:{
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
        var last = this.data ? this.data.length : 1;
        if (last == this.res.length) {
          this.loading = true;
          Toast({message: "已经到底啦·",
        duration: 2000,
        className:"toast"});
          return;
        }
        this.data = this.data.concat(this.res.slice(last , last + 5));
        console.log(this.data);
       
      
       
   
        this.loading = false;
        console.log("执行");
      }, 1000);
    },
    },
    created(){
       var url = `mv/first?limit=20`;
      this.$http.get(url).then(result => {
        this.res = result.body.data;
        this.data=this.res.slice(0,5);
        console.log(this.res);
         console.log(this.data);
         setTimeout(() => {
      var h =Math.floor(window.innerWidth*0.56);
        for(var i=0;i<this.data.length;i++)
       {
         this.$refs.mvs[i].style.height=h+"px";
         }
    }, 100);
        this.loading = false;
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
 .look{
   h3{
     border-bottom: 1px solid  $topc;
     margin: 1rem auto;
     padding-bottom: 0.3rem;
     text-align: left;
     padding-left: 5%
   }
   &>ul{
     padding: 0;
     width: 100%
   }
   .mvs{
     width: $l100;
    border-radius: 30px;
     list-style: none;
     margin: 0.5rem auto;
     overflow: hidden;
     .mv_de{
       width: 100%;
       height: 12rem;
       position: relative;
       margin: 0rem auto;
       overflow: hidden;
       img{
         width: $l100;
       }
       .playcount{
         position: absolute;
         max-width: 40%;
         height: 1rem;
         line-height: 1rem;
         color: white;
         bottom: 1rem;
         left: .5rem;
       }
       .intr{position: absolute;
         height: 2.5rem;
         max-width: 100%;
         bottom: 2px;
         right: 2px;
         p{
           margin: 0;
            color: white;
             font-size: .8rem;
             text-align: right;
             padding-right: .4rem;

         }
         p.name{
          font-size: 1.1rem;
          font-weight: 600;
          margin-top:-10px;
          overflow: hidden;
         }

       }
     }
    &>p{
      width: 100%;
       height: 2rem;
       line-height: 2rem;
       margin: 0rem auto;
       background-color: rgba($color: #000000, $alpha: 0.9)
    }
   }
 }
  
</style>