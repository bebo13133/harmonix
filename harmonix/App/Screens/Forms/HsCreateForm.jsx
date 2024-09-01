import React, { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, Platform, TextInput, Modal, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Svg, Circle, Text as SvgText, LinearGradient as SvgLinearGradient, Stop, Path } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Colors from '../../Utils/Colors';
import { projects, inspectors, personsInControl, projectDirectors, divisionalDirectors } from '../../Utils/mockData';
import hsFormQuestions from './hsFormQuestions';
// import Sizes from '../../Utils/Sizes';
import styles from './styles';
import FormSection from './FormSection';

const SignatureField = () => {
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);

    const onGestureEvent = (event) => {
        const { x, y } = event.nativeEvent;
        setCurrentPath(prevPath => [...prevPath, { x, y }]);
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            setPaths(prevPaths => [...prevPaths, currentPath]);
            setCurrentPath([]);
        }
    };

    const clearSignature = () => {
        setPaths([]);
        setCurrentPath([]);
    };

    return (
        <View style={styles.signatureContainer}>
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
            >
                <Svg height="200" width="100%" style={styles.signatureSvg}>
                    {paths.map((path, index) => (
                        <Path
                            key={index}
                            d={`M ${path[0].x} ${path[0].y} ${path.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                            stroke="black"
                            strokeWidth="2"
                            fill="none"
                        />
                    ))}
                    {currentPath.length > 0 && (
                        <Path
                            d={`M ${currentPath[0].x} ${currentPath[0].y} ${currentPath.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                            stroke="black"
                            strokeWidth="2"
                            fill="none"
                        />
                    )}
                </Svg>
            </PanGestureHandler>
            <TouchableOpacity style={styles.clearButton} onPress={clearSignature}>
                <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
        </View>
    );
};

const HsCreateForm = () => {
    const navigation = useNavigation();
    const [showPerformance, setShowPerformance] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedInspector, setSelectedInspector] = useState('');
    const [selectedPersonInControl, setSelectedPersonInControl] = useState('');
    const [selectedProjectDirector, setSelectedProjectDirector] = useState('');
    const [selectedDivisionalDirector, setSelectedDivisionalDirector] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [generalComments, setGeneralComments] = useState('');
    const [advisory, setAdvisory] = useState('');

    const [signature, setSignature] = useState(null);
    const signatureRef = useRef();
    const clearSignature = () => {
        signatureRef.current.clearSignature();
        setSignature(null);
    };
    const handleSignature = (signature) => {
        setSignature(signature);
        console.log("Signature saved:", signature);
    };
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const PerformanceChart = ({ performance }) => (
        <View style={styles.performanceContainer}>
            <Text style={styles.previousReportText}>Previous Report: Roberts Glen, Meadow, Pateltown, PE21 8PT</Text>
            <Image
                source={{ uri: projects.find(p => p.id === selectedProject)?.imageUrl }}
                style={styles.projectImage}
            />
            <Svg height="150" width="150">
                <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0%" stopColor="#FF0000" stopOpacity="1" />
                    <Stop offset="25%" stopColor="#FFA500" stopOpacity="1" />
                    <Stop offset="50%" stopColor="#FFFF00" stopOpacity="1" />
                    <Stop offset="75%" stopColor="#90EE90" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#00FF00" stopOpacity="1" />
                </SvgLinearGradient>
                <Circle
                    cx="75"
                    cy="75"
                    r="70"
                    stroke="#ddd"
                    strokeWidth="10"
                    fill="transparent"
                />
                <Circle
                    cx="75"
                    cy="75"
                    r="70"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={`${performance * 4.4} ${440 - performance * 4.4}`}
                    strokeLinecap="round"
                    transform="rotate(-90 75 75)"
                />
                <SvgText
                    x="75"
                    y="75"
                    fontSize="24"
                    fill={Colors.WHITE}
                    textAnchor="middle"
                    alignmentBaseline="central"
                >
                    {`${performance}%`}
                </SvgText>
            </Svg>
            <Text style={styles.performanceText}>Performance</Text>
            <Text style={styles.performanceText}>NCN: 5</Text>
            <Text style={styles.performanceText}>John Doe - ACME Corp</Text>
            <Text style={styles.performanceText}>Date: {new Date().toLocaleDateString()}</Text>
        </View>
    );

    const renderPicker = (label, value, setValue, items) => (
        <View style={styles.pickerContainer}>
            <Text style={styles.label}>{label}</Text>
            <LinearGradient
                colors={['#2c3e50', '#3498db']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pickerWrapper}
            >
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => setValue(itemValue)}
                    style={styles.picker}
                    dropdownIconColor={Colors.BLACK}
                >
                    <Picker.Item label={`Select ${label}`} value="" color={Colors.BLACK} />
                    {items.map((item) => (
                        <Picker.Item key={item.id} label={item.name} value={item.id} color={Colors.BLACK} />
                    ))}
                </Picker>
            </LinearGradient>
        </View>
    );

  
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={Colors.WHITE} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.formTitle}>New Health & Safety Inspection</Text>

                    {showPerformance && selectedProject && (
                        <PerformanceChart performance={projects.find(p => p.id === selectedProject)?.performance || 0} />
                    )}

                    <View style={styles.formContainer}>
                        {renderPicker('Project number', selectedProject, (value) => {
                            setSelectedProject(value);
                            setShowPerformance(true);
                        }, projects)}
                        {renderPicker('Inspection completed in the presence of', selectedInspector, setSelectedInspector, inspectors)}
                        {renderPicker('Person in Control of Site', selectedPersonInControl, setSelectedPersonInControl, personsInControl)}
                        {renderPicker('Project Director', selectedProjectDirector, setSelectedProjectDirector, projectDirectors)}
                        {renderPicker('Divisional Director', selectedDivisionalDirector, setSelectedDivisionalDirector, divisionalDirectors)}
                    </View>

                    {Object.entries(hsFormQuestions).map(([key, section]) => (
                        <FormSection key={key} section={section} />
                    ))}

                    <View style={styles.additionalSection}>
                        <Text style={styles.additionalSectionTitle}>General Comments</Text>
                        <TextInput
                            style={styles.additionalSectionInput}
                            multiline
                            numberOfLines={4}
                            value={generalComments}
                            onChangeText={setGeneralComments}
                            placeholder="Enter general comments here"
                            placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                        />
                    </View>

                    <View style={styles.additionalSection}>
                        <Text style={styles.additionalSectionTitle}>Advisory</Text>
                        <TextInput
                            style={styles.additionalSectionInput}
                            multiline
                            numberOfLines={4}
                            value={advisory}
                            onChangeText={setAdvisory}
                            placeholder="Enter advisory here"
                            placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                        />
                    </View>

                    <View style={styles.signatureSection}>
                        <Text style={styles.signatureSectionTitle}>Signed by Harmonix Compliance Representative</Text>
                        <SignatureField ref={signatureRef} onSign={handleSignature} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default HsCreateForm;
