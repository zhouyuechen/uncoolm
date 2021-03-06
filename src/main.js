// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from "mint-ui";
import axios from 'axios';
import vueAxios from 'vue-axios'; //得npm i vue-axios
import store from './store'//引入store

Vue.use(Mint);

import "mint-ui/lib/style.css";
import "./lib/mui/css/mui.css"
import "./lib/mui/css/icons-extra.css"
import VueResource from "vue-resource"
//4:加载(注册)VueResource
Vue.use(VueResource);
Vue.http.options.root = "http://120.79.240.144:3000";
//Vue.http.options.root = "http://127.0.0.1:3000";

//7:设置全局ajax post 访问格式
Vue.http.options.emulateJSON = true;
Vue.config.productionTip = false;


Vue.filter("time", function (s) {//时间格式过滤器
  if (s < 60) return `${parseInt(s % 60)}`;
  else
    return `${parseInt(s / 60)}:${s % 60 < 10 ? `0${parseInt(s % 60)}` : parseInt(s % 60)}`
});
Vue.filter("dateFormat", function (datestr, pattern = "YYYY-MM-DD") {//日期格式过滤
  return new Date(datestr).toLocaleString().slice(0, 10);
});
Vue.filter("ww", function (num) {//单位变W
  return (num / 10000).toFixed(1);
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
