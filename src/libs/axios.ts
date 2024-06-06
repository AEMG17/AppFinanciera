// Importar Axios, libreria para realizar peticiones HTTP sin necesidad de fetch.

import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: 'https://finance-api-668j.onrender.com/api',
    /*baseURL: 'http://localhost:3000/api',*/
});

export {
    instance
};