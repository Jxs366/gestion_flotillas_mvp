import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de tener iconos instalados

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2f95dc" }}>
      <Tabs.Screen
        name="(home)" // Coincide con la carpeta 'home'
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          headerShown: false, // Opcional: Oculta el header superior si ya tienes uno en la pantalla
        }}
      />

      {/* Tab 2: Vehículos */}
      <Tabs.Screen
        name="Vehicles" // Coincide con la carpeta 'vehicles'
        options={{
          title: "Vehículos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="car" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />

      {/* Tab 3: Áreas */}
      <Tabs.Screen
        name="Areas" // Coincide con la carpeta 'areas'
        options={{
          title: "Áreas",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />

      {/* Tab 4: Usuarios */}
      <Tabs.Screen
        name="Users" // Coincide con la carpeta 'users'
        options={{
          title: "Usuarios",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}



