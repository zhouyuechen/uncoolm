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
      <button @touchend="letsSearch"></button>
    </div>
    <!-- 组件显示区 -->
    <router-view v-on:jump="changeS"
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
      <audio ref="player" id="au1" :src="musicurl" autoplay></audio>
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
        <div class="back"><!--  -->
          <mt-button @touchend.native="back" size="large" type="primary">返回</mt-button>
          <p  v-text="songname"></p>
          <div @click="likeThis()">收藏</div>
          <span v-bind:class="{ show: showToast}"  class="toast" v-text="toastTxt">
          </span>
        </div>
        <p v-if="lrc" v-text="arname"></p>
        <img :src="picurl" alt="加载失败" class="re">
        <p v-if="!lrc">歌词加载中或缺少歌词</p>
        <div v-if="lrc" class="lrcBox" id="lrcBox">
          <div id="lrcMove">
            <p v-for="(item,i) in lrcObj" :key="i" class="" :data-sentenceId="i">
              {{item}}
            </p>
          </div>
        </div>
        <audio class="songD" id="player" ref="player2" :src="musicurl" auto controls></audio>

        <div></div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import {Navbar, TabItem, Toast} from "mint-ui";
  import listen from "./components/navbar/listen";
  import search from "./components/search";
  import  {mapGetters,mapActions} from  'vuex'
  import axios from 'axios'
  const instance = axios.create({
    baseURL: 'http://120.79.240.144:3000',
    // baseURL: 'http://127.0.0.1:3000',
    timeout: 5000,
    withCredentials: true,
  });
  export default {
    name: "App",
    data() {
      return {
        showToast:true,
        toastTxt:"",
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
        height: "auto",
        list: [],
        timeset: 0
      };
    },

    methods: {
      ...mapActions('user', ['getAddFav']),

      async likeThis(){

        if(!this.check){
          this.toastTxt="先登录才能收藏";
          this.showToast=false;
          setTimeout(()=>{
            this.showToast=true;
          },3000)
        }else if(this.fav.indexOf(this.mid)!==-1){
          this.toastTxt="您已收藏过该歌曲";
          this.showToast=false;
          setTimeout(()=>{
            this.showToast=true;
          },3000)
        }else {
          const res = await instance.get(`like?id=${this.mid}`);
          console.log(res)
          if(res.status===200){
            this.getAddFav({
              mid:this.mid
            })
            this.toastTxt="收藏成功";
            this.showToast=false;
            setTimeout(()=>{
              this.showToast=true;
            },3000)
          }
        }


      },
      jx() {/* 解析歌词的函数 ，将lrc歌词解析成一个对象，键为时间，值为对应歌词*/
        let lyrics = this.lrc.split("\n");
        let lrcObj = {};
        for (var i = 0; i < lyrics.length; i++) {
          var lyric = decodeURIComponent(lyrics[i]);
          var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
          var timeRegExpArr = lyric.match(timeReg);
          if (!timeRegExpArr) continue;
          var clause = lyric.replace(timeReg, "");
          for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
              sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            if (clause) {
              lrcObj[time] = clause
            }
          }
        }
        return lrcObj;
      },
      showSong() {/* 点击左下角图片可以弹出播放详情页 */
        this.popupVisible = true;
        this.playmusic("openmv");
        this.p.currentTime = this.timeNow;
        this.p.play();
      },
      back() {/* 从播放详情页返回 */
        this.popupVisible = false;
        this.playmusic();
        this.timeNow = this.p.currentTime;
        this.p1.currentTime = this.timeNow;
        this.p.pause();
      },
      handleTouchmove(e) {//取消默认事件
        e.preventDefault();
      },
      letsSearch() {//根据关键词搜索
        if (this.search_value === "") {
          this.showSearch();
          return null;
        } else {
          let url = `search?keywords=${this.search_value}`;
          this.$http.get(url).then(result => {
            this.search_res = result.body.result.songs;
            this.showSearch();
          });
        }
      },
      showSearch() {/* 跳转到搜索页 */
        this.$router.push(`/search/搜索`);
        this.changeS();
      },
      show() {/* 右上角的三个点 */
        Toast({
          message: "这里是不酷猫，更多精彩敬请期待"
          /* iconClass: 'icon icon-success' */
        });
      },

      addEventListeners: function () {/* 绑定事件 */
        const self = this;
        self.p1.addEventListener("timeupdate", self._currentTime);
        self.p1.addEventListener("canplay", self._durationTime);
      },
      removeEventListeners: function () {/* 移除事件 */
        const self = this;
        self.p1.removeEventListener("timeupdate", self._currentTime);
        self.p1.removeEventListener("canplay", self._durationTime);
      },
      _currentTime: function () {/* 获取当前播放的时间 */
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
      _durationTime: function () {
        const self = this;
        self.timeDuration = parseInt(self.p1.duration);
      },
      delayclick() {//设置点击间隔时间，小于100ms无视

        return () => {
          let now = new Date();
          now = now.getTime();
          if (now - this.timeset < 100) {
            this.timeset = now;
            return
          }
          this.timeset = now;
          if (this.$refs.player.paused) {
            this.$refs.player.play();
            this.play_img = "btn bg_s";
          } else {
            this.$refs.player.pause();
            this.play_img = "btn bg_p";
          }
        }
      },
      playmusic1() {
        let play = this.delayclick();
        play();

      },
      playmusic(val) {/* 播放与暂停 */
        if (val == "openmv") {
          if (this.$refs.player.paused) {
            return;
          } else {
            this.$refs.player.pause();
            this.play_img = "btn bg_s";
          }
        } else if (val == "closemv") {
          this.$refs.player.play();
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
      nextmusic() {/* 按钮：下一首 */
        this.mid++;
        var newmid = this.mid;
        this.getsong(newmid);
        this.playmusic("closemv");
      },
      change_search_val(val) { /* 传入search的修改关键词的方法 */
        this.search_value = val;
        if (this.search_value !== "" && this.search_value != "搜索") {
          this.letsSearch();
        }
      },
      changeS() {/* 跳转到搜索页的方法 */
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
        var url2 = `song/url?id=${mid}`;
        var load = Toast({
          message: "新歌加载中...",
          position: "bottom"
        });
        this.$http.get(url).then(result => {//获取歌曲文字详情
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

        this.$http.get(url2).then(result => {//获取音频url
          this.musicurl = result.body.data[0].url;
          load.close();
          this.addEventListeners();
        });
        var url3 = `lyric?id=${this.mid}`;
        this.$http.get(url3).then(result => {//获取歌词
          if (result.body.nolyric) {//如果没有歌词
            this.lrc = "mei";
            this.lrcObj = {0: "这首歌没有歌词哦O(∩_∩)O"};
            return;
          }
          result.body.lrc ? this.lrc = result.body.lrc.lyric : "";
          this.p = document.querySelector("#player");
          let _this = this;
          this.lrcObj = this.jx();
          this.p.addEventListener("timeupdate", function () {
            //绑定歌词滚动事件
            setTimeout(() => {
              let allSentences = Array.prototype.slice.call(document.querySelectorAll("#lrcBox p"));
              let obj = _this.lrcObj[Math.floor(this.currentTime)];
              if (obj != undefined) {
                allSentences.map((item, i) => {
                  item.classList.remove("now")
                  if (item.getAttribute("data-sentenceId") == Math.floor(this.currentTime)) {
                    //console.log(item.getAttribute("data-sentenceId"),obj);
                    if (i - 4 > 0) {
                      const lrcHeight = document.getElementById("lrcMove").offsetHeight;
                      allSentences[0].style.marginTop = -31 * (i - 4) + "px";
                    }
                    item.classList.add("now");
                  }
                })
              }
            }, 100)

          });
          this.height = window.innerHeight + "px";
          window.onresize = () => {
            _this.height = window.innerHeight + "px";
          };
        });
      },

      getnewsong() {//获取推荐新歌
        var url = `personalized/newsong`;
        this.$http.get(url).then(result => {
          /* this.list=result.body.result;
          console.log(this.list[parseInt(Math.random()*10)]);
         if(this.list==undefined){
          this.getnewsong();
          return;
        } */
          this.getsong(result.body.result[parseInt(Math.random() * 10)].id);

        });

      },
      getsong2(mid) {//歌曲详情页的获取
        this.mid = mid;
        var url = `song/detail?ids=${this.mid}`;
        var url2 = `song/url?id=${this.mid}`;
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

          this.playmusic("closemv");
          load.close();
        });
        var url3 = `lyric?id=${this.mid}`;
        this.$http.get(url3).then(result => {
          if (result.body.nolyric) {
            this.lrc = "mei";
            this.lrcObj = {0: "这首歌没有歌词哦O(∩_∩)O"};
            return;
          }
          this.lrc = result.body.lrc.lyric;
          this.p = document.querySelector("#player");
          let _this = this;
          this.lrcObj = this.jx();
          this.p.addEventListener("timeupdate", function () {
            let allSentences = Array.prototype.slice.call(document.querySelectorAll("#lrcBox p"));
            let obj = _this.lrcObj[Math.floor(this.currentTime)];
            if (obj != undefined) {
              allSentences.map((item, i) => {
                if (i == obj.index) {
                  console.log(obj)
                  //item.classList.addClass("now")
                }
              })
            }
          });
          this.height = window.innerHeight + "px";
          window.onresize = () => {
            _this.height = window.innerHeight + "px";
          };
        });
      },
      backTop(e) {//点击top返回顶部
        var touch = e.touches[0];
        /*  console.log(Number(touch.pageX), Number(touch.pageY)); */
        var timer = setInterval(function () {
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
    components: {//注册子组件
      listen,
      search
    },

    watch: {
      selected() {//导航条的选中高亮，监听selected变量
        if (this.selected == 0) {
          var bb = document.querySelector(".mint-navbar .mint-tab-item.is-selected");
          //console.log(bb);
          return;
        }
        this.$router.push(`/${this.selected}`);
      },
      isPlay() {
      }
    },
    computed: {
      ...mapGetters('user', ['fav', 'check']),

    },
    mounted() {//挂载完后执行一次获取随机音乐，
      this.getnewsong();
      this.p1 = document.getElementById("au1");
    },

    beforeDestroy() {//销毁前解除绑定
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
        border: .8rem solid rgba($color: #666, $alpha: 0.5);
        animation: rotate360 30s linear infinite;
      }

      .lrcBox {
        color: $topc;
        font-size: 1.3rem;
        margin: 2rem auto;
        display: block;
        height: 250px;
        overflow: hidden;

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
          color: $topc;
          transition: all .3s;
        }

        p.now {
          font-size: 20px
        }
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
        div{
          position: absolute;
          right: 1rem;
        }
        .show{
          display: none;
        }
        p {
          white-space: nowrap;
          width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .toast{
          position: absolute;
          bottom: -5rem;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0,0,0,.7);
          border-radius: 5px;
          color: white;
          z-index: 9999999999;
          padding: .5rem;
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
      background-image: url("//img.hicdn.cn/fed/images/20181224/45e82d8b7107022c64cccce3b57155fe.png");
    }

    .btn.bg_s {
      right: 22%;
      background-image: url("//img.hicdn.cn/fed/images/20181224/4dd3b93e186a82a873e522a6809cec90.png");
    }

    .btn.bg_p {
      right: 22%;
      background-image: url("//img.hicdn.cn/fed/images/20181224/f66730b048a4fb80e4b83b9fcd169f4c.png");
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
      background: transparent;
      border: none;
      margin-top: 10px;
      right: 8%;
      top: 0;
      padding: 0;
      background-image: url("//img.hicdn.cn/fed/images/20181224/4737fcc5feb41f7ece8934738a18f1d4.jpg");
      background-size: cover;
      border-radius: 50%;
    }
  }
</style>
