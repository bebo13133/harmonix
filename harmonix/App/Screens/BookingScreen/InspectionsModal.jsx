import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';
import { applyFontToStyle } from '../../Utils/GlobalStyles';
import moment from 'moment';
import ExportOptionsModal from './ExportOptionsModal';
import { generatePDF, downloadPDF, sharePDF } from '../../Utils/pdfUtils';

import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const InspectionsModal = ({ isVisible, onClose, inspection }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const navigation = useNavigation();
  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleManageAccess = () => {
    console.log('Manage access for inspection:', inspection.id);
  };

  const handleViewExport = () => {
    setShowExportOptions(true);
  };

  const handleDetails = () => {
    onClose();
    navigation.navigate('InspectionDetails', { inspection });
  };

  const handleContinueSubmit = () => {
    if (inspection.status === 'Pending Upload') {
      console.log('Submit inspection:', inspection.id);
    } else {
      console.log('Continue inspection:', inspection.id);
    }
  };

  const handleDownload = async () => {
    try {
      const filePath = await downloadPDF(inspection);
      let message = '';
      if (Platform.OS === 'android') {
        message = `PDF downloaded successfully. It should open automatically in your PDF viewer.`;
      } else {
        message = `PDF downloaded successfully. You can access it through the Files app.`;
      }
      Alert.alert('Success', message);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again.');
    }
  };


  const handleShare = async () => {
    try {
      await sharePDF(inspection);
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Failed to share PDF. Please try again.');
    }
  };


  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
          </TouchableOpacity>

          <Text style={[styles.modalTitle, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE + 4)]}>
            {moment(inspection.date).format('MMMM D, YYYY')} / {inspection.inspectorName}
          </Text>

          <TouchableOpacity style={styles.modalOption} onPress={handleManageAccess}>
            <Ionicons name="people" size={24} color={Colors.WHITE} />
            <Text style={[styles.modalOptionText, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_LARGE)]}>Manage access</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={handleViewExport}>
            <Ionicons name="document-text" size={24} color={Colors.WHITE} />
            <Text style={[styles.modalOptionText, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_LARGE)]}>View & export report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={handleDetails}>
            <Ionicons name="information-circle" size={24} color={Colors.WHITE} />
            <Text style={[styles.modalOptionText, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_LARGE)]}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, inspection.status === 'Pending Upload' && styles.submitButton]}
            onPress={handleContinueSubmit}
          >
            <Text style={[styles.continueButtonText, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE + 4)]}>
              {inspection.status === 'Pending Upload' ? 'Submit' : 'Continue inspection'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <ExportOptionsModal
        isVisible={showExportOptions}
        onClose={() => setShowExportOptions(false)}
        onDownload={handleDownload}
        onShare={handleShare}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.BACKGROUND_DARK,
    padding: 20,
    borderTopLeftRadius: Sizes.BORDER_RADIUS,
    borderTopRightRadius: Sizes.BORDER_RADIUS,
    maxHeight: '80%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  modalTitle: {
    color: Colors.WHITE,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_COLOR,
  },
  modalOptionText: {
    color: Colors.WHITE,
    marginLeft: 15,
  },
  continueButton: {
    backgroundColor: Colors.BG_BLUE,
    padding: 15,
    borderRadius: Sizes.BORDER_RADIUS,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
  },
  continueButtonText: {
    color: Colors.WHITE,
    textAlign: 'center',
  },
});

export default InspectionsModal;