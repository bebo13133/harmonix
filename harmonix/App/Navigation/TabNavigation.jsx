import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../Utils/Colors';
import Home from '../Screens/HomeScreen/Home';
import Header from '../Screens/Header/Header';
import { HealthSafetyInspections } from '../Screens/BookingScreen/HealthSafetyInspections';
import ProfileSettings from '../Screens/Profile/ProfileSettings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const selectFont = (options = {}) => {
  const ios = Platform.OS === 'ios';
  return {
    fontFamily: ios
      ? options.bold
        ? 'System'
        : 'System'
      : options.bold
      ? 'Roboto-Bold'
      : 'Roboto-Regular',
    fontWeight: options.bold ? 'bold' : 'normal',
  };
};

function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen 
        name="home" 
        component={Home} 
        options={{
          tabBarLabel: ({color}) => (
            <Text style={[styles.tabBarLabel, {color}]}>Home</Text>
          ),
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="HealthSafety" 
        component={HealthSafetyInspections}
        options={{
          tabBarLabel: ({color}) => (
            <Text style={[styles.tabBarLabel, {color}]}>Health Safety</Text>
          ),
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="book" size={size} color={color} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    ...selectFont(),
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    ...selectFont({ bold: false }),
    fontSize: 12,
    marginTop: -7,
  },
});

