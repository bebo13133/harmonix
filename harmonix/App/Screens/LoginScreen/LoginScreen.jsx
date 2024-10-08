import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sizes from '../../Utils/Sizes';
import Colors from '../../Utils/Colors';
import { applyFontToStyle } from '../../Utils/GlobalStyles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(-300)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: -0.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [-0.1, 0.1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://harmonix.emage.co.uk/storage/photos/1676029429.jpg' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Animated.Image
            source={{ uri: 'https://harmonix.emage.co.uk/images/logo/logo.png' }}
            style={[
              styles.logo,
              {
                transform: [
                  { translateX: translateX },
                  { rotate: spin },
                ],
              },
            ]}
          />
          <Text style={applyFontToStyle(styles.title, 'bold', Sizes.FONT_SIZE_EXTRA_LARGE)}>
            Welcome to Harmonix
          </Text>
          <Text style={applyFontToStyle(styles.subtitle, 'medium', Sizes.FONT_SIZE_MEDIUM)}>
            Your partner in building management
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('LoginForm')}
          >
            <Text style={applyFontToStyle(styles.buttonText, 'bold', Sizes.FONT_SIZE_MEDIUM)}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    width: Sizes.LOGO_WIDTH * 2,  
    height: Sizes.LOGO_HEIGHT * 2,
    marginBottom: Sizes.PADDING * 2,
  },
  title: {
    color: Colors.WHITE,
    marginBottom: Sizes.PADDING,
    textAlign: 'center',
  },
  subtitle: {
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
  },
});

export default LoginScreen;