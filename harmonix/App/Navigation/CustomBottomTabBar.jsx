import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import InspectionModal from '../Screens/Forms/InspectionModal';
import { applyFontToStyle } from '../Utils/GlobalStyles';
import Colors from '../Utils/Colors';

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
      className="text-xs mt-2"
      style={[
        applyFontToStyle({}, isActive ? 'bold' : 'medium'),
        { color: isActive ? Colors.WHITE : Colors.GRAY }
      ]}
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
    
    setTimeout(() => {
      try {
        let screenName;
        switch(formData.formType) {
          case 'healthSafety':
            screenName = 'CreateInspectionHs';
            break;
          case 'environmental':
            screenName = 'CreateInspectionEnvironmental';
            break;
          case 'qualityAssurance':
            screenName = 'CreateInspectionQa';
            break;
          case 'documentControl':
            screenName = 'CreateInspectionDc';
            break;
          default:
            screenName = 'CreateInspectionHs';
        }
        navigation.navigate('HealthSafety', { 
          screen: screenName, 
          params: formData 
        });
      } catch (error) {
        console.error("Грешка:", error);
      }
    }, 0);
  };
  return (
    <>
      <StyledView 
        className="flex-row h-16 items-center justify-between px-1 relative"
        style={{ backgroundColor: Colors.BACKGROUND,  }}
      >
        {/* Лява група */}
        <StyledView className="flex-row flex-1 justify-start">
          <TabButton 
            icon={<FontAwesome name="home" size={26} color={activeTab === 'Home' ? Colors.WHITE : Colors.GRAY} />}
            label="Home"
            isActive={activeTab === 'Home'}
            onPress={() => switchTab('Home')}
          />
          <TabButton 
            icon={<Feather name="search" size={26} color={activeTab === 'Search' ? Colors.WHITE : Colors.GRAY} />}
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
            icon={<Ionicons name="notifications" size={24} color={activeTab === 'Notifications' ? Colors.WHITE : Colors.GRAY} />}
            label="Notify"
            isActive={activeTab === 'Notifications'}
            onPress={() => switchTab('Notifications')}
          />
          <TabButton 
            icon={<FontAwesome name="user" size={24} color={activeTab === 'ProfileSettings' ? Colors.WHITE : Colors.GRAY} />}
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