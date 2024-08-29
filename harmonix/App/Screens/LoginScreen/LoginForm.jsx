import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import Sizes from '../../Utils/Sizes';
import Colors from '../../Utils/Colors';
import { useForm } from '../../Hooks/useForm';
import { applyFontToStyle} from '../../Utils/GlobalStyles';

export const LoginForm = () => {
  const initialValues = { email: '', password: '' };
  
  const handleLogin = (formValues) => {
    console.log('Login with', formValues);
    //ще се взима от контекста 
  };

  const { values, errors, onChangeHandler, onSubmit } = useForm(initialValues, handleLogin);

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
            style={applyFontToStyle(styles.input)}
            placeholder="Email"
            placeholderTextColor={Colors.TEXT_LIGHT}
            value={values.email}
            onChangeText={(text) => onChangeHandler('email', text)}
            keyboardType="email-address" 
          />
          {errors.email && <Text style={applyFontToStyle(styles.errorText)}>{errors.email}</Text>}
          
          <TextInput
            style={applyFontToStyle(styles.input)}
            placeholder="Password"
            placeholderTextColor={Colors.TEXT_LIGHT}
            value={values.password}
            onChangeText={(text) => onChangeHandler('password', text)}
            secureTextEntry
          />
          {errors.password && <Text style={applyFontToStyle(styles.errorText)}>{errors.password}</Text>}

          <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => console.log('Forgot password')}>
            <Text style={applyFontToStyle(styles.forgotPasswordText, 'medium')}>Forgot password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={applyFontToStyle(styles.buttonText, 'bold')}>Login</Text>
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
  errorText: {
    color: Colors.ERROR,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    marginBottom: Sizes.PADDING,
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
  },
});

export default LoginForm;