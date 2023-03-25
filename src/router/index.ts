import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store/index";
import { User } from "@/helpers/Interfaces";

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
    meta: { requiresAuth: true },

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
      import(/* webpackChunkName: "create-gaeb" */ "@/views/CreateGaeb.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "read-boq",
    path: "/read-boq",
    component: () =>
      import(/* webpackChunkName: "gaeb-reader" */ "@/views/GaebReader.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "projects",
    path: "/projects",
    component: () =>
      import(/* webpackChunkName: "projects" */ "@/views/ProjectsTable.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        name: "create-project",
        path: "create",
        component: () =>
          import(
            /* weppackChunkName: "create-project" */ "@/components/OpenCDE/CreateProjectDialog.vue"
          ),
      },
    ],
  },
  {
    name: "documents",
    path: "/projects/:id",
    component: () =>
      import(/* webpackChunkName: "documents" */ "@/views/DocumentsTable.vue"),
    props: true,
    meta: { requiresAuth: true },
    children: [
      {
        name: "upload-document",
        path: "upload",
        component: () =>
          import(
            /* weppackChunkName: "upload-document" */ "@/components/OpenCDE/DocumentDialog.vue"
          ),
      },
    ],
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

/**

    This is a global navigation guard that is executed before each route change.
    It sets the global loading state to true and checks if the user is logged in and has the necessary authorization
    to access the requested route. If the user is not authorized, it redirects them to the login page or displays a 404 error.
    It also dispatches a notification to display an error message if the user is not authorized to access the requested route.
    @param {RouteLocationNormalized} to - the route being navigated to
    @param {RouteLocationNormalized} from - the current route being navigated from
    @param {Function} next - the callback function that allows navigation to continue
    */
router.beforeEach((to, from, next) => {
  store.commit("SET_LOADING_GLOBAL", true);
  const loggedIn = localStorage.getItem("user");
  const user = JSON.parse(loggedIn as string) as User;

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next({ name: "login" });
  } else if (
    to.matched.some((record) => record.path === "/users") &&
    loggedIn &&
    user.role !== "Admin"
  ) {
    next({ name: "404" });
    const notification = {
      type: "error",
      message: "Keine Zugangsberechtigung für diese Seite.",
    };
    store.dispatch("notification/add", notification);
  } else {
    next();
  }
});

/**

    This is a global navigation guard that is executed after each route change.
    It sets the global loading state to false after the route has finished loading.
    */
router.afterEach(() => {
  store.commit("SET_LOADING_GLOBAL", false);
});

export default router;
