# App Financiera

* Aplicación desarrollada en Vue 3, con TypeScript y TailwindCSS, consume una API Externa (https://github.com/AEMG17/API-AppFinanciera), tiene soporte para compilación en plataformas moviles mediante la libreria de *Capacitor*.

## Comandos

`npm install` Descarga dependencias.

`npm run build` Compila la version web para producción.

`npm run dev` Comando para lanzar versión de desarrollo.

Una vez lanzada, nos muestra la versión de VITE en color verde, así como 3 pestañas de información. Control + click sobre la url en **Local** para arrojar la aplicación.

## Build  Android

Se utiliza Capacitor para compilar la aplicación haciendola descargable como APK en androids.

`npx cap add android` (Es necesario tener una dist creada previamente con Build).

`npx capacitor-assets generate --android` Crea los graficos a utilizar, estos estan en la carpeta resources.

`npx cap open android` Abre el Android Studio, después tenemos que esperar a que cargue los archivos y cuando este disponible  la opcion "Run", en la parte superior a la izquierda en las herramientas buscar la opcion **"Build Bundle(s) / APK(s)" -> "Build APK"** y a esperar que realice la compilación.