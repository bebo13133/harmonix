import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { styled } from 'nativewind';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';


const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledPicker = styled(Picker);

const CustomPicker = ({ label, value, setValue, items }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  return (
    <StyledView className="mb-4">
      <StyledText className="text-white text-sm mb-2">{label}</StyledText>
      <StyledTouchableOpacity 
        className="bg-gray-700 rounded-md p-3 flex-row justify-between items-center"
        onPress={() => setPickerVisible(true)}
      >
        <StyledText className="text-white">
          {value ? items.find(item => item.id === value)?.name : `Изберете ${label}`}
        </StyledText>
        <Ionicons name="chevron-down" size={20} color="white" />
      </StyledTouchableOpacity>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
      >
        <StyledView className="flex-1 justify-end bg-black bg-opacity-50">
          <StyledView className="bg-white rounded-t-lg">
            <StyledTouchableOpacity
              className="p-4 border-b border-gray-200"
              onPress={() => setPickerVisible(false)}
            >
              <StyledText className="text-center text-blue-500 font-bold">Готово</StyledText>
            </StyledTouchableOpacity>
            <StyledPicker
              selectedValue={value}
              onValueChange={(itemValue) => {
                setValue(itemValue);
                setPickerVisible(false);
              }}
            >
              <Picker.Item label={`Изберете ${label}`} value="" />
              {items.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
            </StyledPicker>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default CustomPicker;