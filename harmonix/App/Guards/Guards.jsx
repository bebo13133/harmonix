import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainNavigator from '../Navigation/TabNavigation';
import LoginScreen from '../Screens/LoginScreen/LoginScreen';
import LoginForm from '../Screens/LoginScreen/LoginForm';


const Stack = createStackNavigator();

export const PublicGuard = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="LoginForm" component={LoginForm} />
    </Stack.Navigator>
  </NavigationContainer>
);

export const AuthGuard = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  </GestureHandlerRootView>
);