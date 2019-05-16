<template>
  <!-- 登陆页面 -->
  <div>
    <div v-if="!check" class="my">
      <input type="text"
             @blur="checkVal(userData.account,'请输入手机号')"
             placeholder="请输入手机号"
             v-model="userData.account"/>

      <input type="password"
             @blur="checkVal(userData.pwd,'请输入密码')"
             placeholder="请输入密码"
             v-model="userData.pwd"
      />

      <div>
        <mt-button class="btn" type="default" @click="login()">登录</mt-button>
        <mt-button class="btn" type="default" @click="register()">注册</mt-button>
      </div>


      <div class="sorry"></div>
      <img src="../../assets/sorry.jpg" alt="加载失败">
    </div>
    <!--    已登录-->
    <div v-if="check" class="my">
      <div class="head">
        <img class="touxiang" :src="now.avatarUrl" alt="加载失败">
        <h2>{{this.now.nickname}}</h2></div>
      <div class="head">
        <h5>来自：{{this.now.province}}</h5>
        <mt-button style="margin: .3rem 0 .7rem" class="btn" size="small" type="default" @click="out()">退出登录</mt-button>
      </div>


      <myfav-box v-on:playThis="goup"></myfav-box>

    </div>

  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  import {mapGetters, mapActions} from 'vuex';
  import myFav from "../subcomponents/myFav"
  import axios from 'axios'

  const instance = axios.create({
    baseURL: 'http://120.79.240.144:3000',
    //baseURL: 'http://127.0.0.1:3000',
      withCredentials: true

  });
  export default {
    data() {
      return {
        userData: {
          account: '',
          pwd: ''
        }
      };
    },
    computed: {
      ...mapGetters('user', ['check', 'now']),

    },
    components: {
      'myfav-box': myFav   //注册子组件
    },
    methods: {
      ...mapActions('user', ['getLogin', 'getLogout']),
      goup(mid) {/* 点击播放 */
        this.$emit("playThis", mid);
      },
      checkVal(val, tip) {
        if (!val) {
          Toast({
            message: tip
            /* iconClass: 'icon icon-success' */
          });
        }
      },
      login() {
        if (!this.userData.account || !this.userData.pwd) {
          Toast({
            message: "密码或账号没输入"
          });
          return
        }
        this.getLogin({
          http: instance, toast: Toast, ...this.userData
        })
      },
      register() {
        Toast({
          message: '注册有风险，还是算了'
          /* iconClass: 'icon icon-success' */
        });
      },
      out() {
        this.getLogout({
          http: this.$http,
          toast: Toast
        })
      }
    },
    created() {
    }
  };
</script>
<style scoped lang="scss">
  $topc: rgba(32, 179, 125, 1);
  .my {
    padding: 2rem;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
  }

  .sorry {
    width: 90%;
  }

  .btn {
    margin: 0 1.5rem;
  }

  h2 {
    color: $topc;
  }

  img {
    width: 100%;
    border-radius: 30px;
    margin: 1rem;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    img.touxiang {
      width: 20%;

    }
  }

</style>
