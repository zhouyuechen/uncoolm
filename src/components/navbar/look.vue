<template>
 <div class="look">
 <h3>MV精选 ></h3>
 <!-- mv播放区 -->
 <div @touchmove="handleTouchmove" class="warp" style="overflow-y:scroll"><mt-popup v-model="popupVisible" lockScroll=true position="right" class="mint-popup-3" :modal="false">
   <div class="back">
     <mt-button @click.native="back" size="large" type="primary">返回</mt-button>{{mvDetails.name}}</div>
      
   <div v-if="mvDetails.brs" class="video"> <video class="video_self" :src="mvDetails.brs[240]" ref="video"  controls  :poster="mvDetails.cover" ></video>
   <div class="info1"><p>{{mvDetails.artists[0].name}}</p><p>播放次数：{{mvDetails.playCount}}</p></div>
     <!-- 其他mv -->
     <p>相似mv</p>
    <ul class="more" v-if="more[1]"
      >
      
      <li v-for="(it,i) in more" :key="i">
        <img v-lazy="it.cover" alt="加载失败">
        <p>{{it.name}}</p>
        <p>播放次数:{{it.playCount}}</p>
        </li></ul>
      
   <div class="info1"><p><span>评论区</span></p><p>发布时间：{{mvDetails.publishTime}}</p></div>
  
     
    
   <!-- 评论部分 -->
    <ul class="comment" v-if="comments[1]" >
     <li v-for="(item,i) in comments"  :key="i">
        <div class="com1"><img :src="item.user.avatarUrl" alt="加载失败"> <span>{{item.user.nickname}}</span></div>
      <p>{{item.content}}</p>
     </li>
    </ul>
   </div>
    
    </mt-popup></div>
    <!-- 显示推荐的MV -->
  <ul class="res"  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="30" infinite-scroll-immediate-check="true" >
    <li v-for="(item,i) in data" :key="i" class="mvs"  > 
        <div class="mv_de" ref="mvs">
          <img v-lazy="item.cover" alt="加载失败" @click="playVideo(item.id)"  >
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
        loading:true,
        popupVisible:false,
        mvDetails:{},
        comments:[],
        more:[]
      }
    },
    methods:{
      back(){
        this.popupVisible=false;
        if(this.$refs.video.paused!=true)
        {this.$refs.video.pause();}
      },
      handleTouchmove(e){e.preventDefault()},
      playVideo(mvid){
        this.$emit("stop", 66);
         var url = `mv?mvid=${mvid}`;
      this.$http.get(url).then(result => {
        this.popupVisible=true;
        this.mvDetails=result.body.data;
        
      });
      var url2 = `comment/mv?id=${mvid}&offset=0&limit=10`;
      this.$http.get(url2).then(result => {
        
        this.comments=result.body.comments;
        
      });

       var url3 = `simi/mv?mvid=${mvid}`;
      this.$http.get(url3).then(result => {
        
        this.more=result.body.mvs.slice(0,4);
        
      });

      },
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
   .back{
     height: 3rem;
     color: $topc;
     line-height: 3rem;

   }
   .warp{
     overflow-y:scroll;
     width:$l100 ;
     height: 100%;
     
   }
   
   .video{
     margin-top:1rem; 
     &>p{
       text-align: left;
       padding-left: 1rem;
       color:$topc;
       font-size: 1.3rem
     }
     .video_self{
       width: $l100
     }
     .more{
        display: flex;
       flex-flow: row wrap;
        justify-content: space-around;
        margin: 0;
        padding: 0;
        li{
          img{border-radius: 20px;
        overflow: hidden;
            width: 100%
          }
          p{
            text-align: left;
            padding-left: .3rem
          }
          list-style: none;
          width: 45%;

        }
     }
     .comment{
       display: flex;
       flex-direction: column;
        border-top: 2px solid $topc;
        margin: 0;
        padding: 0;
        li{ display: flex;
       flex-direction: column;
          list-style: none;
          border-bottom: 1px solid #666;
          position: relative;
          color: white;
          p{
            text-align: left;
            text-indent: 1rem;
          }
          div.com1{
            height: 2rem;
            margin: 5px 0;
            img{
            position: absolute;
            width: 2rem;
            border-radius: 50%;
            top: .4rem;
            left: 1rem;
          }
          span{
            display: block;
            margin-left: 4rem;
            max-width: 40%;
            font-size: .8rem;
            line-height:2rem;
          }}
        }
     }
     .info1{
       display: flex;
       align-items: center;
       justify-content: space-between;
       height: 4rem;
       position: relative;
       p{
         line-height: 4rem;
         color: $topc;
         margin-right: 1rem;
       }
       p:nth-of-type(1){
         margin-left: 1rem;
         font-size: 1.5rem;
         font-weight: 600;
         span{
           font-size: 1.2rem;
           position: absolute;
           bottom: -1rem;
           left: 1rem;
           display: block
         }
       }
     }
   }
   .popupContent{

   
    overflow-y: auto;
}
   .mint-popup-3 {
        width: 100%;
        height: 100%;
        overflow-y:scroll;
        background-color: #fff;
        background-color: rgba($color: #000000, $alpha: 1)
      }

      .mint-popup-3 .mint-button {
        position: absolute;
        width: 20%;
        top: 0%;
        left: 0%;
        background-color: black;
        color: $topc;
      }
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