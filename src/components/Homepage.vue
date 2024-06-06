<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { instance } from '../libs/axios';
import { getToken } from '../libs/auth';
import { Transaction } from '../interfaces/transaction';

// Arreglos de tipo transaction
const incomes = ref<Transaction[]>([])
const bills = ref<Transaction[]>([])
const transactions = ref<Transaction[]>([])

const totalIncome = ref(0);
const totalBill = ref(0);
const totalSummary = ref(0);

const dataFetched = ref(false);

const fetchIncomes = async () => {
  try {
    const token = getToken();

    // Se realiza llamada a la API.
    const { data } = await instance.get('/finances/incomes', { headers: { 'x-access-token': token } });
    incomes.value = data;

    incomes.value.forEach((income) => {
      totalIncome.value += income.amount;
    }); // Se suma cada valor al total de ingresos.


  } catch (error) {
    console.log(error);
  }
}

const fetchBills = async () => {
  try {
    const token = getToken();

    // Se realiza llamada a la API.
    const { data } = await instance.get('/finances/bills', { headers: { 'x-access-token': token } });
    bills.value = data;


    bills.value.forEach((bill) => {
      totalBill.value -= bill.amount;
    }); // Se resta cada valor al total de gastos.

  } catch (error) {
    console.log(error);
  }
}

const deleteRow = async (type: string, id: number) => {
  try {
    const token = getToken();

    // Se realiza llamada a la API.
    await instance.delete('/finances/'+type+'/'+ id, { headers: { 'x-access-token': token } });
    

    totalBill.value = 0;
    totalIncome.value = 0;
    totalSummary.value = 0;

    dataFetched.value = false;
    await fetchIncomes();
    await fetchBills();
    await orderTransactions();
    dataFetched.value = true;

  } catch (error) {
    console.log(error);
  }
}

const orderTransactions = async () => {
  // El arreglo anteriormente guardado procedemos a mapearlo y agregar un nuevo atributo, a los objetos ya añadidos.
  // en este caso al arreglo de ingresos, a cada objeto le añadimos la propiedad de type que almacena un string
  // este string permite diferenciar si es income o bill, ya que ambos guardan los mismos atributos.
  const incomeList = incomes.value.map((income: Transaction) => ({ ...income, type: 'incomes' }));
  const billList = bills.value.map((bill: Transaction) => ({ ...bill, type: 'bills' }));

  // Finalmente se comninan estos arreglos, y se ordenan por fecha, para asi poder ver cuales han sido los ultimos en añadirse.
  const combined = [...incomeList, ...billList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  transactions.value = combined; // Se almacena el combinado.
  totalSummary.value = totalBill.value + totalIncome.value; // Se suma los totales y se muestra si esta en negativo o positivo
}

onMounted(async () => {
  // Habilitamos loaders/spinners
  dataFetched.value = false;

  // Realizamos llamadas a la API y calculos matematicos.
  await fetchIncomes();
  await fetchBills();
  await orderTransactions();

  // Ocultamos loaders/spinners
  dataFetched.value = true;
})
</script>

<template>
  <section class="w-11/12 mx-auto p-3 grid gap-4 relative">
    <div class="grid gap-2">
      <h1 class="text-white font-bold text-lg">Balance</h1>
      <div class="grid grid-cols-2 gap-2 mx-auto w-full">
        <div class="grid p-3 bg-zinc-800 gap-2 rounded-lg">
          <h1 class="font-bold text-lg text-emerald-500 uppercase">Ingresos</h1>
          
          <!--Aqui si los datos no se han terminado de cargar, se emite un loader.-->
          <p class="text-green-600" v-if="dataFetched">${{ totalIncome }}</p>
          <div role='status mx-auto' v-if="!dataFetched">
            <svg xmlns='http://www.w3.org/2000/svg'
              class='mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-600 ' viewBox='0 0 512 512'>
              <path
                d='M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z' />
            </svg>
          </div>
        </div>
        <div class="grid p-3 bg-zinc-800 gap-2 rounded-lg">
          <h1 class="font-bold text-lg uppercase text-rose-700">GASTOS</h1>
          
          <!--Aqui si los datos no se han terminado de cargar, se emite un loader.-->
          <p class="text-red-600" v-if="dataFetched">${{ totalBill }}</p>
          <div role='status mx-auto' v-if="!dataFetched">
            <svg xmlns='http://www.w3.org/2000/svg'
              class='mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600 ' viewBox='0 0 512 512'>
              <path
                d='M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z' />
            </svg>
          </div>
        </div>
        <div class="grid p-3 bg-zinc-800 gap-2 rounded-lg col-span-2">
          <h1 class="font-bold text-xl uppercase text-orange-700">TOTAL</h1>
          
          <!--Aqui si los datos no se han terminado de cargar, se emite un loader.-->
          <p class="text-yellow-600 text-lg font-bold" v-if="dataFetched">${{ totalSummary }}</p>
          <div role='status mx-auto' v-if="!dataFetched">
            <svg xmlns='http://www.w3.org/2000/svg'
              class='mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600 ' viewBox='0 0 512 512'>
              <path
                d='M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z' />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-2">
      <h1 class="text-white font-bold text-lg">Ultimos Movimientos</h1>

      <div class="grid gap-3">
          
          <!--Aqui si los datos no se han terminado de cargar, se emite un loader.-->
        <div className='flex justify-center items-center relative mt-24' v-if="!dataFetched">
          <div
            className='w-2 h-2 rounded-full bg-transparent absolute border border-solid border-yellow-500 animate-ping'>
          </div>
          <div
            className='w-6 h-6 rounded-full bg-transparent absolute border-2 border-solid border-yellow-500 animate-ping'>
          </div>
          <div
            className='w-10 h-10 rounded-full bg-transparent absolute border-4 border-solid border-yellow-500 animate-ping'>
          </div>
        </div>

          
          <!--Aqui se emite una directiva que va transaccion por transaccion y la lista en el DOM, revisa si el tipo es gasto o ingreso y en base a eso muestra una caja diferente.-->
        <div class="bg-zinc-800 grid gap-3 p-2 rounded-md" v-for="transaction in transactions" :key="transaction.title">
          <div class="grid grid-cols-2">
            <p class="font-bold text-lg"
              :class="{ 'text-green-700': transaction.type == 'incomes', 'text-red-700': transaction.type == 'bills' }">{{
                transaction.title }}</p>
            <span class="text-right text-sm text-zinc-500">{{ transaction.date }}</span>
          </div>
          <span class="text-green-600 font-bold"
            :class="{ 'text-green-700': transaction.type == 'incomes', 'text-red-700': transaction.type == 'bills' }">${{
              transaction.amount }}</span>
          <div class="flex justify-between gap-2 items-center">
            <button class="bg-red-500 p-3 rounded-md text-center w-full" @click="deleteRow(transaction.type, transaction.id)">
              <img src="../assets/Trash.svg" alt="Trash Icon" class="mx-auto">
            </button>
            <RouterLink :to="{name: 'Update', params: {id: transaction.id, type: transaction.type}}" class="bg-orange-500 p-3 rounded-md text-center w-full">
              <img src="../assets/Pencil.svg" alt="Trash Icon" class="mx-auto">
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    
          
          <!--Boton para realizar nuevos movimientos.-->
    <RouterLink to="/transactions"
      class="absolute bottom-2 -right-3 bg-yellow-500 rounded-full p-4 hover:bg-orange-500 transition-all ease-in-out delay-100 drop-shadow-md">
      <img src="../assets/Calculator.svg" alt="Add new data" />
    </RouterLink>
  </section>
</template>
