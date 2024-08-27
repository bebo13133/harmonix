import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '../Utils/Colors'
import Home from '../Screens/HomeScreen/Home';
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