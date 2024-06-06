<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { instance } from '../libs/axios';
import { getToken } from '../libs/auth';
import { User } from '../interfaces/user';

const imageData = ref(new FormData);

const userInfo = ref<User>({name: 'Usuario', image: 'https://therichpost.com/wp-content/uploads/2020/06/avatar1.png'});

const handleNewImage = async (e: Event) => {
    imageData.value.delete('image');
    imageData.value.append('image', e.target.files[0]);
    await updateImage();
}

const updateImage = async () => {
    try {
        
        const token = getToken();

        await instance.put('/auth/image', imageData.value, { headers: { 'x-access-token': token } } );

        await fetchData();

    } catch (error) {
        console.log(error)
    }
}

const fetchData = async () => {
    try {
        
        const token = getToken();

        const { data } = await instance.get('/auth/users', { headers: { 'x-access-token': token } } );

        userInfo.value = data[0];

    } catch (error) {
        console.log(error)
        
    }
}

onMounted(async () => {
    await fetchData();
})

</script>

<template>
    <section class="w-11/12 mx-auto py-8 px-4 grid gap-8">
        <div class="grid gap-2 mx-auto justify-center">
            <img :src="userInfo.image" alt="User Image" class="h-32 w-32 mx-auto rounded-full">
            <h1 class="font-bold text-white text-xl text-center">{{ userInfo.name }}</h1>
        </div>

        <div class="w-full grid gap-6">
            <label for="image-user" class="bg-yellow-500 rounded-lg p-4 text-white text-center font-bold">Subir imagen</label>
            <input @change="handleNewImage" type="file" name="image-user" id="image-user" class="hidden">
        
            <RouterLink to="/" class="bg-orange-500 rounded-lg p-4 text-white text-center font-bold">Regresar</RouterLink>
        
        </div>
    </section>
</template>