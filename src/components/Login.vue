<script setup lang="ts">
import { ref } from 'vue';
import { instance } from '../libs/axios';
import axios from 'axios';
import { saveToken } from '../libs/auth';
import router from '../router/router';
import event from '../libs/event';

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const authSignin = async () => {
    try {// Pregunta si email y password estan vacios, si no envia la peticion.
        if(email.value.trim() != "" && password.value.trim() != ""){
            const {data} = await instance.post('/auth/signin', {email: email.value, password: password.value});
            saveToken(data.token) // guarda el token
            event.emit('log-in', true); // envia evento para el header.
            router.push('/') // redirige al home.
        }
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          errorMessage.value = e.response.data.error;
        } else {
          errorMessage.value = 'An unexpected error occurred';
        }
    }
}
</script>

<template>
    <div class="w-11/12 mx-auto grid gap-24 py-8 px-4">

        <div class="grid justify-center mx-auto gap-3">
            <img src="../assets/User.svg" alt="User Icon" class="mx-auto">
            <h1 class="text-white font-bold text-xl">Inicia Sesion</h1>
        </div>

        <div class="w-full grid gap-6">
            <div class="grid gap-2 w-full">
                <label for="Email" class="text-white font-bold text-lg">Correo Electronico</label>
                <input type="text" name="Email" placeholder="Tu email" v-model="email"
                    class="bg-transparent p-4 rounded-lg border-2 border-yellow-400 text-zinc-300">
            </div>
            <div class="grid gap-2 w-full">
                <label for="Password" class="text-white font-bold text-lg">Contraseña</label>
                <input type="password" name="Password" placeholder="Tu contraseña" v-model="password"
                    class="bg-transparent p-4 rounded-lg border-2 border-yellow-400 text-zinc-300">
            </div>
            
            <div class="bg-red-400 text-white font-bold text-center rounded-lg p-4 mx-auto w-full" v-if="errorMessage != ''">
                {{errorMessage}}
            </div>

            <button class="bg-yellow-500 rounded-lg p-4 text-white text-center font-bold" @click="authSignin">Ingresar</button>
        
            <RouterLink to="/register" class="text-yellow-400 text-sm">No tengo una cuenta, quiero registrarme!</RouterLink>
        </div>
    </div>
</template>