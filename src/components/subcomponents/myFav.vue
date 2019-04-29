<template>
  <div class="infinite">
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="30" infinite-scroll-immediate-check="loading2">
      <li v-for="(item) in list" :key="item.id">
        <img v-lazy="item.song.album.picUrl" alt="加载失败" @click="playthis(item.id)">
        <div><p>{{item.name}}</p>
          <p>{{item.song.artists[0].name}}</p></div>
        <p>发布时间<br>{{item.song.album.publishTime|dateFormat}}</p>

      </li>
    </ul>
  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {

       data:{

       }

      }
    },
    computed: {
      ...mapGetters('user', ['fav', 'now']),

    },
    methods: {
      jiazai(){


      },
      playthis(mid) {/* 点击歌曲播放，调用App.js中的播放方法 */
        let now = new Date();
        now = now.getTime();
        if (now - this.timeset < 100) {
          this.timeset = now
          return
        }
        this.timeset = now
        this.$emit("playThis", mid);
      },
    },
    mounted() {
      this.jiazai();
    }
  }
</script>
<style scoped lang="scss">
  $topc: #20b37d;
  .infinite > p {
    text-align: left;
    padding-left: 2rem;
    color: $topc;
    font-size: 1.1rem;
  }

  .infinite {
    -webkit-overflow-scrolling: touch;

    & > ul {
      padding: 0;
      width: 100%;
    }

    & > ul li {
      list-style: none;
      width: 100%;
      height: 100px;
      border-bottom: 1px solid $topc;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;

      img {
        width: 20%;
        position: absolute;
        left: 10%;
        top: 10px;
        border-radius: 10%;
        overflow: hidden;
      }

      & > div {
        margin-left: 130px
      }
    }
  }

</style>
