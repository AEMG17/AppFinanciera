

// Pequeña funcion que almacena el token de autenticación en el almacenaje del navegador
export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
}

// Pequeña funcion que obtiene el token de autentición del almacenaje del navegador
export const getToken = (): string | null => {
    return localStorage.getItem('token');
} 

// Pequeña funcion que elimina el token almacenado
export const removeToken = (): void => {
    return localStorage.removeItem('token');
} 
