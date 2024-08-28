import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, SafeAreaView, Platform, TouchableOpacity, Text, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Sizes from '../../Utils/Sizes';
import Colors from '../../Utils/Colors';
import { globalTextStyle, globalBoldTextStyle } from '../../Utils/GlobalStyles';

export default function Header() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const toggleMenu = () => {
    const toValue = isMenuVisible ? 0 : 1;
    setIsMenuVisible(!isMenuVisible);
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const menuOpacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleSettings = () => {
    toggleMenu();
    navigation.navigate('ProfileSettings');
  };

  const handleLogout = () => {
    toggleMenu();
    //  трябва да добави логиката за излизане от системата
  
    // AuthService.logout();
    navigation.navigate('LogoutScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://harmonix.emage.co.uk/images/logo/logo.png' }} 
          style={styles.logo} 
          accessibilityLabel="Лого на Harmonix"
        />
        <TouchableOpacity onPress={toggleMenu}>
          <Image 
            source={require('../../../assets/images/bobi.jpg')} 
            style={styles.userImage} 
            accessibilityLabel="Аватар на потребителя"
          />
        </TouchableOpacity>
      </View>
      {isMenuVisible && (
        <Animated.View style={[
          styles.menu,
          {
            transform: [{ translateY: menuTranslateY }],
            opacity: menuOpacity,
          }
        ]}>
          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <MaterialIcons name="settings" size={24} color={Colors.TEXT} />
            <Text style={[styles.menuText, globalTextStyle]}>Настройки</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color={Colors.TEXT} />
            <Text style={[styles.menuText, globalTextStyle]}>Изход</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.BACKGROUND,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.PADDING,
    paddingBottom: Sizes.PADDING,
    paddingTop: Platform.OS === 'android' ? 55 : 0,
  },
  logo: {
    width: Sizes.LOGO_WIDTH,
    height: Sizes.LOGO_HEIGHT,
    resizeMode: 'contain',
  },
  userImage: {
    width: Sizes.USER_IMAGE_SIZE,
    height: Sizes.USER_IMAGE_SIZE,
    borderRadius: Sizes.USER_IMAGE_SIZE / 2,
  },
  menu: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 115 : 60,
    right: Sizes.PADDING,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.TEXT,
  },
});