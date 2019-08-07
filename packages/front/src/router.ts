import store from '@/store'
import Vue from 'vue'
import Router, { Route } from 'vue-router'
import SharingsPage from './views/SharingsPage.vue'
import SignInPage from './views/SignIn.vue'
import WeekPage from './views/WeekPage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index.html',
      component: WeekPage,
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/',
      component: WeekPage,
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/signIn',
      component: SignInPage,
    },
    {
      path: '/week',
      component: WeekPage,
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/week/:year/:month/:day',
      name: 'week',
      component: WeekPage,
      meta: {
        authRequired: true,
      },
    },
    {
      path: '/sharings',
      name: 'sharings',
      component: SharingsPage,
      meta: {
        authRequired: true,
      },
    },
  ],
})

router.beforeEach(async (to: Route, from: Route, next: any) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (!store.state.auth.user) {
      next({
        path: '/signIn',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
