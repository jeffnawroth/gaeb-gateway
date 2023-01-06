import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: "home-view",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "home-view" */ "@/views/HomeView.vue"),
    /*  meta: { requiresAuth: true }, */
  },
  {
    name: "login-view",
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "login-view" */ "@/views/LoginView.vue"),
  },
  {
    name: "register-view",
    path: "/register",
    component: () =>
      import(
        /* webpackChunkName: "register-view" */ "@/views/RegisterView.vue"
      ),
  },
  {
    name: "user-management",
    path: "/users",
    component: () =>
      import(
        /* webpackChunkName: "user-management" */ "@/views/UserManagement.vue"
      ),
    children: [
      {
        name: "register-form",
        path: "register",
        component: () =>
          import(
            /* weppackChunkName: "register-user" */ "@/components/RegisterForm.vue"
          ),
      },
    ],
  },
  {
    name: "404",
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/views/NotFound.vue"),
  },
  {
    path: "*",
    redirect: { name: "404" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("user");

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next({ name: "login-view" });
  }
  next();
});

export default router;
