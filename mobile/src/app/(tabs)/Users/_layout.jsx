import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const UsersLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'none', 
      }}
    >
      <Stack.Screen name='index' />
    </Stack>
  )
}

export default UsersLayout