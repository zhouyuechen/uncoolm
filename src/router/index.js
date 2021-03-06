import Vue from 'vue'
import Router from 'vue-router'
import Listen from '@/components/navbar/listen'
import Sing from '@/components/navbar/sing'
import Look from '@/components/navbar/look'
import My from '@/components/navbar/my'
import Yueku from '@/components/listen/yueku'
import Gedan from '@/components/listen/gedan'
import Geshou from '@/components/listen/geshou'
import Diantai from '@/components/listen/diantai'
import Search from '@/components/search'
import SingerDetails from '@/components/details/singerDetails'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/singerdetails/:sid',
      component: SingerDetails,
      props: true
    },
    {
      path: '/search/:kw',
      component: Search,
      props: true
    },
    {
      path: '/',
      component: Listen
    },
    {
      path: '/listen',
      component: Listen
    },
    {
      path: '/yueku',
      component: Yueku
    },
    {
      path: '/gedan',
      component: Gedan
    },
    {
      path: '/geshou',
      component: Geshou
    },
    {
      path: '/diantai',
      component: Diantai
    },
    {
      path: '/sing',
      component: Sing
    },
    {
      path: '/look',
      component: Look
    },
    {
      path: '/my',
      component: My
    }
  ]
})
