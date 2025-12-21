import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const UsersLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Puedes poner esto aquí para que aplique a todas
        animation: 'none',  // Esta es la clave para quitar la animación
      }}
    >
      <Stack.Screen name='index' />
    </Stack>
  )
}

export default UsersLayout