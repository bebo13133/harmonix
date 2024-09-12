import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';
import { applyFontToStyle } from '../../Utils/GlobalStyles';

const ExportOptionsModal = ({ isVisible, onClose, onDownload, onShare }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.exportModalOverlay}>
        <View style={styles.exportModalContent}>
          <TouchableOpacity style={styles.exportOption} onPress={onDownload}>
            <Ionicons name="download-outline" size={24} color={Colors.WHITE} />
            <Text style={styles.exportOptionText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportOption} onPress={onShare}>
            <Ionicons name="share-outline" size={24} color={Colors.WHITE} />
            <Text style={styles.exportOptionText}>Share PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  exportModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  exportModalContent: {
    backgroundColor: Colors.BACKGROUND_DARK,
    padding: 20,
    borderRadius: Sizes.BORDER_RADIUS,
    width: '80%',
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_COLOR,
  },
  exportOptionText: {
    color: Colors.WHITE,
    marginLeft: 15,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
  },
});

export default ExportOptionsModal;