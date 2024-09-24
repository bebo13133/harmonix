import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RefreshControl, Alert, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,PanResponder } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { applyFontToStyle } from '../../Utils/GlobalStyles';
import { QaFormQuestions } from './QaFormQuestions';
import FormSection from './FormSection';
import { useUser } from '../../Contexts/UserContext';
import { saveImage } from '../../SQLiteBase/FileSystemManager';
import PerformanceChart from './PerformanceChart';
import Colors from '../../Utils/Colors';
import CustomHsHeader from './CustomHsHeader';

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const SignatureField = React.forwardRef((props, ref) => {
    const [paths, setPaths] = useState([]);
    const currentPath = useRef(''); // Текущият път

    // Изчистване на подписа чрез референцията
    React.useImperativeHandle(ref, () => ({
        clearSignature() {
            setPaths([]);  // Изчистване на пътищата
            currentPath.current = '';  // Изчистване на текущия път
            props.onSign([]);  // Изпращане на празен подпис
        }
    }));

    // Пан жест за рисуване на подписа
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
                const { locationX, locationY } = event.nativeEvent;
                currentPath.current = `M ${locationX} ${locationY}`;  // Започваме нов път
            },
            onPanResponderMove: (event) => {
                const { locationX, locationY } = event.nativeEvent;
                currentPath.current += ` L ${locationX} ${locationY}`;  // Добавяме точки към пътя
                setPaths(prevPaths => [...prevPaths.slice(0, -1), currentPath.current]);  // Актуализираме последния път
            },
            onPanResponderRelease: () => {
                setPaths(prevPaths => {
                    const newPaths = [...prevPaths, currentPath.current];  // Завършваме пътя
                    // Забавяме извикването на props.onSign
                    setTimeout(() => {
                        props.onSign(newPaths);  // Изпращаме подписа след рендиране
                    }, 0);
                    return newPaths;
                });
                currentPath.current = '';  // Нулираме текущия път
            },
        })
    ).current;

    return (
        <View style={styles.signatureContainer}>
            <View style={styles.svgContainer} {...panResponder.panHandlers}>
                <Svg height="100%" width="100%">
                    {paths.map((path, index) => (
                        <Path
                            key={index}
                            d={path}
                            stroke="black"
                            strokeWidth={2}
                            fill="none"
                        />
                    ))}
                </Svg>
            </View>
            <TouchableOpacity 
                onPress={() => ref.current.clearSignature()} 
                style={styles.clearButton}
            >
                <Text style={[applyFontToStyle({}, 'regular', 18), styles.clearText]}>
                    Clear
                </Text>
            </TouchableOpacity>
        </View>
    );
});

const QaCreateForm = ({ route }) => {
    const navigation = useNavigation();
    const { saveFormData } = useUser();
    const initialData = route.params || {};
    const insets = useSafeAreaInsets();

    const [formData, setFormData] = useState({
        formType: initialData.formType || '', 
        projectNumber: initialData.projectNumber || '', 
        address: initialData.address || '', 
        inspectorName: initialData.inspectorName || '', 
        selectedProject: initialData.selectedProject || '',
        selectedInspector: initialData.selectedInspector || '',
        selectedPersonInControl: initialData.selectedPersonInControl || '',
        selectedProjectDirector: initialData.selectedProjectDirector || '',
        selectedDivisionalDirector: initialData.selectedDivisionalDirector || '',
        generalComments: '',
        advisory: '',
        signature: null,
        formSections: {},
    });

    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPerformance, setShowPerformance] = useState(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    const sections = Object.entries(QaFormQuestions);
    const signatureRef = useRef();
    const scrollViewRef = useRef();

    const saveCurrentSectionData = () => {
        const currentSectionKey = sections[currentSectionIndex][0];
        updateFormSection(currentSectionKey, formData.formSections[currentSectionKey]);
    };

    const loadSectionData = (index) => {
        const sectionKey = sections[index][0];
        return formData.formSections[sectionKey] || {};
    };

    const handleSectionChange = (newIndex) => {
        saveCurrentSectionData();
        setCurrentSectionIndex(newIndex);
        const newSectionData = loadSectionData(newIndex);
        setFormData((prev) => ({
            ...prev,
            formSections: {
                ...prev.formSections,
                [sections[newIndex][0]]: newSectionData
            }
        }));
    };

    useEffect(() => {
        if (formData.selectedProject) {
            setShowPerformance(true);
        }
    }, [formData.selectedProject]);

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <CustomHsHeader
                    sections={sections}
                    currentSectionIndex={currentSectionIndex}
                    onSectionChange={handleSectionChange}
                    formData={formData}
                    topInset={insets.top}
                />
            ),
        });
    }, [navigation, currentSectionIndex, formData, sections, insets.top]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const updateFormSection = useCallback((sectionKey, sectionData) => {
        setFormData(prevData => ({
            ...prevData,
            formSections: {
                ...prevData.formSections,
                [sectionKey]: sectionData
            }
        }));
    }, []);

    const handleSave = async () => {
        if (isLoading) return;
      
        setIsLoading(true); 
           
        try {
          const updatedFormSections = {};
      
          for (const [sectionKey, sectionData] of Object.entries(formData.formSections)) {
            const updatedQuestions = {};
      
            for (const [questionId, images] of Object.entries(sectionData.images || {})) {
              const updatedImages = [];
      
              for (const image of images) {
                try {
                  const savedUri = await saveImage(image.uri); 
                  console.log(`Image saved at: ${savedUri}`);
                  updatedImages.push({ ...image, uri: savedUri });
                } catch (error) {
                        Alert.alert('Error', 'Error saving one of the images. Please try again.');
                  setIsLoading(false);
                  return; 
                }
              }
      
              updatedQuestions[questionId] = updatedImages;
            }
      
            updatedFormSections[sectionKey] = {
              ...sectionData,
              images: updatedQuestions,
            };
          }
      
          const dataToSave = {
            ...formData,
            formSections: updatedFormSections,
            date: new Date().toISOString().split('T')[0],
            status: 'Draft',
          };
      
          await saveFormData(dataToSave); 
      
          setIsLoading(false); 
          navigation.navigate('MainTabs', { screen: 'Home' });
        } catch (error) {
        
          Alert.alert('Error', 'Error while saving form. Please try again.');
          setIsLoading(false); // 
        }
      };

    const handleSubmit = () => {
        // Implement submit logic
    };

    const renderQuestions = () => {
        const startIndex = currentSectionIndex;
        const endIndex = startIndex + 1;

        const questionEntries = sections.slice(startIndex, endIndex).map(([key, section]) => (
            <FormSection 
                key={key} 
                section={section} 
                updateFormSection={(sectionData) => updateFormSection(key, sectionData)}
                savedSectionData={formData.formSections[key] || {}}
            />
        ));

        if (currentSectionIndex === sections.length - 1) {
            questionEntries.push(
                <StyledView className="mb-4" key="general-comments">
                    <StyledText style={applyFontToStyle({}, 'semibold', 18)} className="mb-2 text-white">General Comments</StyledText>
                    <StyledTextInput
                        className="bg-white p-2 rounded border border-gray-300"
                        style={applyFontToStyle({}, 'regular', 16)}
                        multiline
                        numberOfLines={4}
                        value={formData.generalComments}
                        onChangeText={(text) => handleInputChange('generalComments', text)}
                        placeholder="Enter general comments here"
                        placeholderTextColor={Colors.GRAY}
                    />
                </StyledView>,
                <StyledView className="mb-4" key="advisory">
                    <StyledText style={applyFontToStyle({}, 'semibold', 18)} className="mb-2 text-white">Advisory</StyledText>
                    <StyledTextInput
                        className="bg-white p-2 rounded border border-gray-300"
                        multiline
                        style={applyFontToStyle({}, 'regular', 16)}
                        numberOfLines={4}
                        value={formData.advisory}
                        onChangeText={(text) => handleInputChange('advisory', text)}
                        placeholder="Enter advisory notes here"
                        placeholderTextColor={Colors.GRAY}
                    />
                </StyledView>,
                <StyledView className="mb-4" key="signature">
                    <StyledText style={applyFontToStyle({}, 'semibold', 18)} className="mb-2 text-white">Signature</StyledText>
                    <SignatureField 
                        ref={signatureRef} 
                        onSign={(signature) => handleInputChange('signature', signature)} 
                    />
                </StyledView>,
                <View style={styles.buttonContainer} key="buttons">
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: Colors.GREEN }]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={[applyFontToStyle({}, 'medium', 18), styles.buttonText]}>{isLoading ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: Colors.PRIMARY }]}
                        onPress={handleSubmit}
                    >
                        <Text style={[applyFontToStyle({}, 'medium', 18), styles.buttonText]}>Submit</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return questionEntries;
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StyledScrollView
                ref={scrollViewRef}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 80 }]}
            >
                <StyledView className="p-4" style={{ marginTop: 60 }}>
                    {showPerformance && formData.selectedProject && initialData.projectData && (
                        <PerformanceChart 
                            performance={initialData.projectData.performance || 0}
                            projectData={{
                                previousReport: initialData.projectData.previousReport || "No previous report",
                                imageUrl: initialData.projectData.imageUrl,
                                ncn: initialData.projectData.ncn || 0,
                                inspector: initialData.projectData.inspector || "No inspector assigned"
                            }}
                        />
                    )}

                    {renderQuestions()}

                </StyledView>

            </StyledScrollView>
          
            <View style={[styles.paginationContainer,]}>
                {currentSectionIndex > 0 && (
                    <TouchableOpacity
                        style={[styles.paginationButton, styles.paginationBorder]}
                        onPress={() => handleSectionChange(Math.max(currentSectionIndex - 1, 0))}
                    >
                        <MaterialIcons name="arrow-back-ios" size={24} color={Colors.WHITE} />
                        <Text style={[applyFontToStyle({}, 'regular', 18), { color: Colors.WHITE, paddingVertical: 8 }]}>Back</Text>
                    </TouchableOpacity>
                )}

                <Text style={[applyFontToStyle({}, 'medium', 18), { color: Colors.WHITE }, styles.paginationText]}>
                    Section {currentSectionIndex + 1} / {sections.length}
                </Text>

                {currentSectionIndex < sections.length - 1 && (
                    <TouchableOpacity
                        style={[styles.paginationButton, styles.paginationBorder]}
                        onPress={() => handleSectionChange(Math.min(currentSectionIndex + 1, sections.length - 1))}
                    >
                        <Text style={[applyFontToStyle({}, 'regular', 18), { color: Colors.WHITE, paddingVertical: 8 }]}>Next</Text>
                        <MaterialIcons name="arrow-forward-ios" size={24} color={Colors.WHITE} />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161d31',
    },
    contentContainer: {
        paddingBottom: 80,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        outlineStyle: 'none',
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.BACKGROUND,
        borderTopWidth: 6, 
        borderTopColor: Colors.BACKGROUND_DARK, 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    paginationButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paginationBorder: {
        // borderColor: Colors.BACKGROUND_DARK,
        // borderWidth: 1,
        padding: 12,
        borderRadius: 4,
    },
    paginationText: {
        paddingHorizontal: 16,
    },
    signatureContainer: {
        borderWidth: 1,
        borderColor: Colors.GRAY,
        backgroundColor: Colors.WHITE,
        height: 200,
        marginBottom: 16,
        position: 'relative',
    },
    clearButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: Colors.BACKGROUND,
        paddingHorizontal: 10,
        borderRadius: 8,
        paddingVertical: 5,
        borderColor: Colors.PRIMARY,
        borderWidth: 2,

    },
    clearText: {
        color: Colors.WHITE,
        textAlign: 'center',
        
    },
});


export default QaCreateForm;
