import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from '../../Contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../Utils/Colors';
import { Typography, applyFontToStyle, normalize } from '../../Utils/GlobalStyles';

export const LogoutScreen = () => {
  const { onLogout, token } = useUser();
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await onLogout(token);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      } catch (error) {
      
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [onLogout, token, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isLoggingOut ? (
        <>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.text}>Logging out...</Text>
        </>
      ) : (
        <Text style={styles.errorText}>Error during logout. Please try again.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND,
  },
  text: {
    ...applyFontToStyle(Typography.body, 'medium', 18),
    color: Colors.WHITE,
    marginTop: normalize(20),
    textAlign: 'center',
  },
  errorText: {
    ...applyFontToStyle(Typography.body, 'regular', 16),
    color: Colors.ERROR,
    textAlign: 'center',
  },
});

export default LogoutScreen;