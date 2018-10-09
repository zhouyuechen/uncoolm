<template>
  <div id="app">
    <!-- 顶部 -->
   <mt-header title="不酷猫音乐" class="bg" >
  <router-link to="/" slot="left">
    <mt-button icon="back">back</mt-button>
  </router-link>
  <mt-button icon="more" slot="right" @click="show()" ></mt-button>
</mt-header>
<!-- 导航 -->
<mt-navbar class="bg" v-model="selected">
      <mt-tab-item id="my">我</mt-tab-item>
      <mt-tab-item id="listen">听</mt-tab-item>
      <mt-tab-item id="look">看</mt-tab-item>
       <mt-tab-item id="sing">唱</mt-tab-item>
    </mt-navbar>
    <router-view/>
<!-- 播放器 -->
    <div class="play_box">
      <div class="play_pic"></div>
      <audio :src="musicurl" autoplay ></audio>
      <div  class="pro"  >
      <mt-progress  class="pros" :bar-height="4" :value="40">
        <div slot="start">0%</div>
        <div slot="end">100%</div>
      </mt-progress>
    </div>
    <div class="control">
      <div class="text">
        <span >{{this.songname}}</span> <span>{{this.arname}}</span>
      </div>
      <mt-button class="btn" slot="right"  ><img src="./assets/play.png" height="32" width="32" slot="icon"></mt-button>
      <mt-button class="btn" slot="right"  ><img src="./assets/next.png" height="32" width="32" slot="icon"></mt-button>
    </div>
       
    </div>
  </div>
</template>

<script>
import { Navbar, TabItem,Toast } from "mint-ui";

export default {
  name: "App",
  methods: {
    show() {
      Toast({
        message: "这里是不酷猫，更多精彩"
        /* iconClass: 'icon icon-success' */
      });
    },
    goto(path) {
      this.$router.push(`/${path}`);
    },
    getsong(mid=parseInt(300000+Math.floor(Math.random()*80000))){
      

      this.mid=mid;
      var url = `song/detail?ids=${mid}`;
      var url2=`music/url?id=${mid}`;
       this.$http.get(url).then(result=>{

         this.song=result.body.songs[0];
         this.songname= this.song.name;
         this.arname=this.song.ar[0].name;
         console.log(this.song);
        
       });

       this.$http.get(url2).then(result=>{
          console.log(result.body.data);
              this.musicurl=result.body.data[0].url;

         });
         console.log(this.mid);
    
    },
   
  },
  data() {
    return {
      selected: "listen",
      music:"#",
      val:0.5,
      song:{},
      songname:"",
      arname:"",
      picurl:"",
      musicurl:"",
      mid:0
    };
  },
  watch: {
    selected() {
      this.$router.push(`/${this.selected}`);
    }
  },
  created(){
    this.getsong();
  }
};
</script>

<style lang="scss">
$bgc: black;
$topc: rgba(32, 179, 125, 1);
$l20:20%;
$l100:100%;
$l50:50%;
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.bg {
  background-color: $bgc;
  color: $topc;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1.3rem;
  font-weight: 500;
}
.mint-navbar a,
.mint-navbar .mint-tab-item-label {
  color: white;

  font-size: 1.1rem;
}

.mint-navbar .mint-tab-item.is-selected  {
  border-color: $topc;

  .mint-tab-item-label{
    font-size: 1.3rem;color: $topc;
  }
}
.play_box{
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 8%;
  background-color: $bgc;
  .pro{
    width: 70%;
    position:absolute;
    top: 10px;
    right: 5%;
    height: 5px;
    .pros{
      width: $l100;
      height: $l100;
      div{
        color: white;
        font-size: 5px;
        line-height: 5px
      }
    }
  }
}
.play_pic{
  width: 80px;
  height: 80px;
  border-radius: $l50;
  position: absolute;
  left: 3%;
  top: -50%;
  background-color: $topc;
  border: 2px solid black;
}
.control{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 70%;
    position:absolute;
    top: 20px;
    right: 5%;
    height: 60%;
    .text{
      width: 60%;
  height: 90%;
  color: white;
  span{display: inline-block;
  max-width: 60%;
    line-height: 30px
  }
  span:nth-of-type(2){
    font-size: 0.6rem;
    max-width: 40%;
  }
 
    }
    .mint-button{
      width: 2rem;
      height: 2rem;
      background-color: transparent;
      border: none;
    }
    .btn img{
      margin-left: -0.8rem;

    }
}
.mt-range-progress {
  background-color: white
}
.mt-progress-progress {
  background-color: $topc;
}

</style>
