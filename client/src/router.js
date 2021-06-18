import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Profile from '@/views/Profile.vue'
import Analysis from '@/views/Analysis.vue';
import About from '@/views/About.vue'

const { uri } = require('./env');

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/analysis",
    name: "analysis",
    component: Analysis
  },
  {
    path: "/profile",
    name: "profile",
    meta: { auth: true },
    component: Profile
  },
  {
    path: "/about",
    name: "about",
    component: About
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem('token');
    const res = await fetch(`${uri}api/users/`, {
      method: 'GET',
      headers: {
          Authorization: token
      }
  });
  const requireAuth = to.matched.some(profile => profile.meta.auth);
  if (requireAuth && res.status !== 200) next('/');
  else next();
});

export default router;