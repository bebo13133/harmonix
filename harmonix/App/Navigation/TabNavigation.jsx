import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../Utils/Colors';
import Home from '../Screens/HomeScreen/Home';

import Header from '../Screens/Header/Header';
import { HealthSafetyInspections } from '../Screens/BookingScreen/HealthSafetyInspections';

const Tab = createBottomTabNavigator();

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

export default function TabNavigation() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
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