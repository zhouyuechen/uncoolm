<template>
 <div id="app">
  <!-- 顶部 -->
  <mt-header title="不酷猫音乐" class="bg">
   <mt-button icon="more" slot="right" @click="show()"></mt-button>
  </mt-header>
  <!-- 导航 -->
  <mt-navbar class="bg" v-model="selected">
   <mt-tab-item class="tabss" id="my">我</mt-tab-item>
   <mt-tab-item class="tabss" id="listen">听</mt-tab-item>
   <mt-tab-item class="tabss" id="look">看</mt-tab-item>
   <mt-tab-item class="tabss" id="sing">唱</mt-tab-item>
  </mt-navbar>
  <!-- 搜索按钮 -->
  <div :class="search">
   <input
    type="search"
    class="sea_a"
    @focus="showSearch"
    @touchend="showSearch"
    :placeholder="zhanwei"
    v-model="search_value"
   >
   <button @touchend="letsSearch">🔍</button>
  </div>
  <!-- 组件显示区 -->
  <router-view
   v-on:jump="changeS"
   v-on:search_val="change_search_val"
   v-on:playThis="getsong2"
   v-on:stop="playmusic"
   :res="search_res"
   style="margin-bottom:4rem"
  />
  <!-- 返回顶部按钮 -->
  <button :class="back_btn" @touchstart="backTop">TOP</button>
  <!-- 底部播放器 -->
  <div class="play_box">
   <div class="play_pic" @touchend="showSong">
    <img :src="picurl" alt="加载失败">
   </div>
   <audio ref="player" id="au1" :src="musicurl" autoplay auto></audio>
   <div class="pro">
    <mt-progress class="pros" :bar-height="4" :value="prec">
     <div slot="start" v-if="timeNow">{{this.timeNow|time}}</div>
     <div slot="end" v-if="timeDuration">{{this.timeDuration|time}}</div>
    </mt-progress>
   </div>
   <div class="control">
    <div class="text" v-if="songname">
     <span>{{this.songname}}</span>
     <span>{{this.arname}}</span>
    </div>
    <button :class="play_img" @touchend="playmusic1"></button>
    <button class="btn" @touchend="nextmusic()"></button>
   </div>
  </div>
  <!-- 播放详情页面 -->
  <div @touchmove="handleTouchmove" class="warp" style="overflow-y:scroll">
   <mt-popup
    v-model="popupVisible"
    lockScroll="true"
    position="bottom"
    class="mint-popup"
    :modal="false"
   >
    <div class="back">
     <mt-button @touchend.native="back" size="large" type="primary">返回</mt-button>
     <p v-text="songname"></p>
    </div>
    <p v-if="lrc" v-text="arname"></p>
    <img :src="picurl" alt="加载失败" class="re">
    <div v-if="lrc" class="c">
     <div class="tc font30 mb15">{{g}}</div>
    </div>
    <audio class="songD" id="player" ref="player2" :src="musicurl" auto controls></audio>

    <div></div>
   </mt-popup>
  </div>
 </div>
</template>

<script>
import { Navbar, TabItem, Toast } from "mint-ui";
import listen from "./components/navbar/listen";
import search from "./components/search";
/* import func from './vue-temp/vue-editor-bridge'; */
export default {
 name: "App",
 data() {
  return {
   play_img: "btn bg_s",
   selected: "listen",
   prec: 0,
   song: {},
   songname: "",
   arname: "",
   picurl: "",
   musicurl: "",
   mid: 0,
   prec: 0,
   timeNow: 0,
   timeDuration: 0,
   mouseX: 0,
   nowX: 0,
   search: "search",
   zhanwei: "搜索",
   search_value: "",
   search_res: [],
   back_btn: "backtop",
   popupVisible: false,
   /* 播放详情页数据 */
   g: "歌词加载中...",
   gd: {
    up: null,
    down: null
   },
   p: null,
   p1: null,
   lrc: "",
   lrcObj: null,
   height: "auto"
  };
 },
 methods: {
  jx() {
   /* 解析歌词的函数 */
   var lyrics = this.lrc.split("\n");
   var lrcObj = {};
   for (var i = 0; i < lyrics.length; i++) {
    var lyric = decodeURIComponent(lyrics[i]);
    var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    var timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    var clause = lyric.replace(timeReg, "");
    for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
     var t = timeRegExpArr[k];
     var min = Number(String(t.match(/\[\d*/i)).slice(1)),
      sec = Number(String(t.match(/\:\d*/i)).slice(1));
     var time = min * 60 + sec;
     lrcObj[time] = clause;
    }
   }
   return lrcObj;
  },
  showSong() {
   this.popupVisible = true;
   this.playmusic(66);
   this.p.currentTime = this.timeNow;
   this.p.play();
  },
  back() {
   this.popupVisible = false;
   this.playmusic();
   this.timeNow = this.p.currentTime;
   this.p1.currentTime = this.timeNow;
   this.p.pause();
  },
  handleTouchmove(e) {
   e.preventDefault();
  },
  letsSearch() {
   if (this.search_value === "") {
    this.showSearch();
    return;
   } else {
    var url = `search?keywords=${this.search_value}`;
    this.$http.get(url).then(result => {
     this.search_res = result.body.result.songs;
     this.showSearch();
     console.log(this.search_res);
    });
   }
  },
  showSearch() {
   this.$router.push(`/search/搜索`);
   this.changeS();
  },
  show() {
   Toast({
    message: "这里是不酷猫，更多精彩"
    /* iconClass: 'icon icon-success' */
   });
  },
  goto(path) {
   this.$router.push(`/${path}`);
  },
  addEventListeners: function() {
   const self = this;

   self.p1.addEventListener("timeupdate", self._currentTime);
   self.p1.addEventListener("canplay", self._durationTime);
  },
  removeEventListeners: function() {
   const self = this;
   self.p1.removeEventListener("timeupdate", self._currentTime);
   self.p1.removeEventListener("canplay", self._durationTime);
  },
  _currentTime: function() {
   setTimeout(() => {
    const self = this;
    self.timeNow = parseInt(self.p1.currentTime);
    self.prec = (self.timeNow / self.timeDuration) * 100;
    self.timeDuration = parseInt(self.p1.duration);
    if (self.prec >= 100) {
     this.nextmusic();
     this.p1.play();
    }
   }, 50);
  },
  _durationTime: function() {
   const self = this;
   self.timeDuration = parseInt(self.p1.duration);
  },

  playmusic1() {
   if (this.$refs.player.paused) {
    this.$refs.player.play();
    this.play_img = "btn bg_s";
   } else {
    this.$refs.player.pause();
    this.play_img = "btn bg_p";
   }
  },
  playmusic(val) {
   if (val == 66) {
    if (this.$refs.player.paused) {
     return;
    } else {
     this.$refs.player.pause();
     this.play_img = "btn bg_s";
    }
   } else if (val == 77) {
    /* this.$refs.player.play(); */
    this.play_img = "btn bg_s";
   } else {
    if (this.$refs.player.paused) {
     this.$refs.player.play();
     this.play_img = "btn bg_s";
    } else {
     this.$refs.player.pause();
     this.play_img = "btn bg_p";
    }
   }
  },
  nextmusic() {
   this.mid++;
   var newmid = this.mid;
   this.getsong(newmid);
   this.playmusic(77);
  },
  changeM(e) {
   e.targetTouches[0].clientX;
  },
  change_search_val(val) {
   this.search_value = val;
   if (this.search_value !== "" && this.search_value != "搜索") {
    this.letsSearch();
   }
  },
  changeS() {
   this.selected = 0;
  },
  last() {//返回上一页
   if (location.hash == "#/listen" || location.hash == "#/") {
    return;
   } else history.go(-1);
  },
  getsong(mid = parseInt(300000 + Math.floor(Math.random() * 80000))) {//获取歌曲详情
   this.mid = mid;
   var url = `song/detail?ids=${mid}`;
   var url2 = `music/url?id=${mid}`;
   var load = Toast({
    message: "新歌加载中...",
    position: "bottom"
   });
   this.$http.get(url).then(result => {
    this.song = result.body.songs[0];
    if (result.body.songs[0] == undefined) {
     Toast("sorry,这首歌没有版权");
     this.getsong();
     return;
    }
    this.songname = this.song.name;
    this.arname = this.song.ar[0].name;
    this.picurl = this.song.al.picUrl;
    this.addEventListeners();
   });

   this.$http.get(url2).then(result => {
    this.musicurl = result.body.data[0].url;
    this.$refs.player.load();
    load.close();
    this.addEventListeners();
   });
   var url3 = `lyric?id=${this.mid}`;
   this.$http.get(url3).then(result => {
    if (result.body.nolyric) {
     this.lrc = "mei";
     this.lrcObj = { 0: "这首歌没有歌词哦O(∩_∩)O" };
     return;
    }
    this.lrc = result.body.lrc.lyric;
    this.p = document.querySelector("#player");
    let _this = this;
    this.lrcObj = this.jx();
    this.p.addEventListener("timeupdate", function() {
     let obj = _this.lrcObj[Math.floor(this.currentTime)];
     if (obj != undefined) {
      _this.g = obj;
     }
    });
    this.height = window.innerHeight + "px";
    window.onresize = () => {
     _this.height = window.innerHeight + "px";
    };
   });
   console.log(this.mid);
  },
  check(mid) {
   var url = `song/detail?ids=${this.mid}`;
   this.$http.get(url).then(result => {
    return result.success;
   });
  },
  getsong2(mid) {//歌曲详情页的获取
   this.mid = mid;
   var url = `song/detail?ids=${this.mid}`;
   var url2 = `music/url?id=${this.mid}`;
   var load = Toast({
    message: "新歌加载中...",
    position: "bottom"
   });
   this.$http.get(url).then(result => {
    this.song = result.body.songs[0];
    if (result.body.songs[0] == undefined) {
     Toast("sorry,这歌没有版权");
     this.getsong();
     return;
    }
    this.songname = this.song.name;
    this.arname = this.song.ar[0].name;

    this.addEventListeners();
    this.picurl = this.song.al.picUrl;
   });

   this.$http.get(url2).then(result => {
    this.musicurl = result.body.data[0].url;

    this.p1.load();

    /* setTimeout(()=>{this.playmusic();},300); */
    this.addEventListeners();

    this.playmusic(77);
    load.close();
   });
   var url3 = `lyric?id=${this.mid}`;
   this.$http.get(url3).then(result => {
    if (result.body.nolyric) {
     this.lrc = "mei";
     this.lrcObj = { 0: "这首歌没有歌词哦O(∩_∩)O" };
     return;
    }
    this.lrc = result.body.lrc.lyric;
    this.p = document.querySelector("#player");
    let _this = this;
    this.lrcObj = this.jx();
    this.p.addEventListener("timeupdate", function() {
     let obj = _this.lrcObj[Math.floor(this.currentTime)];
     if (obj != undefined) {
      _this.g = obj;
     }
    });
    this.height = window.innerHeight + "px";
    window.onresize = () => {
     _this.height = window.innerHeight + "px";
    };
   });
   console.log(this.mid);
  },
  backTop(e) {
   var touch = e.touches[0];
   console.log(Number(touch.pageX), Number(touch.pageY));
   var timer = setInterval(function() {
    this.isTop = false;
    //获取滚动条的滚动高度
    var scrollTop =
     document.documentElement.scrollTop || document.body.scrollTop;

    //用于设置速度差，产生缓动的效果
    var speed = Math.floor(-scrollTop / 3);
    document.documentElement.scrollTop = document.body.scrollTop =
     scrollTop + speed;
    this.isTop = true; //用于阻止滚动事件清除定时器

    if (scrollTop == 0) {
     clearInterval(timer);
    }
   }, 50);
  }
 },
 components: {
  listen,
  search
 },

 watch: {
  selected() {
   if (this.selected == 0) {
    var bb = document.querySelector(".mint-navbar .mint-tab-item.is-selected");
    console.log(bb);
    return;
   }
   this.$router.push(`/${this.selected}`);
  },
  isPlay() {}
 },
 mounted() {
  this.getsong();
  HTMLAudioElement.prototype._play = HTMLAudioElement.prototype.play;
  HTMLAudioElement.prototype._load = HTMLAudioElement.prototype.load;
  HTMLAudioElement.prototype.play = function() {
   // 禁止load操作
   this._lockLoad = true;
   this._play();
  };
  HTMLAudioElement.prototype.load = function() {
   this._lockLoad || this._load();
  };
  this.p1 = document.getElementById("au1");
 },
 beforeDestroyed() {
  this.removeEventListeners();
 }
};
</script>

<style lang="scss">
$bgc: black;
$topc: rgba(32, 179, 125, 1);
$l20: 20%;
$l100: 100%;
$l50: 50%;
#app {
 -webkit-overflow-scrolling: touch;
 font-family: "Avenir", Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;
 .backtop {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  border: none;
  outline: none;
  line-height: 3rem;
  position: fixed;
  right: 1rem;
  bottom: 6rem;
  text-align: center;
  background-color: black;
  font-size: 1rem;
  padding: 0;
  color: white;
  font-weight: 800;
 }
 /* 播放详情样式 */
 @keyframes rotate360 {
  from {
   transform: rotate(0deg);
  }
  to {
   transform: rotate(360deg);
  }
 }
 .mint-popup {
  width: $l100;
  height: $l100;
  background-color: black;

  img.re {
   width: 60%;
   border-radius: 50%;
   display: block;
   margin: 1rem auto;
   border: 0.5rem solid rgba($color: #666, $alpha: 0.7);
   animation: rotate360 30s linear infinite;
  }
  .c {
   color: $topc;
   font-size: 1.3rem;
   margin: 2rem auto;
   display: block;
  }
  .songD {
   width: 100%;
   position: fixed;
   bottom: 0rem;
   left: 0;
   border-bottom: 0.4rem solid $topc;
  }
  .back {
   position: relative;
   display: flex;
   width: $l100;
   height: 3rem;
   background-color: black;
   color: $topc;
   align-items: center;
   justify-content: space-around;
   p {
    white-space: nowrap;
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
   }
   .mint-button {
    width: 3rem;
    position: absolute;
    left: 1rem;

    padding: 0;
    height: 3rem;
    color: $topc;
    background-color: transparent;
   }
   p,
   & + p {
    line-height: 3rem;
    font-size: 1.5rem;
    font-weight: 500;
    color: $topc;
    margin: 0;
   }
   & + p {
    font-size: 1rem;
    line-height: 2rem;

    background-color: black;
   }
  }
 }
}
.bg {
 background-color: $bgc !important;
 color: $topc !important;
 font-family: "Avenir", Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 font-size: 1.3rem !important;
 font-weight: 500 !important;
}
.tabss {
 color: white !important;
 border-color: $topc !important;
 font-size: 1.1rem !important;
}
.tabss.is-selected {
 color: white !important;
 border-color: $topc !important;
 .mint-tab-item-label {
  font-size: 1.3rem !important;
  color: $topc !important;
 }
 font-size: 1.1rem !important;
}

.play_box {
 width: 100%;
 position: fixed;
 left: 0;
 bottom: 0;
 height: 4rem;
 background-color: $bgc;
 .pro {
  width: 70%;
  position: absolute;
  top: 10px;
  right: 5%;
  height: 5px;
  .pros {
   width: $l100;
   height: $l100;
   .mt-progress-progress {
    background-color: $topc !important;
   }
   div {
    color: white;
    font-size: 8px;
    line-height: 5px;
    margin: 0 3px;
   }
  }
 }
}
.play_pic {
 width: 80px;
 height: 80px;
 border-radius: $l50;
 position: absolute;
 left: 3%;
 top: -50%;
 background-color: $bgc;
 border: 2px solid black;
 overflow: hidden;
 img {
  width: 100%;
 }
}
.control {
 display: flex;
 justify-content: space-around;
 align-items: center;
 width: 70%;
 position: absolute;
 top: 20px;
 right: 5%;
 height: 60%;
 .text {
  width: 60%;
  height: 90%;
  color: white;
  position: absolute;
  top: 5%;
  left: 5%;
  span {
   display: inline-block;
   width: 60%;
   line-height: 30px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
  }
  span:nth-of-type(2) {
   font-size: 0.6rem;
   width: 35%;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
  }
 }
 .btn {
  display: block;
  width: 2rem;
  height: 2rem;
  background: black no-repeat;
  background-size: cover;
  background-position: center center;
  border: none;
  position: absolute;
  top: 5%;
  right: 5%;
  background-image: url("assets/next.png");
 }
 .btn.bg_s {
  right: 22%;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABeCAYAAACq0qNuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjYzRjgzOTNDQkQ4MTFFODhENTE5Q0M0QzI4NkZGNUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjYzRjgzOTRDQkQ4MTFFODhENTE5Q0M0QzI4NkZGNUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNjNGODM5MUNCRDgxMUU4OEQ1MTlDQzRDMjg2RkY1RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNjNGODM5MkNCRDgxMUU4OEQ1MTlDQzRDMjg2RkY1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl/OESoAAAHxSURBVHja7N27SgNBFIDhmdmsrpdoLETRysLCJnipFETt8ww+QMRCe43oAwj6JiJYesNSYmdhkVioWCkJkiXZ7DGKdgpmwoY1/H+TwHIY8s1k29Eioqj9aeCBB57+OfzE8bbaGVtO/vQslND5bW736eJ1IzU3tf96fVvI7FqtmxtZHBWj/WbmTKi8t5qfzC5k7qKGT0S9wM7jWclmroGu1pPTs42v+WZn1/rS83v3p1ehl9DNzho/kKzKmKhdIl1ga3ypp5X5w/JN3mZuuD9VsEH/+iu25d1rVIyz3Tg/qHrW795OgN97OK+0Mu+ItnoVamOCuB/FWJ/4Tg544IEn4IEn4IEn4IEn4IEn4IEHHgLggSfggSfggSfggSfggSfggQeegAeegAeegAeegAeegAeegAceeAIeeAIeeAIeeAIeeAIeeAIeeOAJeOAJeOAJeOAJeOAJeOAJeOCBJ+CBJ+CBJ+CBJ+CBJ+CBJ+CBBz6mDbie1X2wruP41otKB8C3enX0S1BxbebKfmXYelHdAfBDbm+tlfmEMlY3GNfDuqergcT5xEd6S/1m8SSYfJZLrfXHQQoan+H3DxMlv256XaS7yzjlnDotr86sNL3uQSmfT5e8o2o9SH6u+dcNE3FT7mCxHfBapE1bTMDHoXcBBgCzhYMOr3tY2AAAAABJRU5ErkJggg==");
 }
 .btn.bg_p {
  right: 22%;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABeCAYAAACq0qNuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUMxQTBFRDJDQkQ4MTFFODkzNjBERkM4MDM0NERFNTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUMxQTBFRDNDQkQ4MTFFODkzNjBERkM4MDM0NERFNTIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQzFBMEVEMENCRDgxMUU4OTM2MERGQzgwMzQ0REU1MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQzFBMEVEMUNCRDgxMUU4OTM2MERGQzgwMzQ0REU1MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhOxM5gAAAYISURBVHja7J1bbBRV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");
 }
}
.mt-range-progress {
 background-color: white;
}
.mt-progress-progress {
 background-color: $topc;
}
.nolook {
 display: none;
}
.search {
 width: $l100;
 height: 3rem;
 background: $bgc;
 border-top: 1px solid black;
 position: relative;
 .sea_a {
  width: 90%;
  display: block;
  text-align: center;
  background: $topc;
  color: white;
  margin: auto;
  margin-top: 10px;
  border-radius: 30px;
  opacity: 0.8;
  height: 50%;
  line-height: 24px;
 }
 button {
  position: absolute;
  height: 50%;
  width: 1.5rem;
  border-radius: 20%;
  background: transparent;
  border: none;
  margin-top: 10px;
  right: 10%;
  top: 0;
  padding: 0;
 }
}
</style>
