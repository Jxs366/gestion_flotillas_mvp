import { useSignIn } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import React from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onSignInPress = async () => {
    if (!isLoaded || isSubmitting) return

    try {
      setIsSubmitting(true)
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace("/")
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsSubmitting(false)
    }
  }

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
            Bienvenido de vuelta
          </Text>
          <Text className="mt-3 text-white/70">
            Ingresa tus credenciales para continuar monitoreando tu flota.
          </Text>

          <View className="mt-10 gap-6">
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
          </View>

          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isSubmitting}
            activeOpacity={0.85}
            className={`mt-10 w-full rounded-2xl py-4 shadow-lg shadow-emerald-500/30 ${
              isSubmitting ? "bg-emerald-500/50" : "bg-emerald-500"
            }`}
          >
            <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
              {isSubmitting ? "Ingresando..." : "Continuar"}
            </Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row justify-center gap-2">
            <Text className="text-white/70">¿Aún no tienes cuenta?</Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="font-semibold text-emerald-400">Regístrate</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}