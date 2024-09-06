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
      style={[
        applyFontToStyle({}, isActive ? 'bold' : 'medium', 16), 
        { color: isActive ? Colors.WHITE : Colors.WHITE }
      ]}
      className="mt-1 mb-2" 
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
        console.error("Error:", error);
      }
    }, 0);
  };

  return (
    <>
      <StyledView 
        className="flex-row h-16 items-center justify-between px-1 relative"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        {/* Left group */}
        <StyledView className="flex-row flex-1 justify-start">
          <TabButton 
            icon={<FontAwesome name="home" size={22} color={activeTab === 'Home' ? Colors.WHITE : Colors.PRIMARY} />}
            label="Home"
            isActive={activeTab === 'Home'}
            onPress={() => switchTab('Home')}
          />
          <TabButton 
            icon={<Feather name="search" size={22} color={activeTab === 'Search' ? Colors.WHITE : Colors.PRIMARY} />}
            label="Search"
            isActive={activeTab === 'Search'}
            onPress={() => switchTab('Search')}
          />
        </StyledView>

        {/* Center button */}
        <StyledView className="absolute left-1/2 -ml-8 -top-6">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <StyledTouchableOpacity
              className="w-14 h-14 rounded-full justify-center items-center shadow-lg"
              style={{ backgroundColor: Colors.BACKGROUND_LIGHT }}
              onPress={toggleModal}
            >
              <Feather name="plus" size={26} color="white" />
            </StyledTouchableOpacity>
          </Animated.View>
        </StyledView>

        {/* Right group */}
        <StyledView className="flex-row flex-1 justify-end">
          <TabButton 
            icon={<Ionicons name="notifications" size={22} color={activeTab === 'Notifications' ? Colors.WHITE : Colors.PRIMARY} />}
            label="Notify"
            isActive={activeTab === 'Notifications'}
            onPress={() => switchTab('Notifications')}
          />
          <TabButton 
            icon={<FontAwesome name="user" size={22} color={activeTab === 'ProfileSettings' ? Colors.WHITE : Colors.PRIMARY} />}
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