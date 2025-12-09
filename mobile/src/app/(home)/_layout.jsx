import { Tabs } from 'expo-router'
import { Stack } from 'expo-router/stack'

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name='index' options={{headerShown: false}}/>
      <Tabs.Screen name='vehicles' options={{headerShown: false}}/>
    </Tabs>
  )
}