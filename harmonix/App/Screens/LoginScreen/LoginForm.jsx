import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import Sizes from '../../Utils/Sizes';
import Colors from '../../Utils/Colors';


export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
r
  };

  const handleForgetPassword = () => {
    console.log('Send new password');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://harmonix.emage.co.uk/storage/photos/1676029429.jpg' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Image
            source={{ uri: 'https://harmonix.emage.co.uk/images/logo/logo.png' }}
            style={styles.logo}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.TEXT_LIGHT}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.TEXT_LIGHT}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgetPassword}>
            <Text style={styles.forgotPasswordText}>Forget password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: Colors.BACKGROUND,
    padding: Sizes.PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: 'center',
  },
  logo: {
    width: Sizes.LOGO_WIDTH,
    height: Sizes.LOGO_HEIGHT,
    marginBottom: Sizes.PADDING,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.CARD_BACKGROUND,
    color: Colors.WHITE,
    padding: Sizes.INPUT_PADDING,
    marginBottom: Sizes.PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: Sizes.PADDING,
  },
  forgotPasswordText: {
    color: Colors.TEXT_LIGHT,
    fontSize: Sizes.FONT_SIZE_SMALL,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.BUTTON_BACKGROUND,
    padding: Sizes.BUTTON_PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
});

export default LoginForm;