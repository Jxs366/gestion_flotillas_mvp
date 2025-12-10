import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function RegisterUserScreen() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  // Estado para el rol, por defecto 'driver'
  const [selectedRole, setSelectedRole] = React.useState("driver");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onRegisterPress = async () => {
    if (isSubmitting) return;

    if (!emailAddress) {
      Alert.alert("Error", "El correo es obligatorio");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = await getToken();


      // ⚠️ IMPORTANTE: REEMPLAZA CON TU URL DE NGROK ACTUAL
      const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/users/invite`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true", // Header para ngrok
        },
        body: JSON.stringify({ 
          email: emailAddress,
          fullName: fullName, // Enviamos el nombre por si el backend lo quiere guardar en logs
          role: selectedRole  // Enviamos el rol seleccionado
        }),
      });

      const data = await response.json(); // Ahora sí esperamos JSON seguro

      if (response.ok) {
        Alert.alert(
          "Invitación Enviada", 
          `Se ha invitado al usuario como ${selectedRole === 'driver' ? 'Conductor' : 'Administrador'}.`,
          [{ text: "Entendido", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Error", data.message || "No se pudo enviar la invitación");
      }

    } catch (err) {
      console.error(err);
      Alert.alert("Error de Conexión", "Revisa tu conexión o la URL del servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6">
          
          <Text className="mt-2 text-3xl font-semibold text-white">
            Invitar Usuario
          </Text>
          <Text className="mt-2 text-white/70">
            Envía una invitación para que el usuario se registre y configure su contraseña.
          </Text>

          {/* Input Nombre */}
          <View className="mt-8">
            <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
              Nombre (Referencia)
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#94a3b8"
              autoCapitalize="words"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
            />
          </View>

          {/* Input Email */}
          <View className="mt-6">
            <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
              Correo electrónico
            </Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              placeholder="nombre@empresa.com"
              placeholderTextColor="#94a3b8"
              onChangeText={(text) => setEmailAddress(text.trim())}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
            />
          </View>

          {/* SELECTOR DE ROL */}
          <View className="mt-6">
            <Text className="text-sm font-medium uppercase tracking-wide text-white/60 mb-3">
              Asignar Rol
            </Text>
            <View className="flex-row gap-4">
              {/* Botón Driver */}
              <TouchableOpacity 
                onPress={() => setSelectedRole('driver')}
                activeOpacity={0.8}
                className={`flex-1 py-4 rounded-xl border ${
                  selectedRole === 'driver' 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <Text className={`text-center font-bold text-base ${
                  selectedRole === 'driver' ? 'text-white' : 'text-white/60'
                }`}>
                  Conductor
                </Text>
              </TouchableOpacity>

              {/* Botón Admin */}
              <TouchableOpacity 
                onPress={() => setSelectedRole('admin')}
                activeOpacity={0.8}
                className={`flex-1 py-4 rounded-xl border ${
                  selectedRole === 'admin' 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <Text className={`text-center font-bold text-base ${
                  selectedRole === 'admin' ? 'text-white' : 'text-white/60'
                }`}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="mt-2 text-xs text-white/40 text-center">
              {selectedRole === 'driver' 
                ? 'Se creará un registro de conductor en la base de datos.' 
                : 'El usuario tendrá acceso total al panel.'}
            </Text>
          </View>

          {/* Botón Enviar */}
          <TouchableOpacity
            onPress={onRegisterPress}
            disabled={isSubmitting}
            activeOpacity={0.85}
            className={`mt-10 w-full rounded-2xl py-4 shadow-lg shadow-emerald-500/30 ${
              isSubmitting ? "bg-emerald-500/50" : "bg-emerald-500"
            }`}
          >
            <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
              {isSubmitting ? "Enviando..." : "Enviar Invitación"}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}