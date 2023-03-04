import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store/index";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: "home",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
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
    // meta: { requiresAuth: true },

    children: [
      {
        name: "create-user",
        path: "register",
        props: true,
        component: () =>
          import(
            /* weppackChunkName: "create-user" */ "@/components/UserForm.vue"
          ),
        beforeEnter(routeTo, routeFrom, next) {
          store.commit("users/SET_CREATION_MODE", true);
          //@ts-expect-error: Property 'users' does not exist on type '{ loadingGlobal: boolean; }'.
          routeTo.params.creationMode = store.state.users.creationMode;
          next();
        },
      },
      {
        name: "edit-user",
        path: "user/:id",
        props: true,
        component: () =>
          import(
            /* weppackChunkName: "edit-user" */ "@/components/UserForm.vue"
          ),
        async beforeEnter(routeTo, routeFrom, next) {
          try {
            const user = await store.dispatch(
              "users/getUser",
              routeTo.params.id
            );
            routeTo.params.user = user;
            next();
          } catch (error) {
            next();
          }
        },
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
    name: "create-boq",
    path: "/create-boq",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/views/CreateBoq.vue"),
    //meta: { requiresAuth: true }
  },
  {
    name: "read-boq",
    path: "/read-boq",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/views/ReadGAEB.vue"),
    //meta: { requiresAuth: true }
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
  store.commit("SET_LOADING_GLOBAL", true);
  const loggedIn = localStorage.getItem("user");

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next({ name: "login" });
  }
  next();
});

router.afterEach(() => {
  store.commit("SET_LOADING_GLOBAL", false);
});

export default router;
