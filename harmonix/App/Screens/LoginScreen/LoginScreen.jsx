import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sizes from '../../Utils/Sizes';
import Colors from '../../Utils/Colors';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={{ uri: 'https://harmonix.emage.co.uk/storage/photos/1676029429.jpg' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
      <Image
          source={{ uri:'https://harmonix.emage.co.uk/images/logo/logo.png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to Harmonix</Text>
        <Text style={styles.subtitle}>Your partner in building management</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('LoginForm')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(59, 66, 83, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.PADDING,
  },
  logo: {
    width: Sizes.LOGO_WIDTH,
    height: Sizes.LOGO_HEIGHT,
    marginBottom: Sizes.PADDING * 2,
  },
  title: {
    fontSize: 24,
    color: Colors.WHITE,
    fontWeight: 'bold',
    marginBottom: Sizes.PADDING,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    color: Colors.WHITE,
    marginBottom: Sizes.PADDING * 2,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.BUTTON_BACKGROUND,
    padding: Sizes.BUTTON_PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
});

export default LoginScreen;