<template>
  <div class="listen">
    <!-- 轮播 -->
    <mt-spinner type="snake" color="rgba(32, 179, 125, 1)" :class="sp_class" :size="80"></mt-spinner>
    <mt-swipe :auto="3000" prevent :class="sw_class" continuous ref="sw">
      <mt-swipe-item v-for="(item,i) in list" :key="i">
        <img v-lazy="item.imageUrl"/>
      </mt-swipe-item>
    </mt-swipe>
    <!-- 导航 -->
    <nav>
      <div v-for="(item,i) in navs" :key="i">
        <router-link class="nav_a" :to="item.path" @click.native="clearS">
          <img v-lazy="item.src" alt="加载失败">
          <p>{{item.title}}</p></router-link>
      </div>

    </nav>
    <p class="title">每日推荐</p>
    <hr>
    <infinite-box v-on:playThis="goup"></infinite-box>
  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  import {Swipe, SwipeItem} from "mint-ui";
  import infinite from "../subcomponents/infinite"

  export default {
    data() {
      return {
        list: [],
        sp_class: "look",
        sw_class: "nolook",
        navs: [{
          src: "//img.hicdn.cn/fed/images/20181224/08b63f580940bbd1c1e19808ea90b9fb.png",
          title: "乐库", path: "/yueku"
        },
          {
            src: "//img.hicdn.cn/fed/images/20181224/2b28e092705b9f2c53fed3af018d6337.png",
            title: "歌单", path: "/gedan"
          },
          {
            src: "//img.hicdn.cn/fed/images/20181224/8f1a570d303ddb19e1951e2fffef0a81.png",
            title: "歌手", path: "/geshou"
          },
          {
            src: "//img.hicdn.cn/fed/images/20181224/042a1c9d7da673616315042b2e74547a.png",
            title: "电台", path: "/diantai"
          }]

      };
    },
    methods: {
      goup(mid) {/* 点击播放 */
        this.$emit("playThis", mid);
      },
      getBanner() {//获取banner
        var url = `banner`;
        this.$http.get(url).then(result => {
          this.list = result.body.banners;
          this.sp_class = `nolook`;
          this.sw_class = `look2`;
        });
      },
      getback() {//适配banner的高度
        var h = Math.floor(window.innerWidth * 0.37);
        this.$refs.sw.$el.style.height = h + "px";
      },
      clearS() {/* 让导航栏归0 */
        this.$emit("jump", 0);
      }
    },
    mounted() {

      this.getBanner();
      this.getback();
      window.onresize = () => {
        this.getback();
      }

    },
    components: {
      'infinite-box': infinite   //注册子组件
    }
  };
</script>
<style lang="scss" scoped>
  $topc: rgba(32, 179, 125, 1);
  /*图片轮播组件高度为0 */
  .listen .mint-swipe {
    height: 200px;
    background-color: rgba(0, 0, 0, 0.7);
    /* margin-top: 2px !important; */
  }

  .listen .mint-swipe img {
    width: 100%;
  }

  .listen {
    -webkit-overflow-scrolling: touch;
  }

  .nolook {
    display: none;
  }

  .look {
    display: flex;
    justify-content: space-around;
    margin: 40px auto;
  }

  .lool2 {
    display: block;
  }

  .listen .mint-swipe-indicator {
    background: #666 !important;
    opacity: 0.7 !important;
  }

  .listen .mint-swipe-indicator.is_active {
    background: $topc !important;

  }

  .mint-swipe-indicators {
    bottom: 5px;
  }

  .listen {
    p.title {
      font-size: 2rem;
      color: $topc;
    }
  }

  .listen nav {
    margin: 5px 0;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    div {
      width: 80px;
      height: 100px;
    }

    .nav_a {
      position: relative;
      margin-top: 5px;
      width: 100%;
      height: 90%;
      display: flex;
      text-align: center;
      justify-content: space-around;
      align-items: baseline;

      p {
        display: block;
        position: absolute;
        bottom: 2px;
        margin: 0 auto;

      }

      img {
        width: 80%;
        display: block;
        position: absolute;
        top: 0px;
        margin: 0 auto;
      }
    }
  }
</style>
