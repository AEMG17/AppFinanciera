export interface Transaction {
    id: number,
    title: string,
    amount: number,
    date: string,
    type: string
}

// Se crea esta interfaz para que los datos tengan solidez y robusted, es decir poder trabajar de manera facil los arreglos.
// Y las directivas en el DOM.
