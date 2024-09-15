import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, StatusBar, Platform, TouchableWithoutFeedback, Modal, Dimensions, Animated } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';
import { applyFontToStyle } from '../../Utils/GlobalStyles';
import moment from 'moment';
import { useUser } from '../../Contexts/UserContext';

const { height } = Dimensions.get('window');
import SvgIcon from '../../Components/SvgIcon';
import InspectionsModal from './InspectionsModal';

const groupInspectionsByDate = (data) => {
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');

  const sections = [
    { title: 'Today', data: [] },
    { title: 'Yesterday', data: [] },
    { title: 'Older', data: [] },
  ];

  const olderInspections = {};

  data.forEach(item => {
    const inspectionDate = moment(item.date);

    if (inspectionDate.isSame(today, 'day')) {
      sections[0].data.push(item);
    } else if (inspectionDate.isSame(yesterday, 'day')) {
      sections[1].data.push(item);
    } else {
      const formattedDate = inspectionDate.format('YYYY-MM-DD');
      if (!olderInspections[formattedDate]) {
        olderInspections[formattedDate] = [];
      }
      olderInspections[formattedDate].push(item);
    }
  });

  Object.keys(olderInspections).forEach(date => {
    sections.push({ title: date, data: olderInspections[date] });
  });

  return sections.filter(section => section.data.length > 0);
};

const getFormTypeIcon = (formType) => {
  switch (formType) {
    case 'healthSafety':
      return 'fitness';
    case 'environmental':
      return 'leaf';
    case 'qualityAssurance':
      return 'checkmark-circle';
    case 'documentControl':
      return 'document-text';
    default:
      return 'help-circle';
  }
};

const renderItem = ({ item }, navigation, onDelete, onPress) => (
  <TouchableWithoutFeedback onPress={() => onPress(item)}>
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={getFormTypeIcon(item.formType)} size={24} color={Colors.WHITE} />
        </View>
        <View style={styles.cardMainContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.projectNumber, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE + 2)]}>{item.projectNumber}</Text>
            <SvgIcon name="deleteIcon"
              size={24}
              color={Colors.RED}
              onPress={() => onDelete(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} />
          </View>
          <Text style={[styles.address, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_MEDIUM + 2)]}>{item.address}</Text>
          <View style={styles.cardDetails}>
            <View style={styles.detailColumn}>
              <Text style={[styles.detailLabel, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_SMALL + 4)]}>Status</Text>
              <Text style={[styles.detailValue, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_SMALL + 3)]}>
                {item.status === 'Draft' ? `Draft (${item.completionPercentage}% Complete)` : item.status}
              </Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={[styles.detailLabel, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_SMALL + 4)]}>Score</Text>
              <Text style={[styles.detailValue, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_SMALL + 3)]}>
                {item.score}%
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <MaterialIcons name="chevron-right" size={24} color={Colors.TEXT_LIGHT} />
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
);

export const HealthSafetyInspections = () => {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const sectionListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { savedForms, loadFormData,deleteForm } = useUser();

  useEffect(() => {
    loadFormData();
  }, []);

  const sections = groupInspectionsByDate(savedForms);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setShowScrollTopButton(scrollPosition > 200);
  };

  const scrollToTop = () => {
    sectionListRef.current.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      animated: true
    });
  };

  const handleDelete = async (id) => {
   await deleteForm(id)
    await loadFormData();
  };

  const handleInspectionPress = (inspection) => {
    setSelectedInspection(inspection);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedInspection(null);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.BACKGROUND} />
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
          <SectionList
            ref={sectionListRef}
            sections={sections}
            renderItem={(props) => renderItem(props, navigation, handleDelete, handleInspectionPress)}
            keyExtractor={item => item.id.toString()}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={[styles.sectionHeader, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE)]}>{title}</Text>
            )}
            contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + Sizes.PADDING }]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            scrollIndicatorInsets={{ right: 1 }}
            indicatorStyle="white"
          />

          {showScrollTopButton && (
            <TouchableOpacity
              style={[styles.scrollTopButton, { bottom: insets.bottom + 20 }]}
              onPress={scrollToTop}
            >
              <MaterialIcons name="arrow-upward" size={24} color={Colors.WHITE} />
            </TouchableOpacity>
          )}

          {selectedInspection && (
            <InspectionsModal
              isVisible={isModalVisible}
              onClose={closeModal}
              inspection={selectedInspection}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_DARK,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    paddingBottom: Sizes.PADDING,
  },
  card: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Sizes.BORDER_RADIUS,
    padding: 10,
    marginBottom: Sizes.CARD_MARGIN_BOTTOM,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMainContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: Colors.BACKGROUND_DARK,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  projectNumber: {
    color: Colors.WHITE,
  },
  address: {
    color: Colors.WHITE,
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: Colors.TEXT_LIGHT,
    marginBottom: 2,
  },
  detailValue: {
    color: Colors.WHITE,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  sectionHeader: {
    color: Colors.TEXT_LIGHT,
    marginVertical: 10,
    backgroundColor: Colors.BACKGROUND_DARK,
    paddingHorizontal: 10,
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: Sizes.SCROLL_TOP_BUTTON_SIZE / 2,
    width: Sizes.SCROLL_TOP_BUTTON_SIZE,
    height: Sizes.SCROLL_TOP_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
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
        elevation: 18,
      },
    }),
  },
});

export default HealthSafetyInspections;