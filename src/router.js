import Vue from 'vue';
import Router from 'vue-router';
import WeekPage from './views/WeekPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index.html',
      redirect: '/week',
    },
    {
      path: '/',
      redirect: '/week',
    },
    {
      path: '/week',
      component: WeekPage,
    },
    {
      path: '/week/:year/:month/:day',
      name: 'week',
      component: WeekPage,
    },
  ],
});
