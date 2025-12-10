import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert } from "react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  
  // Estados para el manejo del código de seguridad (MFA)
  const [code, setCode] = React.useState("");
  const [isSecondFactor, setIsSecondFactor] = React.useState(false);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // --- PASO 1: ENVIAR CREDENCIALES Y SOLICITAR CÓDIGO ---
  const onSignInPress = async () => {
    if (!isLoaded || isSubmitting) return;

    // Si estamos en paso 1, validamos email/pass
    if (!isSecondFactor && (!emailAddress || !password)) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Enviamos usuario y contraseña
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        // Login exitoso directo (sin 2FA)
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
        
      } else if (signInAttempt.status === "needs_second_factor") {
        // 2. DETECTAMOS QUE SE REQUIERE CÓDIGO
        
        // Buscamos el ID del factor de email para decirle a Clerk que lo use
        const emailFactor = signInAttempt.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code"
        );

        if (emailFactor) {
          // 3. ¡IMPORTANTE! Forzamos el envío del correo
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailFactor.emailAddressId,
          });

          setIsSecondFactor(true);
          Alert.alert("Verificación", "Hemos enviado un código de seguridad a tu correo.");
        } else {
          Alert.alert("Error de Seguridad", "Tu cuenta pide un segundo paso, pero no se encontró el método de email.");
          console.error("Factores disponibles:", JSON.stringify(signInAttempt.supportedSecondFactors, null, 2));
        }

      } else {
        Alert.alert("Atención", "Estado del login: " + signInAttempt.status);
      }

    } catch (err) {
      console.log("Error Login:", JSON.stringify(err, null, 2));
      const errorMessage = err.errors ? err.errors[0].longMessage : err.message;
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PASO 2: VERIFICAR EL CÓDIGO INGRESADO ---
  const onVerifyPress = async () => {
    if (!isLoaded || !code) {
      Alert.alert("Error", "Por favor ingresa el código.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else {
        Alert.alert("Error", "El código es incorrecto o el estado es: " + attempt.status);
      }
      
    } catch (err) {
      console.log("Error Código:", JSON.stringify(err, null, 2));
      const errorMessage = err.errors ? err.errors[0].longMessage : "Código inválido";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        className="flex-1"
      >
        <View className="flex-1 px-6 pb-12 pt-16">
          <Text className="text-sm uppercase tracking-wide text-white/60">
            Control vehicular
          </Text>
          
          <Text className="mt-2 text-4xl font-semibold text-white">
            {isSecondFactor ? "Verificación" : "Bienvenido de vuelta"}
          </Text>
          
          <Text className="mt-3 text-white/70">
            {isSecondFactor 
              ? `Ingresa el código enviado a ${emailAddress}`
              : "Ingresa tus credenciales para continuar monitoreando tu flota."
            }
          </Text>

          <View className="mt-10 gap-6">
            
            {/* --- VISTA 1: INPUTS NORMALES --- */}
            {!isSecondFactor && (
              <>
                <View>
                  <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                    Correo electrónico
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={emailAddress}
                    placeholder="nombre@empresa.com"
                    placeholderTextColor="#94a3b8"
                    onChangeText={(value) => setEmailAddress(value.trim())}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                    Contraseña
                  </Text>
                  <TextInput
                    value={password}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    onChangeText={(value) => setPassword(value)}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white"
                  />
                </View>
              </>
            )}

            {/* --- VISTA 2: INPUT DE CÓDIGO --- */}
            {isSecondFactor && (
              <View>
                <Text className="text-sm font-medium uppercase tracking-wide text-white/60">
                  Código de Seguridad
                </Text>
                <TextInput
                  value={code}
                  placeholder="123456"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={6}
                  onChangeText={(value) => setCode(value)}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white text-center tracking-widest font-bold"
                />
              </View>
            )}

          </View>

          {/* BOTÓN PRINCIPAL (Cambia función según el paso) */}
          <TouchableOpacity
            onPress={isSecondFactor ? onVerifyPress : onSignInPress}
            disabled={isSubmitting}
            activeOpacity={0.85}
            className={`mt-10 w-full rounded-2xl py-4 shadow-lg shadow-emerald-500/30 ${
              isSubmitting ? "bg-emerald-500/50" : "bg-emerald-500"
            }`}
          >
            <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
              {isSubmitting 
                ? "Procesando..." 
                : (isSecondFactor ? "Verificar Dispositivo" : "Continuar")
              }
            </Text>
          </TouchableOpacity>
          
          {/* BOTONES SECUNDARIOS (Reenviar / Volver) */}
          {isSecondFactor && (
             <View className="mt-6 gap-4">
                <TouchableOpacity onPress={onSignInPress} disabled={isSubmitting}>
                    <Text className="text-center text-emerald-500 font-medium">
                        ¿No llegó el correo? Reenviar código
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setIsSecondFactor(false);
                    setIsSubmitting(false);
                }}>
                    <Text className="text-center text-white/50">Cancelar y volver</Text>
                </TouchableOpacity>
             </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}