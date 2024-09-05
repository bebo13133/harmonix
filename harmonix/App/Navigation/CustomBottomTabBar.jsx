// CustomBottomTabBar.jsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import Colors from '../Utils/Colors';

import { useNavigation } from '@react-navigation/native';
import InspectionModal from '../Screens/Forms/InspectionModal';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const TabButton = ({ icon, label, isActive, onPress }) => (
  <StyledTouchableOpacity
    className="flex items-center px-4"
    onPress={onPress}
  >
    {icon}
    <StyledText 
      className="text-xs mt-1"
      style={{ color: isActive ? Colors.ACTIVE_TAB : Colors.GRAY }}
    >
      {label}
    </StyledText>
  </StyledTouchableOpacity>
);

export default function CustomBottomTabBar({ activeTab, switchTab }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const scaleAnim = new Animated.Value(1);

  const toggleModal = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsModalVisible(!isModalVisible);
  };

  const handleStartInspection = (formData) => {

    setIsModalVisible(false);
    
    // Изолиране на навигацията
    setTimeout(() => {
      try {
        navigation.navigate('HealthSafety', { 
          screen: 'CreateInspectionHs', 
          params: formData 
        });
      } catch (error) {
        console.error("Грешка при навигация:", error);
  
      }
    }, 0);
  };

  return (
    <>
      <StyledView 
        className="flex-row h-16 items-center justify-between px-2 relative"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        {/* Лява група */}
        <StyledView className="flex-row flex-1">
          <TabButton 
            icon={<FontAwesome name="home" size={26} color={activeTab === 'Home' ? Colors.ACTIVE_TAB : Colors.GRAY} />}
            label="Home"
            isActive={activeTab === 'Home'}
            onPress={() => switchTab('Home')}
          />
          <TabButton 
            icon={<Feather name="search" size={26} color={activeTab === 'Search' ? Colors.ACTIVE_TAB : Colors.GRAY} />}
            label="Search"
            isActive={activeTab === 'Search'}
            onPress={() => switchTab('Search')}
          />
        </StyledView>

        {/* Централен бутон */}
        <StyledView className="absolute left-1/2 -ml-8 -top-8">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <StyledTouchableOpacity
              className="w-16 h-16 rounded-full justify-center items-center shadow-lg"
              style={{ backgroundColor: Colors.BACKGROUND_LIGHT }}
              onPress={toggleModal}
            >
              <Feather name="plus" size={30} color="white" />
            </StyledTouchableOpacity>
          </Animated.View>
        </StyledView>

        {/* Дясна група */}
        <StyledView className="flex-row flex-1 justify-end">
          <TabButton 
            icon={<Ionicons name="notifications" size={26} color={activeTab === 'Notifications' ? Colors.ACTIVE_TAB : Colors.GRAY} />}
            label="Notifications"
            isActive={activeTab === 'Notifications'}
            onPress={() => switchTab('Notifications')}
          />
          <TabButton 
            icon={<FontAwesome name="user" size={26} color={activeTab === 'ProfileSettings' ? Colors.ACTIVE_TAB : Colors.GRAY} />}
            label="Profile"
            isActive={activeTab === 'ProfileSettings'}
            onPress={() => switchTab('ProfileSettings')}
          />
        </StyledView>
      </StyledView>

      <InspectionModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onStartInspection={handleStartInspection}
      />
    </>
  );
}