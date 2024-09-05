import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Image, Alert } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../Utils/Colors';
import { styled } from 'nativewind';
import ImageView from "react-native-image-viewing";

const StyledView = styled(View);
const StyledText = styled(Text);

const FormSection = ({ section, updateFormSection }) => {
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [comments, setComments] = useState({});
    const [images, setImages] = useState({});
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    const [mediaModalVisible, setMediaModalVisible] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [imageIndex, setImageIndex] = useState(0);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [previousStatusModalVisible, setPreviousStatusModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    useEffect(() => {
        updateFormSection({
            selectedStatuses,
            comments,
            images
        });
    }, [selectedStatuses, comments, images]);

    const handleStatusChange = (questionId, status) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [questionId]: status
        }));
    };

    const handleAddNote = (questionId) => {
        setCurrentQuestionId(questionId);
        setNoteText(comments[questionId] || '');
        setNoteModalVisible(true);
    };

    const handleSaveNote = () => {
        setComments(prev => ({
            ...prev,
            [currentQuestionId]: noteText
        }));
        setNoteModalVisible(false);
    };

    const handleAddMedia = (questionId) => {
        setCurrentQuestionId(questionId);
        setMediaModalVisible(true);
    };

    const handleTakePhoto = async () => {
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
            const newImage = { uri: result.assets[0].uri };
            setImages(prev => ({
                ...prev,
                [currentQuestionId]: [...(prev[currentQuestionId] || []), newImage]
            }));
        }
        setMediaModalVisible(false);
    };

    const handleChooseImage = async () => {
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
            const newImages = result.assets.map(asset => ({ uri: asset.uri }));
            setImages(prev => ({
                ...prev,
                [currentQuestionId]: [...(prev[currentQuestionId] || []), ...newImages]
            }));
        }
        setMediaModalVisible(false);
    };

    const handleImagePreview = (questionId, index) => {
        setCurrentQuestionId(questionId);
        setImageIndex(index);
        setIsImageViewVisible(true);
    };

    const handleDeleteImage = (questionId, index) => {
        setImages(prev => ({
            ...prev,
            [questionId]: prev[questionId].filter((_, i) => i !== index)
        }));
        if (images[questionId].length === 1) {
            setIsImageViewVisible(false);
        }
    };

    const showPreviousStatusModal = (question) => {
        setCurrentQuestion(question);
        setPreviousStatusModalVisible(true);
    };

    const renderQuestion = (question) => {
        const status = selectedStatuses[question.id] || 'N/A';
        const statusColors = {
            'N/A': Colors.GRAY,
            'Green': Colors.GREEN,
            'Amber': Colors.AMBER,
            'Red': Colors.RED
        };

        return (
            <StyledView key={question.id} className="mb-4 p-2 rounded-lg" style={{ backgroundColor: Colors.BACKGROUND }}>
                <StyledView className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-bold text-white flex-1">{question.text}</Text>
                    {question.previousStatus && (question.previousStatus === 'Amber' || question.previousStatus === 'RED') && (
                        <TouchableOpacity onPress={() => showPreviousStatusModal(question)}>
                            <MaterialIcons 
                                name="warning" 
                                size={24} 
                                color={question.previousStatus === 'Amber' ? Colors.AMBER : Colors.RED} 
                            />
                        </TouchableOpacity>
                    )}
                </StyledView>

                {['N/A', 'Green', 'Amber', 'Red'].map(statusOption => (
                    <TouchableOpacity
                        key={statusOption}
                        onPress={() => handleStatusChange(question.id, statusOption)}
                        className={`py-3 px-4 mb-2 rounded-lg`}
                        style={{
                            backgroundColor: selectedStatuses[question.id] === statusOption ? statusColors[statusOption] : Colors.BACKGROUND_DARK,
                        }}
                    >
                        <Text className="text-center text-white">{statusOption}</Text>
                    </TouchableOpacity>
                ))}

                <View className="flex-row justify-between mt-4">
                    <TouchableOpacity onPress={() => handleAddNote(question.id)} className="flex-row items-center">
                        <MaterialIcons name="note-add" size={24} color={Colors.WHITE} />
                        <Text className="text-white ml-2">Add Note</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleAddMedia(question.id)} className="flex-row items-center">
                        <MaterialIcons name="photo-library" size={24} color={Colors.WHITE} />
                        <Text className="text-white ml-2">Media</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal className="mt-4">
                    {images[question.id]?.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => handleImagePreview(question.id, index)}>
                            <View className="mr-2">
                                <Image source={{ uri: image.uri }} className="w-24 h-24 rounded" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </StyledView>
        );
    };

    return (
        <StyledView className="p-1 bg-background-dark rounded-lg mb-4" style={{paddingTop:40}}>
            <StyledText className="text-xl font-bold text-white mb-4">{section.title}</StyledText>

            {section.questions.map(renderQuestion)}

            <Modal visible={noteModalVisible} transparent={true}>
                <View className="flex-1 bg-opacity-75" style={{ backgroundColor: Colors.BACKGROUND }}>
                    <View className="bg-background-dark p-4 rounded-lg" style={{ height: '40%' }}>
                        <View className="flex-row justify-between mb-4">
                            <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={Colors.WHITE} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveNote}>
                                <MaterialIcons name="check" size={24} color={Colors.WHITE} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            className="bg-background p-4 rounded-lg text-white"
                            multiline
                            numberOfLines={4}
                            autoFocus={true}
                            placeholder="Enter note"
                            placeholderTextColor={Colors.WHITE}
                            value={noteText}
                            onChangeText={setNoteText}
                        />
                    </View>
                </View>
            </Modal>

            <Modal visible={mediaModalVisible} transparent={true} animationType="slide">
                <View className="absolute bottom-0 left-0 right-0 p-4 rounded-t-lg" style={{ backgroundColor: Colors.BACKGROUND, minHeight: 200 }}>
                    <Text className="text-xl text-white mb-4">Add Media</Text>
                    <TouchableOpacity onPress={handleTakePhoto} className="flex-row items-center mb-4">
                        <MaterialIcons name="photo-camera" size={24} color={Colors.WHITE} />
                        <Text className="text-white ml-2">Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChooseImage} className="flex-row items-center mb-4">
                        <MaterialIcons name="photo-library" size={24} color={Colors.WHITE} />
                        <Text className="text-white ml-2">Choose Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMediaModalVisible(false)} className="mt-4">
                        <Text className="text-center text-white">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <ImageView
                images={images[currentQuestionId]?.map(img => ({ uri: img.uri })) || []}
                imageIndex={imageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
                HeaderComponent={({ imageIndex }) => (
                    <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => setIsImageViewVisible(false)}>
                            <MaterialIcons name="arrow-back" size={26} color={Colors.WHITE} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {
                                Alert.alert(
                                    "Delete Image",
                                    "Are you sure you want to delete this image?",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        { 
                                            text: "Delete", 
                                            onPress: () => handleDeleteImage(currentQuestionId, imageIndex),
                                            style: "destructive"
                                        }
                                    ]
                                );
                            }}
                            style={{ alignItems: 'center' }}
                        >
                            <AntDesign name="delete" size={24} color="red" />
                            <Text style={{ color: Colors.WHITE, fontSize: 12, marginTop: 5 }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                FooterComponent={({ imageIndex }) => (
                    <View style={{ padding: 20 }}>
                        <Text style={{ color: Colors.WHITE, textAlign: 'center' }}>
                            {imageIndex + 1} / {images[currentQuestionId]?.length}
                        </Text>
                    </View>
                )}
            />

            <Modal
                visible={previousStatusModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPreviousStatusModalVisible(false)}
            >
                <StyledView className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <StyledView className="bg-background-dark p-4 rounded-lg w-4/5">
                        <StyledText className="text-lg font-bold text-white mb-2">Previous Status</StyledText>
                        {currentQuestion && (
                            <>
                                <StyledText className="text-white mb-2">Status: {currentQuestion.previousStatus}</StyledText>
                                <StyledText className="text-white mb-2">Date: {currentQuestion.previousStatusDate}</StyledText>
                                <StyledText className="text-white mb-4">Description: {currentQuestion.previousStatusDescription}</StyledText>
                            </>
                        )}
                        <TouchableOpacity
                            onPress={() => setPreviousStatusModalVisible(false)}
                            className="bg-blue-500 p-2 rounded-lg"
                        >
                            <StyledText className="text-white text-center">Close</StyledText>
                        </TouchableOpacity>
                    </StyledView>
                </StyledView>
            </Modal>
        </StyledView>
    );
};

export default FormSection;