import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigation/TabNavigation";

import Home from "./App/Screens/HomeScreen/Home";

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppLoading from "expo-app-loading";
import * as Font from 'expo-font';
import { useEffect, useState } from "react";
import MainNavigator from "./App/Navigation/TabNavigation";
import LoginScreen from "./App/Screens/LoginScreen/LoginScreen";
import { UserProvider, useUser } from "./App/Contexts/UserContext";
import { AuthGuard, PublicGuard } from "./App/Guards/Guards";



const AppContent = () => {
  const { isAuthenticated } = useUser();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {isAuthenticated ? <AuthGuard /> : <PublicGuard />}
    </View>
  );
};
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
        'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
 
  },
});
