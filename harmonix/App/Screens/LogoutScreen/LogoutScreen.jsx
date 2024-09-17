import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useUser } from '../../Contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

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
        console.error('Error during logout:', error);
        setIsLoggingOut(false);
      }
    };

    performLogout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLogout]);

  if (!isLoggingOut) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error during logout. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;