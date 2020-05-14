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

export const SIGNIN_PAGE_NAME = 'sign-in'
export const WEEK_PAGE_NAME = 'week'

export const DEFAULT_MAIN_PAGE_PATH = '/week'
export const DEFAULT_MAIN_PAGE_NAME = 'mainWeek'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index.html',
      component: WeekPage,
      redirect: DEFAULT_MAIN_PAGE_PATH,
    },
    {
      path: '/',
      component: WeekPage,
      redirect: DEFAULT_MAIN_PAGE_PATH,
    },
    {
      name: SIGNIN_PAGE_NAME,
      path: '/signIn',
      component: SignInPage,
    },
    {
      path: DEFAULT_MAIN_PAGE_PATH,
      name: DEFAULT_MAIN_PAGE_NAME,
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
      name: WEEK_PAGE_NAME,
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
        storeName: 'sharings',
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
        storeName: 'plannings',
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
  if (to.matched.some((record) => record.meta.authRequired)) {
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
  if (isAWeekPage(to)) {
    store.commit('setCurrentWeekPage', to.path)
  }
})

/**
 * Return true if the route is a week page
 * @param route Route
 */
function isAWeekPage(route: Route) {
  return route.name === WEEK_PAGE_NAME || route.name === DEFAULT_MAIN_PAGE_NAME
}

export default router
