<<<<<<< Updated upstream
import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

=======
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
>>>>>>> Stashed changes
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../Utils/Colors';
import Home from '../Screens/HomeScreen/Home';
<<<<<<< Updated upstream
const Tab = createBottomTabNavigator()
export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:Colors.PRIMARY
    }}>
     <Tab.Screen name="home" component={Home} 
     options={{
        tabBarLabel: ({color})=>(
           <Text style={{color:color, fontSize:12, marginTop:-7,}}>Home</Text>
        ),
        tabBarIcon: ({color,size})=>(
<FontAwesome name="home" size={size} color={color} />
        )
     }}
     />
     {/* <Tab.Screen name="booking" component={BookingScreen}
     options={{
        tabBarLabel: ({color})=>(
           <Text style={{color:color, fontSize:12, marginTop:-7}}>Booking</Text>
        ),
        tabBarIcon: ({color,size})=>(
<FontAwesome name="book" size={size} color={color} />
        )
     }} />
     <Tab.Screen name="profile" component={ProfileScreen} 
     options={{
        tabBarLabel: ({color})=>(
           <Text style={{color:color, fontSize:12, marginTop:-7}}>Profile</Text>
        ),
        tabBarIcon: ({color,size})=>(
<MaterialCommunityIcons name="face-man-profile" size={size} color={color} />
        )
     }}/> */}
    </Tab.Navigator>
  )
}
=======
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
>>>>>>> Stashed changes
