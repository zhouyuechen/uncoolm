
<template>
 <div class="_search">
  <ul class="hot" >
   <p>热门搜索</p>
    <li v-text="item.first"  v-for="(item,i) in hot" :key="i" ref="hots"
    @touchend="search_val(item.first)"
     ></li>
   
  </ul>
 <hr>
 <ul class="res"  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="10" infinite-scroll-immediate-check="true" >
    <li v-for="(item,i) in data" :key="i" > 
        <div class="info"><p>{{item.name}}</p><span>{{item.artists[0].name}}</span></div>
        <mt-button class="play" @touchend.native="playthis(item.id)" >▶</mt-button>
        </li>
   
 </ul>
 </div>
</template>
<script>
//加载当前组件需要第三方模块
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      hot: [],
      data: [],
      loading: true,
      mid:0
    };
  },
  props: {
      kw: {
      type: [String]
    },
    res: {
      type: [String, Object, Array]
    }
  },
  methods: {
    playthis(mid){/* 按照音乐的id播放音乐，调用的是从App.js里传来的方法 */
      this.mid=mid;
        this.$emit("playThis", this.mid);
      },
    loadMore() {/* 下拉加载更多，页面底部与视口底部差距小于10px时触发 */
      
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
        //console.log("执行");
      }, 1000);
    },
    search_val(val) { /* 点击热搜修改搜索框的值 */
      this.$emit("search_val", val);
    },
    changeC() { /*热搜词 随机背景颜色 */
     
      for (var e = 0; e < this.$refs.hots.length; e++) {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        this.$refs.hots[e].style.backgroundColor = `rgba(${r},${g},${b},0.9 )`;
      }
    }
  },
  created() {/* 页面创建时发送请求，获取搜索结果 */
    var str = `search/hot`;
    this.$http.get(str).then(result => {
      this.hot = result.body.result.hots;
    });
  },
  watch: {
    res: {
      /* 监听父组件传来的res变量 */
      immediate: true,
      handler: function() {
        this.data = this.res.slice(0, 5);
        this.loading = false;
        //console.log(this.data);
      }
    },
     kw: {
      /* 监听父组件传来的kw */
      immediate: true,
      handler: function() {
        this.search_val(this.kw);
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.changeC();
    }, 400);
  }
  
};
</script>
<style scoped lang="scss">
$bgc: black;
$topc: rgba(32, 179, 125, 1);
$l20: 20%;
$l100: 100%;
$l50: 50%;
._search{
  -webkit-overflow-scrolling: touch;//适配ios系统的滑动功能
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
    background-color: rgba(0,0,0,0.3);
    margin: 0.1rem 0;
    color: white;
  }
}
.res {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0;
  flex-direction: column;
  align-items: center;
  li {
    position: relative;
    display: flex;
    width: 100%;
    height: 6rem;
    border-bottom: 2px solid $topc;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .info {
      width: 80%;
      height: 80%;
      position: relative;
      margin-left: -0.8rem;

      p {
        font-size: 1.4rem;
        color: $topc;
        text-align: left;
      }
      span {
        font-size: 1rem;
        color: #667;
        text-align: left;
        position: absolute;
        bottom: 0rem;
        left: 0rem;
      }
    }
    .play {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: $topc;
      color: white;
      position: absolute;
      top: 50%;
      right: 1rem;
      margin-top: -1.25rem;
    }
  }
}
</style>