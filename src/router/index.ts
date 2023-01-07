import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: "home",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
    /*  meta: { requiresAuth: true }, */
  },
  {
    name: "login",
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/LoginView.vue"),
  },
  {
    name: "users",
    path: "/users",
    component: () =>
      import(/* webpackChunkName: "users" */ "@/views/UserManagement.vue"),
    children: [
      {
        name: "create-user",
        path: "register",
        component: () =>
          import(
            /* weppackChunkName: "create-user" */ "@/components/UserForm.vue"
          ),
      },
      {
        name: "edit-user",
        path: "user/:id",
        component: () =>
          import(
            /* weppackChunkName: "edit-user" */ "@/components/UserForm.vue"
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
    next({ name: "login" });
  }
  next();
});

export default router;
