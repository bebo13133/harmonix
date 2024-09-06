import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import AppLoading from "expo-app-loading";
import * as Font from 'expo-font';
import { useEffect, useState } from "react";

import { UserProvider, useUser } from "./App/Contexts/UserContext";
import { AuthGuard, PublicGuard } from "./App/Guards/Guards";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
      
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
    <UserProvider>
      <AppContent />
    </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
 
  },
});
