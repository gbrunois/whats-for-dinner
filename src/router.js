import Vue from "vue";
import Router from "vue-router";
import DayPage from "./views/DayPage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/:date?",
      name: "day",
      component: DayPage
    }
  ]
});
