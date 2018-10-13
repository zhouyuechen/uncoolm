<template>
 <div class="gedan">
 <h2>热门歌单▼</h2>
 <hr>
 <ul class="song_list"  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="30" infinite-scroll-immediate-check="true">
   <li v-for="(item,i) in song_listshow" :key="i">
     <img  v-lazy="item.coverImgUrl" alt="加载失败">
     <div><p>{{item.name}}</p></div>
     <div class="creator">☺ {{item.creator.nickname}}</div>
     <div class="playC">♫ {{item.playCount|ww}}W</div>
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
        song_listshow:[],
        song_list:[],
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
        var last = this.song_listshow ? this.song_listshow.length : 1;
        if (last == this.song_list.length) {
          this.loading = true;
          Toast({message: "已经到底啦·",
        duration: 2000,
        className:"toast"});
          return;
        }
        this.song_listshow = this.song_listshow.concat(this.song_list.slice(last , last + 6));
        console.log(this.song_listshow);

        this.loading = false;
        console.log("执行");
      }, 1000);
    },
    },
    created(){
       var url=`top/playlist/highquality?limit=30`;
       this.$http.get(url).then(result => {
        this.song_list = result.body.playlists;
        this.song_listshow=this.song_list.slice(0,6);
        this.loading=false;
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
 .gedan{
   h2{
     color: $topc;
     margin: 1rem 0;
   }
   .song_list{
    display: flex;
    flex-flow: row wrap; 
    align-content:flex-start;
    padding: 0;
    justify-content: space-around;
    li{list-style: none;
      width: 45%;
      margin: 0.8rem 2%;
     position: relative;
      overflow: hidden;
      img{ border-radius: 10px;
        width: $l100;
      }
      img[lazy=loading] {
  width: 180px;
  height: 180px;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.6);
}
      .creator{
        width: $l100;
        height: 1.3rem;
        line-height: 1.3rem;
        color: white;
        position: absolute;
        bottom: 2.8rem;
        left: 0rem;
        padding-left: .5rem;
        text-align: left;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
      }
      .playC{
        max-width: 60%;
        height: 1.3rem;
        line-height: 1.3rem;
        font-weight: 700;
        color: white;
        position: absolute;
        top: .3rem;
        right: 0rem;
        padding-right: .5rem;
        text-align: right;
       background-color: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
      }
      div{
        width: $l100;
        overflow: hidden;
        p{
          width: $l100;
          height: 2.5rem;
          font-size: 1rem;
          color: #666;
          margin: 0;
        }
      }
    }
  }

 }
  
</style>