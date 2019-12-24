import Vue from 'vue'
import Router from 'vue-router'
import AndroidJs from '@/components/mobile/AndroidJs'
import MobilePage from  '@/components/mobile/MobilePage'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path : '/',
      name : 'MobilePage',
      component : MobilePage
    },
    {
      path: '/AndroidJs',
      name: 'AndroidJs',
      component: AndroidJs
    },

  ]
})

/**
 * 验证
 */
router.beforeEach((to, from, next) => {
  if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = './p_index.html#/'
    return
  }
  next()
})

export default router
