import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Listen from '@/components/navbar/listen'
import Sing from '@/components/navbar/sing'
import Look from '@/components/navbar/look'
import My from '@/components/navbar/my'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
   
      component: Listen
    },
    {
      path: '/listen',
      component: Listen
    }
    ,
    {
      path: '/sing',
      component: Sing
    }
    ,
    {
      path: '/look',
      component: Look
    }
    ,
    {
      path: '/my',
      component: My
    }
  ]
})
