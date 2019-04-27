<template>
  <!-- 登陆页面 -->
  <div>
    <div v-if="!check" class="my">
      <input type="text"
             @blur="checkVal(userData.account,'请输入手机号')"
             placeholder="请输入手机号或网易邮箱"
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
      <img class="touxiang" :src="now.avatarUrl" alt="加载失败">
      <h2>昵称：{{this.now.nickname}}</h2>
      <h3>来自：{{this.now.province}}</h3>

      <mt-button style="margin: 1rem" class="btn" type="default" @click="out()">退出登录</mt-button>

    </div>

  </div>
</template>
<script>
  //加载当前组件需要第三方模块
  import {Toast} from "mint-ui";
  import {mapGetters, mapActions} from 'vuex'
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
    methods: {
      ...mapActions('user', ['getLogin', 'getLogout']),
      checkVal(val, tip) {
        if (!val) {
          Toast({
            message: tip
            /* iconClass: 'icon icon-success' */
          });
        }
      },
      login() {
        if(!this.userData.account||!this.userData.pwd){
          Toast({
            message: "密码或账号没输入"
            /* iconClass: 'icon icon-success' */
          });
          return
        }
        this.getLogin({
          http:this.$http,toast:Toast,...this.userData})
      },
      register() {
        Toast({
          message: '注册有风险，还是算了'
          /* iconClass: 'icon icon-success' */
        });
      },
      out(){
        this.getLogout({
          http:this.$http,
          toast:Toast
        })
      }
    },
    created() {
    }
  };
</script>
<style scoped>
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
    color: #3ddddd;
  }

  img {
    width: 100%;
    border-radius: 30px;
    margin: 1rem;
  }
  img.touxiang{
    width: 50%;
  }
</style>
