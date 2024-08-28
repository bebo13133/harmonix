import React from 'react'
import { View, StyleSheet, Image, SafeAreaView, Platform } from 'react-native'
import Sizes from '../../Utils/Sizes';
import Colors from '../../Utils/Colors';

export default function Header() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://harmonix.emage.co.uk/images/logo/logo.png' }} 
          style={styles.logo} 
          accessibilityLabel="Harmonix logo"
        />
        <Image 
          source={require('../../../assets/images/bobi.jpg')} 
          style={styles.userImage} 
          accessibilityLabel="User avatar"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.BACKGROUND,  
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
});