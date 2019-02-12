<template>
  <!-- 热门电台，纯展示 -->
  <div class="diantai">
    <h3>电台分类</h3>
    <hr>
    <ul class="hot">

      <li v-text="item.name" v-for="(item,i) in dj_tp" :key="i" ref="hots"
          @click="getDj(item.id)"
      ></li>

    </ul>
    <hr>
    <mt-cell v-for="(item,i) in djs" :key="i"

             :title="item.name"
             :label="item.rcmdtext"
             is-link
             value="详情">
      <img slot="icon" :src="item.picUrl" width="100" height="100">
    </mt-cell>

  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";

  export default {
    data() {
      return {
        dj_tp: [],
        djs: []
      }
    },
    methods: {
      changeC() {
        /* 随机背景颜色 */
        for (var e = 0; e < this.$refs.hots.length; e++) {
          var r = Math.floor(Math.random() * 255);
          var g = Math.floor(Math.random() * 255);
          var b = Math.floor(Math.random() * 255);
          this.$refs.hots[e].style.backgroundColor = `rgba(${r},${g},${b},0.9 )`;
        }
      },
      getDj(did) {/* 根据电台类型id搜索 */
        var str = `dj/recommend/type?type=${did}`;
        this.$http.get(str).then(result => {
          this.djs = result.body.djRadios.slice(0, 10);
        });
      }
    },
    created() {
      var str = `dj/catelist`;
      this.$http.get(str).then(result => {
        this.dj_tp = result.body.categories;
      });
    },
    mounted() {
      setTimeout(() => {
        this.changeC();
      }, 200);
    }
  }
</script>
<style scoped lang="scss">
  $bgc: black;
  $topc: rgba(32, 179, 125, 1);
  $l20: 20%;
  $l100: 100%;
  $l50: 50%;
  .diantai {
    -webkit-overflow-scrolling: touch;
  }

  .h3 {
    color: $topc;
  }

  .mint-cell {
    position: relative;
    background-color: transparent;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    padding-left: 116px;

    img {
      border-radius: 30px;
      position: absolute;
      top: 0;
      left: 1rem;

    }
  }

  .hot {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 0;

    flex-wrap: wrap;

    p {
      width: 100%;
      text-align: left;
      border-bottom: 2px dashed #666;
      font-size: 1.1rem;
      padding-bottom: 0.5rem;
      padding-left: 0.5rem;
    }

    li {
      list-style: none;
      max-width: 50%;
      min-width: 20%;
      height: 1.5rem;
      line-height: 1.5rem;
      border-radius: 10px;
      background-color: transparent;
      margin: 0.1rem 0;
      color: white;
    }
  }

</style>
