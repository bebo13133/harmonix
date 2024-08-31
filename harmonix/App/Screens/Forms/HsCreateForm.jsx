import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, Platform, TextInput, Modal, Dimensions, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Svg, Circle, Text as SvgText, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Colors from '../../Utils/Colors';
import { projects, inspectors, personsInControl, projectDirectors, divisionalDirectors } from '../../Utils/mockData';
import hsFormQuestions from './hsFormQuestions';
import Sizes from '../../Utils/Sizes';


const { width } = Dimensions.get('window');

const selectFont = (options = {}) => {
    const ios = Platform.OS === 'ios';
    return {
        fontFamily: ios
            ? options.bold
                ? 'System'
                : 'System'
            : options.bold
                ? 'Roboto-Bold'
                : 'Roboto-Regular',
        fontWeight: options.bold ? 'bold' : 'normal',
    };
};

const CheckBox = ({ selected, onPress, color }) => (
    <TouchableOpacity onPress={onPress} style={[styles.checkbox, { borderColor: color }]}>
        {selected && <View style={[styles.checkboxInner, { backgroundColor: color }]} />}
    </TouchableOpacity>
);

const FormSection = ({ section }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [comments, setComments] = useState({});
    const [images, setImages] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleStatusChange = (questionId, status) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [questionId]: status
        }));
    };

    const handleCommentChange = (questionId, comment) => {
        setComments(prev => ({
            ...prev,
            [questionId]: comment
        }));
    };

    const getImageSize = async (uri) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            return fileInfo.size;
        } catch (error) {
            console.error('Error getting image size:', error);
            return null;
        }
    };

    const handleImagePick = async (questionId) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = await Promise.all(result.assets.map(async (asset) => {
                const size = await getImageSize(asset.uri);
                return { uri: asset.uri, size };
            }));

            setImages(prev => ({
                ...prev,
                [questionId]: [...(prev[questionId] || []), ...newImages]
            }));
        }
    };

    const handleCameraCapture = async (questionId) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false, // Променено от true на false
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const size = await getImageSize(result.assets[0].uri);
            const newImage = { uri: result.assets[0].uri, size };

            setImages(prev => ({
                ...prev,
                [questionId]: [...(prev[questionId] || []), newImage]
            }));
        }
    };
    const handleDeleteImage = (questionId, index) => {
        setImages(prev => ({
            ...prev,
            [questionId]: prev[questionId].filter((_, i) => i !== index)
        }));
    };
    const showPreviousStatusModal = (question) => {
        setModalContent(question);
        setModalVisible(true);
    };

    const showImagePreview = (uri) => {
        setPreviewImage(uri);
    };

    const renderQuestion = (question) => {
        const status = selectedStatuses[question.id] || 'N/A';
        const statusColor = status === 'Green' ? Colors.GREEN : status === 'Amber' ? Colors.AMBER : status === 'Red' ? Colors.RED : Colors.GRAY;

        return (
            <View key={question.id} style={styles.questionContainer}>
                <View style={styles.questionHeader}>
                    <Text style={[styles.questionText, { color: statusColor }]}>{question.text}</Text>
                    {question.previousStatus && question.previousStatus !== 'N/A' && question.previousStatus !== 'Green' && (
                        <TouchableOpacity onPress={() => showPreviousStatusModal(question)}>
                            <MaterialIcons name="warning" size={24} color={question.previousStatus === 'Amber' ? Colors.AMBER : Colors.RED} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.checkboxesContainer}>
                    {['N/A', 'Green', 'Amber', 'Red'].map((checkboxStatus) => (
                        <View key={checkboxStatus} style={styles.checkboxWrapper}>
                            <CheckBox
                                selected={status === checkboxStatus}
                                onPress={() => handleStatusChange(question.id, checkboxStatus)}
                                color={checkboxStatus === 'N/A' ? Colors.GRAY : checkboxStatus === 'Green' ? Colors.GREEN : checkboxStatus === 'Amber' ? Colors.AMBER : Colors.RED}
                            />
                            <Text style={styles.checkboxLabel}>{checkboxStatus}</Text>
                        </View>
                    ))}
                </View>
                {status !== 'N/A' && (
                    <View style={styles.additionalFieldsContainer}>
                        <TextInput
                            style={[styles.commentInput, { borderColor: statusColor }]}
                            placeholder="Add a comment"
                            value={comments[question.id] || ''}
                            onChangeText={(text) => handleCommentChange(question.id, text)}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <View style={styles.imageButtonsContainer}>
                            <TouchableOpacity style={[styles.imagePickerButton, { backgroundColor: statusColor }]} onPress={() => handleImagePick(question.id)}>
                                <Text style={styles.imagePickerButtonText}>Choose Images</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.imagePickerButton, { backgroundColor: statusColor }]} onPress={() => handleCameraCapture(question.id)}>
                                <Text style={styles.imagePickerButtonText}>Take Photo</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={styles.imagesContainer}>
                            {images[question.id]?.map((image, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <TouchableOpacity onPress={() => showImagePreview(image.uri)}>
                                        <Image source={{ uri: image.uri }} style={styles.image} />
                                    </TouchableOpacity>
                                    <Text style={styles.imageSize}>Size: {(image.size / 1024).toFixed(2)} KB</Text>
                                    <TouchableOpacity
                                        style={styles.deleteImageButton}
                                        onPress={() => handleDeleteImage(question.id, index)}
                                    >
                                        <MaterialIcons name="delete" size={24} color={Colors.RED} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.sectionContainer}>
            
            <TouchableOpacity onPress={toggleExpanded} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <MaterialIcons name={expanded ? 'expand-less' : 'expand-more'} size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
            {expanded && (
                <LinearGradient
                    colors={['#2c3e50', '#3498db']}
                    style={styles.expandedContent}
                >
                    {section.questions.map(renderQuestion)}
                </LinearGradient>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{modalContent?.text}</Text>
                        <Text style={styles.modalDescription}>{modalContent?.previousStatusDescription}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={!!previewImage}
                onRequestClose={() => setPreviewImage(null)}
            >
                <View style={styles.previewModalContainer}>
                    <Image source={{ uri: previewImage }} style={styles.previewImage} resizeMode="contain" />
                    <TouchableOpacity onPress={() => setPreviewImage(null)} style={styles.closePreviewButton}>
                        <MaterialIcons name="close" size={24} color={Colors.WHITE} />
                    </TouchableOpacity>
                </View>
            </Modal>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.PADDING,
    },
    backButtonText: {
        color: Colors.WHITE,
        marginLeft: 10,
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        ...selectFont(),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    formTitle: {
        fontSize: Sizes.FONT_SIZE_LARGE,
        fontWeight: 'bold',
        color: Colors.WHITE,
        textAlign: 'center',
        marginVertical: Sizes.PADDING,
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    performanceContainer: {
        backgroundColor: Colors.BACKGROUND_DARK,
        padding: Sizes.PADDING,
        alignItems: 'center',
        borderColor: Colors.RED_BORDER,
        borderWidth: 1,
        marginBottom: Sizes.PADDING,
        borderRadius: Sizes.BORDER_RADIUS,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    projectImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: Sizes.PADDING,
        borderRadius: Sizes.BORDER_RADIUS,
    },
    previousReportText: {
        color: Colors.WHITE,
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        fontWeight: 'bold',
        marginBottom: Sizes.PADDING,
        textAlign: 'center',
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    performanceText: {
        color: Colors.FORM_TEXT,
        fontSize: Sizes.FONT_SIZE_SMALL,
        marginTop: Sizes.PADDING / 2,
        ...selectFont(),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    formContainer: {
        padding: Sizes.PADDING,
    },
    pickerContainer: {
        marginBottom: Sizes.PADDING * 1.5,
    },
    label: {
        color: Colors.FORM_TEXT,
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        marginBottom: Sizes.PADDING / 2,
        fontWeight: 'bold',
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    pickerWrapper: {
        borderRadius: Sizes.BORDER_RADIUS,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    picker: {
        height: Sizes.PICKER_HEIGHT,
        color: Colors.WHITE,
        ...selectFont(),
    },
    sectionContainer: {
        marginBottom: Sizes.PADDING * 1.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Sizes.PADDING,
        // paddingRight: Sizes.PADDING * 2, 
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
    },
    sectionTitle: {
        ...selectFont({ bold: true }),
        fontSize: Sizes.FONT_SIZE_MEDIUM - 2,
        color: Colors.PRIMARY,
        flexShrink: 1, // Позволява на текста да се свие, ако е необходимо
        marginRight: 20,

    },
    expandedContent: {
        padding: Sizes.PADDING,
        borderRadius: Sizes.BORDER_RADIUS,
    },
    questionContainer: {
        marginBottom: Sizes.PADDING * 1.2,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.PADDING / 2,
    },
    questionText: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        flex: 1,
    },
    checkboxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Sizes.PADDING / 2,
    },
    checkboxWrapper: {
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    checkboxLabel: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        marginTop: 4,
        color: Colors.WHITE,
    },
    additionalFieldsContainer: {
        marginTop: Sizes.PADDING / 2,
    },
    commentInput: {
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING,
        marginBottom: Sizes.PADDING / 2,
        width: '100%',
        borderWidth: 1,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    imageButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Sizes.PADDING / 2,
    },
    imagePickerButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: Sizes.PADDING / 4,
    },
    imagePickerButtonText: {
        ...selectFont({ bold: true }),
        color: Colors.WHITE,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginTop: Sizes.PADDING / 2,
    },
    imageWrapper: {
        marginRight: Sizes.PADDING / 2,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: Sizes.BORDER_RADIUS,
    },
    imageSize: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        color: Colors.WHITE,
        textAlign: 'center',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING,
        width: '80%',
    },
    modalTitle: {
        ...selectFont({ bold: true }),
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        marginBottom: Sizes.PADDING / 2,
    },
    modalDescription: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        marginBottom: Sizes.PADDING,
    },
    closeButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING / 2,
        alignItems: 'center',
    },
    closeButtonText: {
        ...selectFont({ bold: true }),
        color: Colors.WHITE,
    },
    // Новые стили для предварительного просмотра изображений
    previewModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    previewImage: {
        width: width * 0.9,
        height: width * 0.9,
    },
    closePreviewButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 10,
    },
    deleteImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        padding: 4,
    },
});
export default HsCreateForm;
