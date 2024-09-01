
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Colors from '../../Utils/Colors';
import styles from './styles';

const CheckBox = ({ selected, onPress, color }) => (
    <TouchableOpacity onPress={onPress} style={[styles.checkbox, { borderColor: color }]}>
        {selected && <View style={[styles.checkboxInner, { backgroundColor: color }]} />}
    </TouchableOpacity>
);

const FormSection = ({ section, updateFormSection }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [comments, setComments] = useState({});
    const [images, setImages] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        updateFormSection({
            selectedStatuses,
            comments,
            images
        });
    }, [selectedStatuses, comments, images]);

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
            console.error('Грешка при получаване на размера на изображението:', error);
            return null;
        }
    };

    const handleImagePick = async (questionId) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Съжаляваме, но се нуждаем от разрешение за достъп до галерията!');
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
            alert('Съжаляваме, но се нуждаем от разрешение за достъп до камерата!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
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
        <TouchableOpacity onPress={toggleExpanded}>
            <LinearGradient
                colors={expanded ? ['#8B0000', '#4B0000'] : [Colors.BACKGROUND, Colors.BACKGROUND]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.sectionHeader, { opacity: expanded ? 0.6 : 1 }]}
            >
                <View style={styles.sectionHeaderContent}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <MaterialIcons name={expanded ? "expand-less" : "expand-more"} size={24} color={Colors.WHITE} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
        {expanded && (
            <LinearGradient
                colors={['#2c3e50', '#3498db']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
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

export default FormSection;