import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AntDesign } from '@expo/vector-icons';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="user" size={32} color={focused ?  Colors[colorScheme ?? 'light'].tint : "#000"} />
          ),
        }}
      />
      <Tabs.Screen
        name="aksiyon"
        options={{
          title: 'Aksiyon',
          tabBarIcon: ({ color, focused }) => (
            <Image source={require('./4.png')} style={styles.logo} />
          ),
        }}
      />
    </Tabs>
    
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 30,
    height: 30,
    marginRight: 0,
  }
});
