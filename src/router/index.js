import Vue from 'vue'
import VueRouter from 'vue-router'
import SignInForm from "../views/SignInForm.vue";
import Profile from "../views/Profile.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "../views/Project.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/signinform",
    name: "Sign In Form",
    component: SignInForm,
  },
 
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  
]

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next();
      } else {
        next({ path: "/signinform" });
      }
    });
  } else {
    next();
  }
});

export default router;
