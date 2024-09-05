import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import PerformanceChart from './PerformanceChart';
import { projects, inspectors, personsInControl, projectDirectors, divisionalDirectors } from '../../Utils/mockData';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const CustomPicker = ({ label, value, setValue, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <StyledView className="mb-4">
      <StyledText className="text-white text-sm mb-2">{label}</StyledText>
      <StyledTouchableOpacity 
        className="bg-gray-700 rounded-md p-3 flex-row justify-between items-center"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <StyledText className="text-white">
          {value ? items.find(item => item.id === value)?.name : `Select ${label}`}
        </StyledText>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="white" />
      </StyledTouchableOpacity>
      {isExpanded && (
        <StyledView className="bg-gray-600 rounded-md mt-1">
          {items.map((item) => (
            <StyledTouchableOpacity
              key={item.id}
              className="p-3 border-b border-gray-500"
              onPress={() => {
                setValue(item.id);
                setIsExpanded(false);
              }}
            >
              <StyledText className="text-white">{item.name}</StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      )}
    </StyledView>
  );
};

const InspectionModal = ({ isVisible, onClose, onStartInspection }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedInspector, setSelectedInspector] = useState('');
  const [selectedPersonInControl, setSelectedPersonInControl] = useState('');
  const [selectedProjectDirector, setSelectedProjectDirector] = useState('');
  const [selectedDivisionalDirector, setSelectedDivisionalDirector] = useState('');
  const [showPerformance, setShowPerformance] = useState(false);

  const translateY = new Animated.Value(300);

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleProjectSelect = (value) => {
    setSelectedProject(value);
    setShowPerformance(true);
  };

  const isFormValid = selectedProject && selectedInspector && selectedPersonInControl && 
                      selectedProjectDirector && selectedDivisionalDirector;

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={{ 
        transform: [{ translateY: translateY }],
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '90%',
      }}
      className="bg-gray-800 rounded-t-3xl"
    >
      <StyledView className="flex-1">
        
        {/* Бутон за затваряне (X) */}
        <StyledTouchableOpacity
          className="absolute top-4 right-4 z-10"
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="white" />
        </StyledTouchableOpacity>

        <StyledScrollView className="flex-1 p-6">
          <StyledText className="text-white text-xl font-bold mb-4">New Inspection</StyledText>
          
          {showPerformance && selectedProject && (
            <StyledView className="mb-4">
              <PerformanceChart 
                performance={projects.find(p => p.id === selectedProject)?.performance || 0}
                projectData={{
                  previousReport: "Roberts Glen, Meadow, Pateltown, PE21 8PT",
                  imageUrl: projects.find(p => p.id === selectedProject)?.imageUrl,
                  ncn: 5,
                  inspector: "John Doe - ACME Corp"
                }}
              />
            </StyledView>
          )}

          <CustomPicker 
            label="Project number" 
            value={selectedProject} 
            setValue={handleProjectSelect} 
            items={projects}
          />
          <CustomPicker 
            label="Inspection completed in the presence of" 
            value={selectedInspector} 
            setValue={setSelectedInspector} 
            items={inspectors}
          />
          <CustomPicker 
            label="Person in Control of Site" 
            value={selectedPersonInControl} 
            setValue={setSelectedPersonInControl} 
            items={personsInControl}
          />
          <CustomPicker 
            label="Project Director" 
            value={selectedProjectDirector} 
            setValue={setSelectedProjectDirector} 
            items={projectDirectors}
          />
          <CustomPicker 
            label="Divisional Director" 
            value={selectedDivisionalDirector} 
            setValue={setSelectedDivisionalDirector} 
            items={divisionalDirectors}
          />
        </StyledScrollView>

        <StyledView className="p-4 bg-gray-700">
          <StyledTouchableOpacity
            className={`py-3 px-6 rounded-full ${isFormValid ? 'bg-blue-500' : 'bg-gray-500'}`}
            disabled={!isFormValid}
            onPress={() => onStartInspection({
              selectedProject,
              selectedInspector,
              selectedPersonInControl,
              selectedProjectDirector,
              selectedDivisionalDirector
            })}
          >
            <StyledText className="text-white text-center font-bold">Start Inspection</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </Animated.View>
  );
};

export default InspectionModal;
