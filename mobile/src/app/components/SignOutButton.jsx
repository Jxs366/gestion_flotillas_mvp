import { useClerk } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { Text, TouchableOpacity } from "react-native"

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      router.replace('/')
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      activeOpacity={0.85}
      className="mt-10 w-full rounded-2xl bg-red-500/90 py-4 shadow-lg shadow-red-500/30"
    >
      <Text className="text-center text-base font-semibold text-white uppercase tracking-wide">
        Cerrar sesión
      </Text>
    </TouchableOpacity>
  )
} 