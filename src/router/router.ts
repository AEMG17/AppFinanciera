import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { getToken } from '../libs/auth';

// Importa los componentes para las rutas
import Homepage from '../components/Homepage.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Profile from '../components/Profile.vue';
import Transactions from '../components/Transactions.vue';
import UpdateTransaction from '../components/Update.vue';

// Define las rutas
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Homepage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/transactions',
    name: 'Transaction',
    component: Transactions,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/update/transaction/:id/:type',
    name: 'Update',
    component: UpdateTransaction,
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = getToken();
  // Si la ruta apuntada tiene el requiresAuth en true.
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) { // Pregunta si tiene token, si no lo tiene, va al login.
      next({ name: 'Login' })
    } else { // Si tiene token, va al inicio.
      next()
    }
  } else {
    // Si la ruta no necesita autenticacion, pregunta si el usuario tiene token para enviarlo el inicio.
    // Ejemplo, si ya esta autenticado, no permitira que ingrese a la pagina /login o /register
    if(token) {
      next({ name: 'Home' })
    }
    next();
  }
});


export default router;