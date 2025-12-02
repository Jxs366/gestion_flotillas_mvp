import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SignOutButton } from "../components/SignOutButton"

export default function Page() {
  const { user } = useUser()

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-16 pt-16"
        showsVerticalScrollIndicator={false}
      >
        <SignedIn>
          <View className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <Text className="text-sm uppercase tracking-wide text-white/60">
              Bienvenido
            </Text>
            <Text className="mt-2 text-3xl font-semibold text-white">
              {user?.firstName || "Conductor"}
            </Text>
            <Text className="mt-2 text-white/70">
              {user?.emailAddresses?.[0]?.emailAddress}
            </Text>
            <Text className="mt-6 text-base text-white/80">
              Gestiona tu flota, registra nuevos vehículos y mantén tus datos
              al día desde una sola vista.
            </Text>
          </View>

          <View className="mt-10 gap-4">
            <Link href="/Vehicles" push asChild>
              <TouchableOpacity className="w-full rounded-2xl bg-emerald-500 py-4 shadow-lg shadow-emerald-500/30">
                <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                  Ver Vehículos
                </Text>
              </TouchableOpacity>
            </Link>
            <Link href="/Vehicles/create-vehicle" push asChild>
              <TouchableOpacity className="w-full rounded-2xl border border-white/15 bg-transparent py-4">
                <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                  Registrar Vehículo
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <SignOutButton />
        </SignedIn>

        <SignedOut>
          <View className="rounded-3xl border border-white/15 bg-white/5 p-6">
            <Text className="text-3xl font-semibold text-white">
              Control Vehicular
            </Text>
            <Text className="mt-3 text-white/70">
              Inicia sesión para comenzar a registrar y consultar tus vehículos.
            </Text>
            <View className="mt-8 gap-4">
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity className="w-full rounded-2xl bg-emerald-500 py-4 shadow-lg shadow-emerald-500/30">
                  <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                    Iniciar sesión
                  </Text>
                </TouchableOpacity>
              </Link>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity className="w-full rounded-2xl border border-white/15 bg-transparent py-4">
                  <Text className="text-center text-base font-semibold uppercase tracking-wide text-white">
                    Crear cuenta
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </SignedOut>
      </ScrollView>
    </SafeAreaView>
  )
}