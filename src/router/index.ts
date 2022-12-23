import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: "home-view",
    path: "/home",
    component: () => import(/* webpackChunkName: "home-view" */ '@/views/HomeView.vue')
  },
  {
    name: "login-view",
    path: "/",
    component: () => import(/* webpackChunkName: "login-view" */ '@/views/LoginView.vue')
  },
  {
    name: "register-view",
    path: "/register",
    component: () => import(/* webpackChunkName: "register-view" */ '@/views/RegisterView.vue')
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
