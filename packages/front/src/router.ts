import store from '@/store'
import Vue from 'vue'
import Router, { Route } from 'vue-router'
import DayPage from './views/DayPage.vue'
import MyPlanningsPage from './views/MyPlannings.vue'
import PrivacyPolicyPage from './views/PrivacyPolicy.vue'
import SettingsPage from './views/Settings.vue'
import SharingsPage from './views/Sharings.vue'
import SignInPage from './views/SignIn.vue'
import TermsOfServicePage from './views/TermsOfService.vue'
import WeekPage from './views/WeekPage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index.html',
      component: WeekPage,
      redirect: '/week',
    },
    {
      path: '/',
      component: WeekPage,
      redirect: '/week',
    },
    {
      name: 'sign-in',
      path: '/signIn',
      component: SignInPage,
    },
    {
      path: '/week',
      name: 'mainWeek',
      component: WeekPage,
      meta: {
        title: 'Plan your meals',
        authRequired: true,
        showToolbarExtension: true,
        navigationComponent: 'week-navigation',
      },
    },
    {
      path: '/week/:year/:month/:day',
      name: 'week',
      component: WeekPage,
      meta: {
        title: 'Plan your meals',
        authRequired: true,
        showToolbarExtension: true,
        navigationComponent: 'week-navigation',
      },
    },
    {
      path: '/day/:year/:month/:day',
      name: 'day',
      component: DayPage,
      meta: {
        title: 'Plan your meals',
        authRequired: true,
        showBackButton: true,
        showToolbarExtension: true,
        navigationComponent: 'day-navigation',
      },
    },
    {
      path: '/sharings',
      name: 'sharings',
      component: SharingsPage,
      meta: {
        title: 'Mes partages',
        showBackButton: true,
        authRequired: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: {
        title: 'Paramètres',
        showBackButton: true,
        authRequired: true,
      },
    },
    {
      path: '/my-plannings',
      name: 'my-plannings',
      component: MyPlanningsPage,
      meta: {
        title: 'Mes plannings',
        showBackButton: true,
        authRequired: true,
      },
    },
    {
      path: '/terms-of-service',
      name: 'terms-of-service',
      component: TermsOfServicePage,
      meta: {
        title: "Conditions d'utilisation",
        showBackButton: true,
      },
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicyPage,
      meta: {
        title: 'Politique de confidentialité',
        showBackButton: true,
      },
    },
  ],
})

router.beforeEach(async (to: Route, from: Route, next: any) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (!store.getters['auth/isLoggedIn']) {
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

router.afterEach(async (to: Route, from: Route) => {
  if (to.name === 'week' || to.name === 'mainWeek') {
    store.commit('setCurrentWeekPage', to.path)
  }
})

export default router
