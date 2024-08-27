import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Colors from "./App/Utils/Colors";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigation/TabNavigation";
import Home from "./App/Screens/HomeScreen/Home";
export default function App() {
  return (
    <View style={styles.container}>
      <Home/>

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
