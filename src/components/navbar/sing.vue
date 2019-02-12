<template>
  <!-- 一个纯展示页面，展示的是独家放送和推荐电台 -->
  <div class="sing">
    <h3>独家放送</h3>
    <ul class="unique_pro">
      <li v-for="(item,i) in unique_pro" :key="i">
        <img v-lazy="item.picUrl" alt="加载失败">
        <p>{{item.name}}</p>
      </li>
    </ul>
    <h3>推荐电台</h3>
    <ul class="dj_pro">
      <li v-for="(item,i) in dj_pro" :key="i">
        <img v-lazy="item.picUrl" alt="加载失败">
        <div><p>{{item.name}}</p></div>
      </li>
    </ul>
  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";

  export default {
    data() {
      return {
        unique_pro: [],
        dj_pro: [],

      }
    },
    methods: {
      getUnique_pro() {
        var url = `personalized/privatecontent`;
        this.$http.get(url).then(result => {
          this.unique_pro = result.body.result;
          console.log(this.unique_pro);
        });
      },
      getDj_pro() {
        var url = `personalized/djprogram`;
        this.$http.get(url).then(result => {
          this.dj_pro = result.body.result;
          console.log(this.dj_pro);
        });
      }
    },
    created() {

      this.getUnique_pro();
      this.getDj_pro();
    }
  }
</script>
<style scoped lang="scss">
  $bgc: black;
  $topc: rgba(32, 179, 125, 1);
  $l20: 20%;
  $l100: 100%;
  $l50: 50%;
  .sing {
    -webkit-overflow-scrolling: touch;
  }

  h3 {
    color: $topc;
    padding-bottom: .8rem;
    border-bottom: 2px solid $topc;
    margin: .8rem auto;
  }

  p {
    margin: 0;

  }

  ul {
    display: block;
    width: 100%;
    padding: 0;

    li {
      position: relative;
      list-style: none;
      margin: .8rem 0;
      border-radius: 20px;
      overflow: hidden;
    }
  }

  .unique_pro {

    li {
      width: $l100;

      img {
        width: $l100;

      }

      p {
        width: $l100;
        height: 2rem;
        margin-top: -2rem;
        line-height: 2rem;
        background-color: rgba($color: #000000, $alpha: 0.7);
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }

  .dj_pro {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;

    li {
      width: 40%;
      margin: 0.8rem 5%;

      img {
        width: $l100;
      }

      div {
        width: $l100;
        overflow: hidden;

        p {
          width: $l100;
        }
      }
    }
  }
</style>
