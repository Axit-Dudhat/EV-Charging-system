import { createRouter, createWebHistory } from "vue-router";

import Login from "../Pages/login.vue";
import Register from "../Pages/Register.vue";
import Dashboard from "../Pages/Dashboard.vue";
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path:"/register",
    name:"Register",
    component:Register
  },
  {
    path:"/dashboard",
    name:"Dashboard",
    component:Dashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;