import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Colors from "./App/Utils/Colors";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigation/TabNavigation";
<<<<<<< Updated upstream
import Home from "./App/Screens/HomeScreen/Home";
=======
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppLoading from "expo-app-loading";
import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import MainNavigator from "./App/Navigation/TabNavigation";
>>>>>>> Stashed changes
export default function App() {
  return (
    <View style={styles.container}>
<<<<<<< Updated upstream
      <Home/>
=======
      <StatusBar style="auto" />

      <GestureHandlerRootView style={{ flex: 1 }}>

        <NavigationContainer>
          {/* <TabNavigation /> */}
          <MainNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
>>>>>>> Stashed changes

      {/* <NavigationContainer>
        <TabNavigation />
      </NavigationContainer> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
