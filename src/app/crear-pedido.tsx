import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { obtenerProductosAPI } from '../infrastructure/api';
import { agregarPedidoLocal } from '../infrastructure/database';
import { auth } from '../infrastructure/firebase';

export default function CrearPedidoScreen() {
  const router = useRouter();
  
  const [cliente, setCliente] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [cantidad, setCantidad] = useState('1');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState('Pendiente');

  const [productos, setProductos] = useState<any[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorAPI, setErrorAPI] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargandoProductos(true);
    setErrorAPI('');
    try {
      const data = await obtenerProductosAPI();
      setProductos(data);
      if (data.length > 0) {
        setProductoSeleccionado(data[0]);
        setPrecio(data[0].precio ? data[0].precio.toString() : '0.00');
      }
    } catch (err) {
      setErrorAPI('No se pudieron cargar los productos del catálogo.');
    } finally {
      setCargandoProductos(false);
    }
  };

  const handleGuardar = async () => {
    if (!cliente.trim() || !productoSeleccionado || !cantidad || !precio) {
      Alert.alert('Atención', 'Por favor completa todos los campos.');
      return;
    }

    setGuardando(true);
    try {
      const nuevoPedido = {
        cliente,
        producto: productoSeleccionado.nombre,
        cantidad: parseInt(cantidad, 10),
        precio: parseFloat(precio),
        estado,
        fecha: new Date().toISOString().split('T')[0],
        usuario_id: auth.currentUser?.uid || 'anonimo'
      };

      await agregarPedidoLocal(nuevoPedido);
      Alert.alert('Éxito', 'Pedido registrado localmente.');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el pedido en la base local.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="px-6 py-5 flex-row items-center border-b border-slate-200 bg-white shadow-sm mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-blue-600 font-bold text-lg">← Volver</Text>
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-slate-800">Nuevo Pedido</Text>
        </View>

        <View className="px-6">
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
            
            <Text className="text-slate-700 font-bold ml-1 mb-2 text-sm uppercase tracking-wider">
              Nombre del Cliente
            </Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 mb-6 text-slate-800 font-medium text-base"
              placeholder="Ej. Ana García"
              placeholderTextColor="#94a3b8"
              value={cliente}
              onChangeText={setCliente}
            />

            {/* Catálogo de Productos desde MockAPI */}
            <Text className="text-slate-700 font-bold ml-1 mb-3 text-sm uppercase tracking-wider">
              Seleccionar Producto
            </Text>
            
            {cargandoProductos ? (
              <View className="py-8 items-center bg-slate-50 rounded-2xl border border-slate-200 mb-6">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-slate-500 mt-2 font-medium">Cargando catálogo...</Text>
              </View>
            ) : errorAPI ? (
              <View className="mb-6 bg-rose-50 p-4 rounded-2xl border border-rose-200">
                <Text className="text-rose-600 text-sm font-medium mb-3 text-center">{errorAPI}</Text>
                <TouchableOpacity onPress={cargarProductos} className="bg-rose-600 py-3 rounded-xl">
                  <Text className="text-center font-bold text-white">Reintentar Conexión</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {productos.map((prod, index) => (
                  <TouchableOpacity
                    key={`prod-${index}`}
                    onPress={() => {
                      setProductoSeleccionado(prod);
                      if (prod.precio) setPrecio(prod.precio.toString());
                    }}
                    className={`mr-3 rounded-2xl overflow-hidden border-2 w-32 ${
                      productoSeleccionado?.id === prod.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {prod.imagen ? (
                      <Image 
                        source={{ uri: prod.imagen }} 
                        className="w-full h-24 bg-slate-200" 
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-24 bg-slate-200 items-center justify-center">
                        <Text className="text-slate-400">Sin foto</Text>
                      </View>
                    )}
                    <View className="p-3">
                      <Text 
                        className={`font-bold text-sm mb-1 ${productoSeleccionado?.id === prod.id ? 'text-blue-800' : 'text-slate-700'}`}
                        numberOfLines={1}
                      >
                        {prod.nombre}
                      </Text>
                      <Text className="text-slate-500 text-xs font-semibold">S/ {prod.precio}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View className="flex-row justify-between mb-6">
              <View className="w-[48%]">
                <Text className="text-slate-700 font-bold ml-1 mb-2 text-sm uppercase tracking-wider">Cantidad</Text>
                <TextInput
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold text-lg text-center"
                  keyboardType="numeric"
                  value={cantidad}
                  onChangeText={setCantidad}
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-slate-700 font-bold ml-1 mb-2 text-sm uppercase tracking-wider">Total (S/)</Text>
                <TextInput
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-blue-600 font-black text-lg text-center"
                  keyboardType="decimal-pad"
                  value={precio}
                  onChangeText={setPrecio}
                />
              </View>
            </View>

            <Text className="text-slate-700 font-bold ml-1 mb-3 text-sm uppercase tracking-wider">Estado Inicial</Text>
            <View className="flex-row justify-between mb-8">
              {['Pendiente', 'En proceso', 'Entregado'].map((est, index) => (
                <TouchableOpacity
                  key={`est-${index}`}
                  onPress={() => setEstado(est)}
                  className={`px-2 py-3 rounded-xl border flex-1 mx-1 items-center justify-center ${
                    estado === est ? 'bg-slate-800 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <Text className={estado === est ? 'text-white font-bold text-xs' : 'text-slate-600 font-medium text-xs'}>
                    {est}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-2xl shadow-sm shadow-blue-300"
              onPress={handleGuardar}
              disabled={guardando}
            >
              <Text className="text-white text-center font-bold text-lg tracking-wide">
                {guardando ? 'Guardando...' : 'Confirmar Pedido'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}