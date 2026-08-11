import { useFocusEffect, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  marcarComoSincronizado,
  obtenerPedidosLocales,
  obtenerPedidosNoSincronizados
} from '../infrastructure/database';
import { auth, db } from '../infrastructure/firebase';

export default function PantallaDeInicio() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [sincronizando, setSincronizando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserEmail(user.email || '');
          setUserId(user.uid);
          setIsReady(true);
          cargarPedidos(user.uid);
        } else {
          router.replace('/login');
        }
      });
      return unsubscribe;
    }, [])
  );

  const cargarPedidos = async (uid: string) => {
    try {
      const historial = await obtenerPedidosLocales(uid);
      setPedidos(historial);
    } catch (error) {
      console.error("Error al cargar pedidos locales:", error);
    }
  };

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      const pendientes = await obtenerPedidosNoSincronizados();
      
      if (pendientes.length === 0) {
        Alert.alert('Al día', 'Todos los pedidos ya están en Firebase.');
        setSincronizando(false);
        return;
      }

      for (const pedido of pendientes) {
        const pedidoData = {
          cliente: pedido.cliente,
          producto: pedido.producto,
          cantidad: pedido.cantidad,
          precio: pedido.precio,
          estado: pedido.estado,
          fecha: pedido.fecha,
          usuario_id: pedido.usuario_id
        };

        if (pedido.firestore_id) {
          const docRef = doc(db, 'pedidos', pedido.firestore_id);
          await updateDoc(docRef, pedidoData);
          await marcarComoSincronizado(pedido.id, pedido.firestore_id);
        } else {
          const docRef = await addDoc(collection(db, 'pedidos'), pedidoData);
          await marcarComoSincronizado(pedido.id, docRef.id);
        }
      }

      Alert.alert('Sincronización Exitosa', `${pendientes.length} pedidos actualizados en la nube.`);
      cargarPedidos(userId); 
    } catch (error) {
      Alert.alert('Error', 'Comprueba tu conexión a internet.');
      console.error(error);
    } finally {
      setSincronizando(false);
    }
  };

  if (!isReady) return <SafeAreaView className="flex-1 bg-[#F8FAFC]" />;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="bg-white px-6 py-5 border-b border-slate-200 shadow-sm z-10 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-extrabold text-slate-800 tracking-tight">Mis Pedidos</Text>
          <Text className="text-slate-500 font-medium text-xs mt-1">Sincronización Inteligente</Text>
        </View>
        
        {/* Avatar que lleva al perfil */}
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center shadow-sm">
            <Text className="text-white font-extrabold text-lg">
              {userEmail.charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between px-6 py-5">
        <TouchableOpacity 
          className="bg-blue-600 px-4 py-4 rounded-2xl w-[48%] shadow-sm shadow-blue-200"
          onPress={() => router.push('/crear-pedido')}
        >
          <Text className="text-white font-bold text-center text-base tracking-wide">Nuevo Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`px-4 py-4 rounded-2xl w-[48%] shadow-sm justify-center ${sincronizando ? 'bg-slate-500' : 'bg-slate-800'}`}
          onPress={handleSincronizar}
          disabled={sincronizando}
        >
          {sincronizando ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-center text-base tracking-wide">Sincronizar ☁️</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-12 items-center">
            <Text className="text-slate-400 text-lg font-medium">Aún no tienes pedidos.</Text>
            <Text className="text-slate-400 text-sm mt-1">Presiona "Nuevo Pedido" para comenzar.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push(`/pedido/${item.id}`)}
            className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-slate-100 flex-row justify-between items-center"
          >
            <View className="flex-1 pr-4">
              <Text className="font-extrabold text-slate-800 text-lg mb-1">{item.cliente}</Text>
              <Text className="text-slate-500 font-medium mb-2">{item.producto}  <Text className="font-bold text-slate-700">x{item.cantidad}</Text></Text>
              <Text className="text-blue-600 font-black text-lg">S/ {item.precio.toFixed(2)}</Text>
            </View>
            <View className="items-end justify-between h-full py-1">
              <View className={`px-3 py-1.5 rounded-lg mb-4 border ${
                item.estado === 'Entregado' ? 'bg-emerald-50 border-emerald-200' : 
                item.estado === 'Cancelado' ? 'bg-rose-50 border-rose-200' : 
                'bg-amber-50 border-amber-200'
              }`}>
                <Text className={`text-xs font-black uppercase ${
                  item.estado === 'Entregado' ? 'text-emerald-600' : 
                  item.estado === 'Cancelado' ? 'text-rose-600' : 
                  'text-amber-600'
                }`}>
                  {item.estado}
                </Text>
              </View>
              {item.sincronizado === 1 ? (
                <Text className="text-xs text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-md">✓ En Nube</Text>
              ) : (
                <Text className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-md">⏳ Local</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}