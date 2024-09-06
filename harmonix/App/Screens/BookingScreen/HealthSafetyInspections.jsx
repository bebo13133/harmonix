import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, SafeAreaView, StatusBar, Animated, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';
import { applyFontToStyle, globalBoldTextStyle } from '../../Utils/GlobalStyles';
import moment from 'moment';

const mockData = [
  { id: 1, projectNumber: 'PRJ001', date: '2024-09-13', address: '123 Main St, London', completedBy: 'Dev Team A', status: 'Closed', score: 95, updates: 2 },
  { id: 2, projectNumber: 'PRJ002', date: '2024-09-12', address: '456 Oak Ave, Manchester', completedBy: '', status: 'Open', score: 75, updates: 1 },
  { id: 3, projectNumber: 'PRJ003', date: '2024-09-11', address: '789 Pine Rd, Birmingham', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 4, projectNumber: 'PRJ004', date: '2024-09-10', address: '101 Elm St, Leeds', completedBy: 'Dev Team B', status: 'Closed', score: 88, updates: 3 },
  { id: 5, projectNumber: 'PRJ005', date: '2024-09-09', address: '202 Oak Ln, Liverpool', completedBy: '', status: 'Open', score: 60, updates: 1 },
  { id: 6, projectNumber: 'PRJ006', date: '2024-09-08', address: '303 Maple Ave, Glasgow', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 7, projectNumber: 'PRJ007', date: '2024-09-07', address: '404 Birch Rd, Edinburgh', completedBy: 'Dev Team C', status: 'Closed', score: 92, updates: 2 },
  { id: 8, projectNumber: 'PRJ008', date: '2024-09-06', address: '505 Cedar St, Bristol', completedBy: '', status: 'Open', score: 70, updates: 1 },
  { id: 9, projectNumber: 'PRJ009', date: '2024-09-05', address: '606 Pine Ave, Sheffield', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 10, projectNumber: 'PRJ010', date: '2024-09-04', address: '707 Oak Rd, Newcastle', completedBy: 'Dev Team A', status: 'Closed', score: 85, updates: 2 },
  { id: 11, projectNumber: 'PRJ011', date: '2024-09-03', address: '123 Main St, London', completedBy: 'Dev Team A', status: 'Closed', score: 95, updates: 2 },
  { id: 12, projectNumber: 'PRJ012', date: '2024-09-02', address: '456 Oak Ave, Manchester', completedBy: '', status: 'Open', score: 75, updates: 1 },
  { id: 13, projectNumber: 'PRJ013', date: '2024-09-01', address: '789 Pine Rd, Birmingham', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 14, projectNumber: 'PRJ014', date: '2024-08-31', address: '101 Elm St, Leeds', completedBy: 'Dev Team B', status: 'Closed', score: 88, updates: 3 },
  { id: 15, projectNumber: 'PRJ015', date: '2024-08-30', address: '202 Oak Ln, Liverpool', completedBy: '', status: 'Open', score: 60, updates: 1 },
  { id: 16, projectNumber: 'PRJ010', date: '2024-09-04', address: '707 Oak Rd, Newcastle', completedBy: 'Dev Team A', status: 'Closed', score: 85, updates: 2 },
  { id: 17, projectNumber: 'PRJ011', date: '2024-09-03', address: '123 Main St, London', completedBy: 'Dev Team A', status: 'Closed', score: 95, updates: 2 },
  { id: 18, projectNumber: 'PRJ012', date: '2024-09-02', address: '456 Oak Ave, Manchester', completedBy: '', status: 'Open', score: 75, updates: 1 },
  { id: 19, projectNumber: 'PRJ013', date: '2024-09-01', address: '789 Pine Rd, Birmingham', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 20, projectNumber: 'PRJ014', date: '2024-08-31', address: '101 Elm St, Leeds', completedBy: 'Dev Team B', status: 'Closed', score: 88, updates: 3 },
  { id: 21, projectNumber: 'PRJ015', date: '2024-08-30', address: '202 Oak Ln, Liverpool', completedBy: '', status: 'Open', score: 60, updates: 1 },
];

const CustomSwitch = ({ value, onValueChange }) => {
  const [toggleAnimation] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    onValueChange(!value);
  };

  const switchTranslate = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 68],
  });

  const textTranslate = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      style={[
        styles.switchContainer,
        { backgroundColor: value ? Colors.STATUS_CLOSED : Colors.STATUS_OPEN }
      ]}
    >
      <Animated.View
        style={[
          styles.switchThumb,
          { transform: [{ translateX: switchTranslate }] }
        ]}
      />
      <Animated.Text style={[
        styles.switchLabel,
        globalBoldTextStyle,
        { color: Colors.WHITE, transform: [{ translateX: textTranslate }] }
      ]}>
        {value ? 'Closed' : 'Open'}
      </Animated.Text>
    </TouchableOpacity>
  );
};

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

const filterData = (data, count) => {
  if (count === 'ALL') return data;
  return data.slice(0, parseInt(count, 10));
};

const renderItem = ({ item }) => (
  <View style={styles.card} accessibilityLabel={`Inspection ${item.projectNumber}`}>
    <View style={styles.cardHeader}>
      <Text style={[styles.projectNumber, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE)]}>{item.projectNumber}</Text>
      <Text style={[styles.date, applyFontToStyle({}, 'regular', Sizes.FONT_SIZE_LARGE)]}>{item.date}</Text>
    </View>
    <Text style={[styles.address, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_LARGE)]}>{item.address}</Text>
    <View style={styles.cardDetails}>
      <View style={[styles.detailColumn, { flex: 2 }]}>
        <Text style={[styles.detailLabel, applyFontToStyle({}, 'bold', 17)]}>Completed By</Text>
        <Text style={[styles.detailValue, applyFontToStyle({}, 'medium', 15)]}>{item.completedBy || 'Not completed'}</Text>
      </View>
      <View style={styles.detailColumn}>
        <Text style={[styles.detailLabel, applyFontToStyle({}, 'bold', 17)]}>Status</Text>
        <Text style={[styles.detailValue, applyFontToStyle({}, 'bold', 15), { textAlign: 'center', color: item.status === 'Closed' ? Colors.STATUS_CLOSED : item.status === 'Open' ? Colors.STATUS_OPEN : Colors.STATUS_DRAFT }]}>{item.status}</Text>
      </View>
      <View style={styles.detailColumn}>
        <Text style={[styles.detailLabel, applyFontToStyle({}, 'bold', 17)]}>Score</Text>
        <Text style={[styles.detailValue, applyFontToStyle({}, 'bold', 15), { textAlign: 'center' }]}>{item.score}%</Text>
      </View>
      <View style={styles.detailColumn}>
        <Text style={[styles.detailLabel, applyFontToStyle({}, 'bold', 17)]}>Update</Text>
        <Text style={[styles.detailValue, applyFontToStyle({}, 'bold', 15), { textAlign: 'center' }]}>{item.updates}</Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <TouchableOpacity style={styles.viewButton} accessibilityLabel={`View details of inspection ${item.projectNumber}`}>
        <Text style={[styles.viewButtonText, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_MEDIUM)]}>View Details</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityLabel={`Delete inspection ${item.projectNumber}`}>
        <MaterialIcons name="delete" size={24} color={Colors.ERROR} />
      </TouchableOpacity>
    </View>
  </View>
);

export const HealthSafetyInspections = () => {
  const [resultsCount, setResultsCount] = useState('ALL');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const sectionListRef = useRef(null);

  const filteredData = filterData(mockData, resultsCount);
  const sections = groupInspectionsByDate(filteredData);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BACKGROUND_DARK} />
      <View style={styles.container}>
        <View style={styles.filters}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={resultsCount}
              style={[styles.picker, applyFontToStyle()]}
              onValueChange={(itemValue) => setResultsCount(itemValue)}
              accessibilityLabel="Select number of results"
              itemStyle={applyFontToStyle({}, 'regular', Sizes.FONT_SIZE_MEDIUM)}
            >
              <Picker.Item label="ALL" value="ALL" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="20" value="20" />
              <Picker.Item label="50" value="50" />
              <Picker.Item label="100" value="100" />
            </Picker>
          </View>
          <CustomSwitch
            value={showCompleted}
            onValueChange={setShowCompleted}
          />
        </View>

        <SectionList
          ref={sectionListRef}
          sections={sections}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE)]}>{title}</Text>
          )}
          contentContainerStyle={styles.listContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          scrollIndicatorInsets={{ right: 1 }}
          indicatorStyle="white"
        />

        {showScrollTopButton && (
          <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
            <MaterialIcons name="arrow-upward" size={24} color={Colors.WHITE} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_DARK,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 28,
    marginBottom: Sizes.PADDING,

  },
  pickerContainer: {
    flex: 2,
    backgroundColor: Colors.WHITE,
    borderRadius: Sizes.BORDER_RADIUS,
    justifyContent: 'center',
  },
  picker: {
    height:12,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
  },
  switchContainer: {
    width: 105,
    height: 34,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  switchThumb: {
    width: 30,
    height: 30,
    borderRadius: 13,
    backgroundColor: Colors.WHITE,
  },
  switchLabel: {
    fontSize: Sizes.FONT_SIZE_SMALL,
    marginLeft: 8,
    marginRight: 8,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectNumber: {
    // fontSize: Sizes.FONT_SIZE_LARGE,
    color: Colors.WHITE,
  },
  date: {
    // fontSize: Sizes.FONT_SIZE_MEDIUM,
    color: Colors.TEXT_LIGHT,
  },
  address: {
    // fontSize: Sizes.FONT_SIZE_MEDIUM,
    color: Colors.WHITE,
    marginBottom: 30,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailColumn: {
    flex: 1,
    gap: 10,
  },
  detailLabel: {
    color: Colors.TEXT_LIGHT,
    width: '100%',
    marginBottom: 5,
    // fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  detailValue: {
    color: Colors.WHITE,
    // fontSize: 13,
    textAlign: 'left',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: Colors.BUTTON_BACKGROUND,
    padding: 10,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: 'center',
  },
  viewButtonText: {
    color: Colors.WHITE,
    // fontSize: Sizes.FONT_SIZE_SMALL,
  },
  sectionHeader: {
    // fontSize: Sizes.FONT_SIZE_LARGE,
    color: Colors.TEXT_LIGHT,
    marginVertical: 10,
    backgroundColor: Colors.BACKGROUND_DARK,
    paddingHorizontal: 10,
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
        elevation: 18, // Увеличаваме стойността на elevation за по-видима сянка
      },
    }),
  },
});

export default HealthSafetyInspections;
