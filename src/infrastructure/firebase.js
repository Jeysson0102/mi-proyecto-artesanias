import { initializeApp } from 'firebase/app';
// Cambiamos la forma de importar la autenticación
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHgV9ZWwijfuU8NPjNScNXE-Bnws9AM_4",
  authDomain: "artesanias-express-22e7b.firebaseapp.com",
  projectId: "artesanias-express-22e7b",
  storageBucket: "artesanias-express-22e7b.firebasestorage.app",
  messagingSenderId: "693723633593",
  appId: "1:693723633593:web:b1fd669b880cb3c92b0868"
};

const app = initializeApp(firebaseConfig);

// Inicializamos la autenticación indicándole que use AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);