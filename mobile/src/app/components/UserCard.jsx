import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function UserCard({ user, isInactive }) {
  const isAdmin = user.role === "admin";
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/Users/user-detail?id=${user.id}`)}
      className={`p-4 rounded-xl mb-3 flex-row items-center border ${
        isInactive 
          ? "bg-gray-100 border-transparent opacity-60" // 👈 ESTILO INACTIVO (Gris y opaco)
          : "bg-white shadow-sm border-gray-100"        // 👈 ESTILO ACTIVO (Blanco y sombra)
      }`}
    >
      {/* Avatar */}
      <View className={`h-14 w-14 rounded-full items-center justify-center mr-4 ${
        isInactive ? "bg-gray-200" : "bg-gray-100"
      }`}>
        <Text className={`text-xl font-bold ${isInactive ? "text-gray-400" : "text-gray-500"}`}>
          {user.full_name ? user.full_name.charAt(0).toUpperCase() : "?"}
        </Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text 
            className={`text-lg font-bold flex-1 mr-2 ${isInactive ? "text-gray-500" : "text-gray-800"}`} 
            numberOfLines={1}
          >
            {user.full_name || "Sin nombre"}
          </Text>
          
          {/* Badge Rol/Estado */}
          {isInactive ? (
             <View className="bg-gray-200 px-2 py-0.5 rounded-full">
               <Text className="text-[10px] font-bold uppercase text-gray-500">INACTIVO</Text>
             </View>
          ) : (
            <View className={`px-2 py-0.5 rounded-full ${isAdmin ? 'bg-purple-100' : 'bg-green-100'}`}>
              <Text className={`text-[10px] font-bold uppercase ${isAdmin ? 'text-purple-700' : 'text-green-700'}`}>
                {user.role || "DRIVER"}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-gray-400 text-sm mb-1" numberOfLines={1}>
          {user.email}
        </Text>
      </View>
    </TouchableOpacity>
  );
}