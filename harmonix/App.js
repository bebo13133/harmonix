import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigation/TabNavigation";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppLoading from "expo-app-loading";
import * as Font from 'expo-font';
import { useEffect, useState } from "react";
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
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

    <View style={styles.container}>
      <StatusBar style="auto" />

      <GestureHandlerRootView style={{ flex: 1 }}>

        <NavigationContainer>
          <TabNavigation />
        </NavigationContainer>
      </GestureHandlerRootView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
 
  },
});
