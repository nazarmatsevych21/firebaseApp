import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    { path: "/", component: () => import("../views/Home.vue") },
    { path: "/register", component: () => import("../views/Register.vue") },
    { path: "/sign-in", component: () => import("../views/SignIn.vue") },
    { path: "/news", component: () => import("../views/News.vue") },
    {
      path: "/profile",
      component: () => import("../views/Profile.vue"),
      meta: { requiresAuth: true }
    }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  })
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      console.log("restricted")
      next("/sign-in");
    }
  } else {
    next();
  }
})

export default router
