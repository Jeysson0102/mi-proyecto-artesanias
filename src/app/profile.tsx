import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../infrastructure/firebase';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  
  // Obtenemos la primera letra del correo para el Avatar
  const inicial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="px-6 py-5 flex-row items-center border-b border-slate-200 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-blue-600 font-bold text-lg">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-800">Mi Perfil</Text>
      </View>

      <View className="px-6 mt-8 items-center">
        {/* Avatar Realista */}
        <View className="w-32 h-32 bg-blue-600 rounded-full items-center justify-center border-4 border-white shadow-lg mb-6">
          <Text className="text-white text-5xl font-black tracking-tighter">{inicial}</Text>
        </View>

        <Text className="text-2xl font-extrabold text-slate-800 mb-1">
          Vendedor Autorizado
        </Text>
        <Text className="text-slate-500 font-medium text-base mb-8">
          {user?.email}
        </Text>

        <View className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
          <Text className="text-slate-800 font-bold text-lg mb-4">Detalles de Cuenta</Text>
          
          <View className="flex-row justify-between py-3 border-b border-slate-100">
            <Text className="text-slate-500 font-medium">Estado</Text>
            <Text className="text-emerald-600 font-bold">Activo</Text>
          </View>
          
          <View className="flex-row justify-between py-3 border-b border-slate-100">
            <Text className="text-slate-500 font-medium">Sincronización</Text>
            <Text className="text-slate-800 font-bold">Automática a Firebase</Text>
          </View>

          <View className="flex-row justify-between py-3">
            <Text className="text-slate-500 font-medium">Base de Datos</Text>
            <Text className="text-slate-800 font-bold">SQLite Local</Text>
          </View>
        </View>

        <TouchableOpacity
          className="w-full bg-rose-50 py-4 rounded-2xl border border-rose-200 shadow-sm"
          onPress={handleLogout}
        >
          <Text className="text-rose-600 text-center font-bold text-lg tracking-wide">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}