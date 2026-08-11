import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../infrastructure/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Datos incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/'); 
    } catch (error) {
      Alert.alert('Acceso Denegado', 'Credenciales incorrectas o el usuario no existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8"
      >
        <View className="items-center mb-12">
          <View className="bg-blue-600 w-24 h-24 rounded-3xl items-center justify-center mb-6 shadow-md shadow-blue-300">
            <Text className="text-white text-4xl font-extrabold tracking-tighter">AE</Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Artesanías Express
          </Text>
          <Text className="text-slate-500 mt-2 text-center text-base">
            Gestión de pedidos offline y en la nube
          </Text>
        </View>

        <View className="bg-white px-6 py-8 rounded-3xl shadow-sm border border-slate-100">
          <Text className="text-slate-700 font-bold ml-1 mb-2 text-sm uppercase tracking-wider">
            Correo Electrónico
          </Text>
          <TextInput
            className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 mb-5 text-slate-800 font-medium text-base"
            placeholder="vendedor@artesanias.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-slate-700 font-bold ml-1 mb-2 text-sm uppercase tracking-wider">
            Contraseña
          </Text>
          <TextInput
            className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 mb-8 text-slate-800 font-medium text-base"
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            className={`rounded-2xl py-4 mb-6 shadow-sm ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-center text-white font-bold text-lg">
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-slate-500 font-medium">¿Nuevo vendedor? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-blue-600 font-bold text-base">Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}