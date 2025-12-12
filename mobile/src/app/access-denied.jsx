// src/app/access-denied.jsx
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AccessDeniedScreen() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <View className="items-center">
        <View className="h-24 w-24 bg-red-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="lock-closed" size={48} color="#ef4444" />
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
          Acceso Restringido
        </Text>
        
        <Text className="text-gray-500 text-center mb-8 leading-6">
          Tu cuenta ha sido desactivada temporalmente por el administrador. 
          Si crees que es un error, por favor contacta a soporte.
        </Text>

        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-gray-900 w-full py-4 rounded-xl shadow-lg"
        >
          <Text className="text-white text-center font-bold font-lg">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}