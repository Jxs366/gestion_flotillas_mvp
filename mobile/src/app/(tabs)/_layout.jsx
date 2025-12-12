import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStatusCheck } from "../../hooks/useUserStatus"; // 👈 1. Importamos el hook de seguridad

export default function TabsLayout() {
  
  // 👈 2. Ejecutamos el hook aquí.
  // Esto verificará silenciosamente el estado del usuario.
  // Si está "inactive", lo mandará a /access-denied automáticamente.
  useUserStatusCheck();

  return (
    <Tabs
      screenOptions={{
        // 3. Actualizamos colores para coincidir con el diseño "Light Mode" (Naranja/Blanco)
        tabBarActiveTintColor: "#ff6600", // Naranja
        tabBarInactiveTintColor: "#9ca3af", // Gris suave
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 10,
        },
        headerShown: false, // Ocultamos el header por defecto en todos los tabs
      }}
    >
      {/* Tab 1: Inicio */}
      <Tabs.Screen
        name="(home)" // Coincide con la carpeta '(home)'
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab 2: Vehículos */}
      <Tabs.Screen
        name="Vehicles" // Coincide con la carpeta 'Vehicles'
        options={{
          title: "Vehículos",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "car" : "car-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab 3: Áreas */}
      <Tabs.Screen
        name="Areas" // Coincide con la carpeta 'Areas'
        options={{
          title: "Áreas",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "map" : "map-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab 4: Usuarios */}
      <Tabs.Screen
        name="Users" // Coincide con la carpeta 'Users'
        options={{
          title: "Usuarios",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}