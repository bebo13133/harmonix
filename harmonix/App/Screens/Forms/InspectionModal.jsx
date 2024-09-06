import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, Platform } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import PerformanceChart from './PerformanceChart';
import { projects, inspectors, personsInControl, projectDirectors, divisionalDirectors } from '../../Utils/mockData';
import Colors from '../../Utils/Colors';
import { applyFontToStyle } from '../../Utils/GlobalStyles';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const getShadowStyle = (elevation = 5) => {
  return Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: elevation,
    },
  });
};

const FormTypeButton = ({ title, icon, onPress }) => (
  <StyledTouchableOpacity
    className="flex-row items-center justify-between p-4 mb-6 rounded-lg w-full max-w-sm mx-auto"
    style={[
      { backgroundColor: Colors.BACKGROUND },
      getShadowStyle(8),
    ]}
    onPress={onPress}
  >
    <StyledView className="flex-row items-center">
      <Ionicons name={icon} size={24} color="white" style={{ marginRight: 12 }} />
      <StyledText style={applyFontToStyle({}, 'medium', 18)} className="text-white">{title}</StyledText>
    </StyledView>
    <Ionicons name="chevron-forward" size={24} color="white" />
  </StyledTouchableOpacity>
);

const CustomPicker = ({ label, value, setValue, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <StyledView className="mb-7">
      <StyledText style={applyFontToStyle({}, 'medium', 18)} className="text-white mb-2">{label}</StyledText>
      <StyledTouchableOpacity 
        className="bg-gray-700 rounded-md p-3 flex-row justify-between items-center"
        style={[getShadowStyle(5),  { backgroundColor: Colors.BACKGROUND }]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <StyledText style={applyFontToStyle({}, 'regular', 16)} className="text-white">
          {value ? items.find(item => item.id === value)?.name : `Select ${label}`}
        </StyledText>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="white" />
      </StyledTouchableOpacity>
      {isExpanded && (
        <StyledView 
          className="bg-gray-600 rounded-md mt-1"
          style={[getShadowStyle(5),{borderBottomLeftRadius:10, borderBottomRightRadius:10, overflow: 'hidden'}]}
        >
          {items.map((item) => (
            <StyledTouchableOpacity
              key={item.id}
              className="p-3 border-b border-gray-500"
              onPress={() => {
                setValue(item.id);
                setIsExpanded(false);
              }}
            >
              <StyledText style={applyFontToStyle({}, 'regular', 16)} className="text-white">{item.name}</StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      )}
    </StyledView>
  );
};

const InspectionModal = ({ isVisible, onClose, onStartInspection }) => {
  const [step, setStep] = useState('formType');
  const [formType, setFormType] = useState('');
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

  const handleFormTypeSelect = (type) => {
    setFormType(type);
    setStep('details');
  };

  const handleBack = () => {
    setStep('formType');
    setFormType('');
    setSelectedProject('');
    setSelectedInspector('');
    setSelectedPersonInControl('');
    setSelectedProjectDirector('');
    setSelectedDivisionalDirector('');
    setShowPerformance(false);
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
        <StyledTouchableOpacity
          className="absolute top-4 right-4 z-10"
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="white" />
        </StyledTouchableOpacity>

        {step === 'formType' ? (
          <StyledScrollView className="flex-1 px-8 pt-16">
            <StyledText style={applyFontToStyle({}, 'bold', 22)} className="text-white mb-6 text-center">Select Form Type</StyledText>
            <StyledView className="items-center">
              <FormTypeButton 
                title="Health & Safety" 
                icon="fitness" 
                onPress={() => handleFormTypeSelect('healthSafety')} 
              />
              <FormTypeButton 
                title="Environmental" 
                icon="leaf" 
                onPress={() => handleFormTypeSelect('environmental')} 
              />
              <FormTypeButton 
                title="Quality Assurance" 
                icon="checkmark-circle" 
                onPress={() => handleFormTypeSelect('qualityAssurance')} 
              />
              <FormTypeButton 
                title="Document Control" 
                icon="document-text" 
                onPress={() => handleFormTypeSelect('documentControl')} 
              />
            </StyledView>
          </StyledScrollView>
        ) : (
          <StyledScrollView className="flex-1">
            <StyledView className="px-4 pt-6 flex-grow">
              <StyledTouchableOpacity onPress={handleBack} className="mb-4">
                <Ionicons name="arrow-back" size={24} color="white" />
              </StyledTouchableOpacity>
              <StyledText style={applyFontToStyle({}, 'bold', 22)} className="text-white mb-4">New Inspection: {formType}</StyledText>
              
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
                label="Project Number" 
                value={selectedProject} 
                setValue={handleProjectSelect} 
                items={projects}
              />
              <CustomPicker 
                label="Inspection Completed in the Presence of" 
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
              
              <StyledView className="h-16" />
            </StyledView>
          </StyledScrollView>
        )}

        {step === 'details' && (
          <StyledView className="p-4 bg-gray-700">
            <StyledTouchableOpacity
              className={`py-3 px-6 rounded-full ${isFormValid ? 'bg-blue-500' : 'bg-gray-500'}`}
              disabled={!isFormValid}
              onPress={() => onStartInspection({
                formType,
                selectedProject,
                selectedInspector,
                selectedPersonInControl,
                selectedProjectDirector,
                selectedDivisionalDirector
              })}
            >
              <StyledText style={applyFontToStyle({}, 'bold', 22)} className="text-white text-center">Start Inspection</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}
      </StyledView>
    </Animated.View>
  );
};

export default InspectionModal;