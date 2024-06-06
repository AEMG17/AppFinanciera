<script setup lang="ts">
import { removeToken, getToken } from './libs/auth';
import router from './router/router';
import event from './libs/event';
import { onMounted, ref } from 'vue';

const logoutButton = ref(false);

const authLogout = () => {
  removeToken();
  event.emit('log-in', false);
  router.push('/login');
}

const handleButtonStatus = () => {
  logoutButton.value = !logoutButton.value;
}

onMounted(() => {
  event.on('log-in', handleButtonStatus);
  
  const token = getToken();
  if (token) {
    logoutButton.value = true;
  }
})
</script>

<template>
  <header class="w-full bg-yellow-500 p-4 flex justify-between items-center">
    <div class="inline-flex items-center gap-3">
      <img src="./assets/Wallet.svg" alt="Wallet Icon">
      <h1 class="font-bold text-xl text-white">App Financiera</h1>
    </div>

    <div class="flex items-center gap-3">
      <RouterLink to="/profile" v-if="logoutButton" class="bg-yellow-600 rounded-lg p-3 text-white font-extrabold text-center text-xl">
        <img src="./assets/User.svg" class="h-7 w-7" alt="Profile">
      </RouterLink>
      <button v-if="logoutButton" class="bg-yellow-600 rounded-lg p-3 text-white font-extrabold text-center text-xl"
        @click="authLogout">
        X
      </button>
    </div>
  </header>

  <RouterView></RouterView>
</template>
