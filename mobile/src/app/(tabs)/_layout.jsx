import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStatusCheck } from "../../hooks/useUserStatus";
export default function TabsLayout() {
  useUserStatusCheck();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff6600",
        tabBarInactiveTintColor: "#9ca3af",
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
        headerShown: false,
      }}
    >
      {/* Tab 1: Inicio */}
      <Tabs.Screen
        name="(home)"
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
        name="Vehicles"
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
        name="Areas"
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
        name="Users"
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