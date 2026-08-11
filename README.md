# 🏺 Artesanías Express - Gestión de Pedidos Móvil

Aplicación móvil de tipo *offline-first* desarrollada para la gestión integral de pedidos de productos artesanales. Diseñada para funcionar sin conexión a internet mediante bases de datos locales, con capacidad de sincronización inteligente hacia la nube.

Este proyecto ha sido desarrollado como entregable final para el módulo de Desarrollo de Aplicaciones Móviles.

## 🚀 Características Principales

- **Autenticación Segura:** Registro, inicio y cierre de sesión de vendedores mediante Firebase Authentication. Rutas protegidas mediante Expo Router.
- **Arquitectura Offline-First:** Persistencia de datos permanente usando SQLite. Las operaciones (Crear, Leer, Actualizar, Eliminar) se guardan localmente en el dispositivo.
- **Sincronización en la Nube:** Integración con Firebase Firestore. Algoritmo inteligente que evalúa registros para realizar `addDoc`, `updateDoc` o `deleteDoc` según corresponda, evitando duplicidad de información.
- **Catálogo Dinámico (API REST):** Consumo asíncrono de un catálogo de productos realistas alojado en MockAPI, renderizando imágenes, nombres y precios con manejo de estados de carga (Loader).
- **Diseño UI/UX Premium:** Interfaces modernas, limpias y responsivas desarrolladas con NativeWind (Tailwind CSS v3.4), incluyendo validaciones de formularios, alertas interactivas y avatares de usuario.

## 🛠️ Tecnologías y Herramientas

- **Framework:** React Native / Expo (SDK 57)
- **Navegación:** Expo Router (File-based routing)
- **Estilos:** NativeWind (Tailwind CSS)
- **Base de Datos Local:** Expo SQLite
- **Backend as a Service (BaaS):** Firebase (Auth & Firestore)
- **API Externa:** MockAPI.io
- **Compilación Nativa:** EAS Build (Generación de APK)

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- Git
- Aplicación **Expo Go** instalada en tu dispositivo físico, o un Emulador de Android configurado.

## 📥 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/mi-proyecto-artesanias.git](https://github.com/TU_USUARIO/mi-proyecto-artesanias.git)
   cd mi-proyecto-artesanias

2. **Instalar las dependencias:**
   ```bash
    npm install

3. **Configurar las credenciales (Opcional si deseas usar tu propia BD):**
      
      Abre el archivo src/infrastructure/firebase.js y asegúrate de que el objeto firebaseConfig tenga las credenciales válidas de un proyecto activo de Firebase.

4. **Ejecutar en entorno de desarrollo:**
   ```bash
    npx expo start -c

Nota: Presiona la tecla a en la terminal para abrir en el emulador de Android, o escanea el código QR con Expo Go desde tu celular.

## 📋 Guía de Pruebas (Evaluación de la Rúbrica)
Para comprobar el correcto funcionamiento de todos los requerimientos, sigue este flujo:

Prueba de Autenticación: Al iniciar la app, serás dirigido al Login. Usa el enlace inferior para ir al Registro. Crea una cuenta (ej. vendedor@artesanias.com / 123456). Inicia sesión.

Prueba API REST: Presiona "Nuevo Pedido". Verás un loader mientras el catálogo se descarga desde MockAPI. Las tarjetas mostrarán fotografías en alta definición y precios de artesanías.

Prueba SQLite (CRUD Local): Selecciona un producto, ingresa la cantidad del cliente y guarda el pedido. Aparecerá en tu pantalla principal con la etiqueta "⏳ Local". Toca el pedido para entrar al Detalle, cambia su estado a "En Proceso" y guarda. Todo esto ocurre sin necesidad de internet. Si cierras la app y la vuelves a abrir, el pedido seguirá ahí.

Prueba de Firestore (Nube): En el panel principal, presiona el botón "Sincronizar ☁️". El sistema se conectará a Firebase y la etiqueta del pedido cambiará a "✓ En Nube". Si editas el pedido nuevamente y vuelves a sincronizar, la app enviará una orden de actualización sin duplicar el registro en la base de datos de Firestore.

📦 Generación de APK
El proyecto está configurado para la compilación en la nube mediante Expo Application Services (EAS). El ejecutable .apk para Android se generó utilizando el siguiente comando:

eas build -p android --profile preview

Autor: Jeysson Fernando Perez Rafael

Programa: Desarrollo de Sistemas Front-End y Back-End (IDAT)

Ubicación: Huaraz, Perú - 2026
