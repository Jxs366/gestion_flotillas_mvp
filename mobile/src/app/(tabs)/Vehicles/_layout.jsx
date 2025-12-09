import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const VehiclesLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='create-vehicle' options={{ title: 'Crear Vehículo' }} />
    </Stack>
  )
}

export default VehiclesLayout