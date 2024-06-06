<script setup lang="ts">
import { ref } from 'vue';
import { instance } from '../libs/axios';
import { getToken } from '../libs/auth';
import router from '../router/router';

const title = ref("");
const amount = ref(0);

const updateTransaction = async () => {
    try {
        const token = getToken();

        if (title.value.trim() == '' || amount.value == 0) {
            return;
        }
        await instance.put('/finances/' + router.currentRoute.value.params.type + '/' + router.currentRoute.value.params.id, { title: title.value, amount: amount.value }, {
            headers: {
                'x-access-token': token
            }
        })

        router.push('/')

    } catch (error) {
        console.log(error)
    }
}


</script>

<template>
    <section class="w-11/12 mx-auto py-8 px-4 grid gap-8">
        <div class="grid gap-2 mx-auto justify-center">
            <img src="../assets/Calculator.svg" alt="User Profile Image" class="h-12 w-12 mx-auto">
            <h1 class="font-bold text-white text-xl">Actualiza la transacción</h1>
        </div>

        <div class="w-full grid gap-6">
            <div class="grid gap-2 w-full">
                <label for="Titulo" class="text-white font-bold text-lg">Titulo</label>
                <input type="text" name="Titulo" placeholder="Titulo de la acción" v-model="title"
                    class="bg-transparent text-zinc-400 p-4 rounded-lg border-2 border-yellow-400">
            </div>
            <div class="grid gap-2 w-full">
                <label for="Monto" class="text-white font-bold text-lg">Monto</label>
                <input type="number" name="Monto" placeholder="Monto total" v-model="amount"
                    class="bg-transparent text-zinc-400 p-4 rounded-lg border-2 border-yellow-400">
            </div>
            <button class="bg-yellow-500 rounded-lg p-4 text-white text-center font-bold"
                @click="updateTransaction">Actualizar</button>

            <RouterLink to="/" class="bg-orange-500 rounded-lg p-4 text-white text-center font-bold">Regresar
            </RouterLink>

        </div>
    </section>
</template>