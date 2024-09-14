import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sizes from '../../Utils/Sizes';
import Colors from '../../Utils/Colors';
import { applyFontToStyle } from '../../Utils/GlobalStyles';
import { BellIcon } from "react-native-heroicons/outline";

export default function Header() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
    navigation.navigate('LogoutScreen');
  };

  const menuTopPosition = 60 + insets.top;

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}>
          <Text style={[styles.logo, applyFontToStyle({}, 'bold', 26)]}>Harmonix</Text>
        </TouchableOpacity>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.bellIcon}>
            <BellIcon size={26} color={Colors.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu} style={styles.initialsContainer}>
            <Text style={[styles.initials, applyFontToStyle({}, 'bold', 24)]}>BI</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.menu,
                {
                  transform: [{ translateY: menuTranslateY }],
                  opacity: menuOpacity,
                  top: menuTopPosition,
                }
              ]}
            >
              <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                <MaterialIcons name="settings" size={24} color={Colors.TEXT} />
                <Text style={[styles.menuText, applyFontToStyle({}, 'regular', 16)]}>Настройки</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color={Colors.TEXT} />
                <Text style={[styles.menuText, applyFontToStyle({}, 'regular', 16)]}>Изход</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.PADDING,
    paddingBottom: Sizes.PADDING - 2,
    backgroundColor: Colors.BACKGROUND,
    marginTop: 15,
  },
  logo: {
    color: Colors.WHITE,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    marginRight: 15,
  },
  initialsContainer: {
    width: Sizes.USER_IMAGE_SIZE_MEDIUM,
    height: Sizes.USER_IMAGE_SIZE_MEDIUM,
    borderRadius: Sizes.USER_IMAGE_SIZE / 2,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: Colors.WHITE,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menu: {
    position: 'absolute',
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
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    color: Colors.TEXT,
  },
});