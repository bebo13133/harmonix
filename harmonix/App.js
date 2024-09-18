import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import { useCallback, useEffect, useState } from 'react';
import { UserProvider, useUser } from './App/Contexts/UserContext';
import { AuthGuard, PublicGuard } from './App/Guards/Guards';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { TestProvider } from './App/Contexts/TestContext';
import { DatabaseProvider } from './App/Contexts/databaseContext';

// Предотвратяване на автоматичното скриване на splash screen
SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  const { isAuthenticated } = useUser();

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      {isAuthenticated ? <AuthGuard /> : <PublicGuard />}
    </View>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Зареждане на шрифтовете
        await Font.loadAsync({
          'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
          'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
          'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <DatabaseProvider>
        <UserProvider>
          <TestProvider>
            <AppContent />
          </TestProvider>
        </UserProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
