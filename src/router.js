import Vue from "vue";
import Router from "vue-router";
import DayPage from "./views/DayPage.vue";
import WeekPage from "./views/WeekPage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/day"
    },

    {
      path: "/day/:date?",
      name: "day",
      component: DayPage
    },
    {
      path: "/week/:date?",
      name: "week",
      component: WeekPage
    }
  ]
});
