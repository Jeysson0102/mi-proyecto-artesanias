import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { obtenerProductosAPI } from '../../infrastructure/api';
import {
  actualizarPedidoLocal,
  eliminarPedidoLocal,
  obtenerPedidoPorId
} from '../../infrastructure/database';
import { db } from '../../infrastructure/firebase';

export default function EditarPedidoScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [pedidoOriginal, setPedidoOriginal] = useState<any>(null);
  
  // Estados Editables
  const [cliente, setCliente] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState('');

  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDatosCompletos();
  }, [id]);

  const cargarDatosCompletos = async () => {
    try {
      // 1. Cargamos el catálogo de la API
      const catalogo = await obtenerProductosAPI();
      setProductos(catalogo);

      // 2. Cargamos el pedido de SQLite
      const dataPedido = await obtenerPedidoPorId(Number(id));
      
      if (dataPedido) {
        setPedidoOriginal(dataPedido);
        setCliente(dataPedido.cliente);
        setCantidad(dataPedido.cantidad.toString());
        setPrecio(dataPedido.precio.toString());
        setEstado(dataPedido.estado);

        // Buscamos la foto del producto en el catálogo
        const prodEncontrado = catalogo.find((p: any) => p.nombre === dataPedido.producto);
        setProductoSeleccionado(prodEncontrado || { nombre: dataPedido.producto });
      } else {
        Alert.alert('Error', 'El pedido no existe.');
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al cargar los datos.');
    } finally {
      setCargando(false);
    }
  };

  const handleActualizar = async () => {
    if (!cliente.trim() || !productoSeleccionado || !cantidad || !precio) {
      Alert.alert('Atención', 'Ningún campo puede quedar vacío.');
      return;
    }

    setProcesando(true);
    try {
      const pedidoActualizado = {
        ...pedidoOriginal,
        cliente,
        producto: productoSeleccionado.nombre,
        cantidad: parseInt(cantidad, 10),
        precio: parseFloat(precio),
        estado
      };

      await actualizarPedidoLocal(pedidoActualizado);
      Alert.alert('Éxito', 'Pedido actualizado correctamente. Aparecerá como "Local" hasta que lo sincronices.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el pedido.');
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminar = () => {
    Alert.alert(
      "Eliminar Pedido",
      "¿Deseas borrar esta orden de forma permanente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            setProcesando(true);
            try {
              if (pedidoOriginal.firestore_id) {
                await deleteDoc(doc(db, 'pedidos', pedidoOriginal.firestore_id));
              }
              await eliminarPedidoLocal(Number(id));
              Alert.alert('Eliminado', 'El pedido fue borrado de tu celular y de la nube.');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Hubo un problema al eliminar el pedido.');
            } finally {
              setProcesando(false);
            }
          } 
        }
      ]
    );
  };

  if (cargando) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 py-5 flex-row items-center border-b border-slate-200 bg-white shadow-sm mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-blue-600 font-bold text-lg">← Volver</Text>
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-slate-800">Editar Pedido #{id}</Text>
        </View>

        <View className="px-6">
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
            
            <Text className="text-slate-700 font-bold ml-1 mb-2 text-sm uppercase tracking-wider">Cliente</Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 mb-6 text-slate-800 font-medium text-base"
              value={cliente}
              onChangeText={setCliente}
            />

            <Text className="text-slate-700 font-bold ml-1 mb-3 text-sm uppercase tracking-wider">Producto (Catálogo)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              {productos.map((prod, index) => (
                <TouchableOpacity
                  key={`edit-prod-${index}`}
                  onPress={() => {
                    setProductoSeleccionado(prod);
                    if (prod.precio) setPrecio(prod.precio.toString());
                  }}
                  className={`mr-3 rounded-2xl overflow-hidden border-2 w-32 ${
                    productoSeleccionado?.nombre === prod.nombre
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {prod.imagen ? (
                    <Image source={{ uri: prod.imagen }} className="w-full h-24 bg-slate-200" resizeMode="cover" />
                  ) : (
                    <View className="w-full h-24 bg-slate-200 items-center justify-center">
                      <Text className="text-slate-400">Sin foto</Text>
                    </View>
                  )}
                  <View className="p-3">
                    <Text className={`font-bold text-sm mb-1 ${productoSeleccionado?.nombre === prod.nombre ? 'text-blue-800' : 'text-slate-700'}`} numberOfLines={1}>
                      {prod.nombre}
                    </Text>
                    <Text className="text-slate-500 text-xs font-semibold">S/ {prod.precio}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

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

            <Text className="text-slate-700 font-bold ml-1 mb-3 text-sm uppercase tracking-wider">Estado</Text>
            <View className="flex-row justify-between mb-8">
              {['Pendiente', 'En proceso', 'Entregado', 'Cancelado'].map((est, index) => (
                <TouchableOpacity
                  key={`edit-est-${index}`}
                  onPress={() => setEstado(est)}
                  className={`px-1 py-3 rounded-xl border flex-1 mx-1 items-center justify-center ${
                    estado === est ? 'bg-slate-800 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <Text className={estado === est ? 'text-white font-bold text-[10px]' : 'text-slate-600 font-medium text-[10px]'}>
                    {est}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-2xl shadow-sm shadow-blue-300 mb-4"
              onPress={handleActualizar}
              disabled={procesando}
            >
              <Text className="text-white text-center font-bold text-lg tracking-wide">
                {procesando ? 'Guardando...' : 'Guardar Cambios'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-rose-50 py-4 rounded-2xl border border-rose-200"
              onPress={handleEliminar}
              disabled={procesando}
            >
              <Text className="text-rose-600 text-center font-bold tracking-wide">Eliminar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}