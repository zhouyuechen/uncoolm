<template>
  <div class="myfav">
    <div v-if="detailList" class="title"><h3>我的收藏 </h3> <span>您一共收藏了{{likeList.length}}首歌 </span>
    </div>
    <div v-if="detailList" class="detailList" v-for="(item) in detailList" :key="item.id" @click="playthis(item.id)">
      <p>{{item.name}}</p>
      <p>{{item.ar[0].name}}</p>
    </div>

  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  import {mapGetters,mapActions} from 'vuex'
  import axios from 'axios'

  const instance = axios.create({
    baseURL: 'http://120.79.240.144:3000',
    // baseURL: 'http://127.0.0.1:3000',
    timeout: 10000,
    withCredentials: true,
  });


  export default {
    data() {
      return {
        likeList: [],
        detailList: []

      }
    },
    computed: {
      ...mapGetters('user', ['fav', 'now']),
      favLength() {
          return this.fav.length;
        }

    },
    watch: {
      favLength:function(old,newd) {//当喜欢的歌列表变化时
        if(old!==newd){
          this.jiazai()
        }

      }
    },
    methods: {
      ...mapActions('user', ['getSetFav']),
      async jiazai() {
        const t = new Date()
        let likeList = await instance.get(`likelist?uid=${this.now.id}`)
        this.likeList = likeList.data.ids;
        this.getSetFav({
          likeList:this.likeList
        })
        let detailList = await instance.get(`song/detail?ids=${this.likeList.join(',')}`)
        this.detailList = detailList.data.songs;

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
  .myfav {
    div.title {
      height: 1.5rem;
      border-radius: 5px;
      border-bottom: 1px solid $topc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: .3rem 0;
      padding-bottom: .5rem;
      color: #8f8f94;

      h3 {
        color: $topc;
      }
    }

    .detailList {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 0;
    }
  }


</style>
