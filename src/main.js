// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from "mint-ui";
import axios from 'axios';
import vueAxios from 'vue-axios'; //得npm i vue-axios


Vue.use(Mint);


import "mint-ui/lib/style.css"; 
import "./lib/mui/css/mui.css"
import "./lib/mui/css/icons-extra.css"
import VueResource from "vue-resource"
//4:加载(注册)VueResource
Vue.use(VueResource)
Vue.http.options.root = "http://localhost:4000/";
//7:设置全局ajax post 访问格式
Vue.http.options.emulateJSON =  true;
Vue.config.productionTip = false;
Vue.filter("time",function(s){
  if(s<60)return `${parseInt(s%60)}`;
  else
  return `${parseInt(s/60)}:${s%60<10?`0${parseInt(s%60)}`:parseInt(s%60)}`
});
Vue.filter("dateFormat",function(datestr,pattern="YYYY-MM-DD"){
  return new Date(datestr).toLocaleString().slice(0,10);
});
Vue.filter("ww",function(num){
  return (num/10000).toFixed(1);
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
