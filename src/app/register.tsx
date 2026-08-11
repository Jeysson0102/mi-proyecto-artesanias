import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../infrastructure/firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Éxito', 'Cuenta creada correctamente');
      router.replace('/'); // Redirige al Home al terminar
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear la cuenta. Intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center px-8 bg-gray-100">
      <View className="bg-white p-6 rounded-2xl shadow-sm">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
          Registro
        </Text>

        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-gray-800"
          placeholder="Contraseña (mínimo 6 caracteres)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          className="bg-green-600 rounded-xl py-4 mb-4"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-center text-white font-bold text-lg">
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-center text-gray-500 font-semibold">
            Volver al Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}