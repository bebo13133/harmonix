import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, SafeAreaView, StatusBar,Animated  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Switch } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';
import { useNavigation } from '@react-navigation/native';
import {  globalTextStyle, globalMediumTextStyle, globalBoldTextStyle  } from '../../Utils/GlobalStyles';


const mockData = [
  { id: 1, projectNumber: 'PRJ001', date: '2024-08-28', address: '123 Main St, London', completedBy: 'Dev Team A', status: 'Closed', score: 95, updates: 2 },
  { id: 2, projectNumber: 'PRJ002', date: '2024-08-29', address: '456 Oak Ave, Manchester', completedBy: '', status: 'Open', score: 75, updates: 1 },
  { id: 3, projectNumber: 'PRJ003', date: '2024-09-01', address: '789 Pine Rd, Birmingham', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 4, projectNumber: 'PRJ004', date: '2024-09-02', address: '101 Elm St, Leeds', completedBy: 'Dev Team B', status: 'Closed', score: 88, updates: 3 },
  { id: 5, projectNumber: 'PRJ005', date: '2024-09-03', address: '202 Oak Ln, Liverpool', completedBy: '', status: 'Open', score: 60, updates: 1 },
  { id: 6, projectNumber: 'PRJ006', date: '2024-09-04', address: '303 Maple Ave, Glasgow', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 7, projectNumber: 'PRJ007', date: '2024-09-05', address: '404 Birch Rd, Edinburgh', completedBy: 'Dev Team C', status: 'Closed', score: 92, updates: 2 },
  { id: 8, projectNumber: 'PRJ008', date: '2024-09-06', address: '505 Cedar St, Bristol', completedBy: '', status: 'Open', score: 70, updates: 1 },
  { id: 9, projectNumber: 'PRJ009', date: '2024-09-07', address: '606 Pine Ave, Sheffield', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 10, projectNumber: 'PRJ010', date: '2024-09-08', address: '707 Oak Rd, Newcastle', completedBy: 'Dev Team A', status: 'Closed', score: 85, updates: 2 },
  { id: 11, projectNumber: 'PRJ011', date: '2024-09-09', address: '808 Elm Ln, Cardiff', completedBy: '', status: 'Open', score: 65, updates: 1 },
  { id: 12, projectNumber: 'PRJ012', date: '2024-09-10', address: '909 Maple St, Brighton', completedBy: '', status: 'Draft', score: 0, updates: 0 },
  { id: 13, projectNumber: 'PRJ013', date: '2024-09-11', address: '111 Birch Ave, Oxford', completedBy: 'Dev Team B', status: 'Closed', score: 90, updates: 3 },
  { id: 14, projectNumber: 'PRJ014', date: '2024-09-12', address: '222 Cedar Rd, Cambridge', completedBy: '', status: 'Open', score: 72, updates: 1 },
  { id: 15, projectNumber: 'PRJ015', date: '2024-09-13', address: '333 Pine Ln, York', completedBy: '', status: 'Draft', score: 0, updates: 0 },
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
const renderItem = ({ item }) => (
  <View style={styles.card} accessibilityLabel={`Inspection ${item.projectNumber}`}>
    <View style={styles.cardHeader}>
      <Text style={[styles.projectNumber, globalBoldTextStyle]}>{item.projectNumber}</Text>
      <Text style={[styles.date, globalTextStyle]}>{item.date}</Text>
    </View>
    <Text style={[styles.address, globalMediumTextStyle]}>{item.address}</Text>
    <View style={styles.cardDetails}>
      <View style={[styles.detailColumn, { flex: 2 }]}>
        <Text style={[styles.detailLabel, globalTextStyle]}>Completed By</Text>
        <Text style={[styles.detailValue, globalMediumTextStyle]}>{item.completedBy || 'Not completed'}</Text>
      </View>
      <View style={styles.detailColumn}>
        <Text style={[styles.detailLabel, globalTextStyle]}>Status</Text>
        <Text style={[styles.detailValue, globalBoldTextStyle, { color: item.status === 'Closed' ? Colors.STATUS_CLOSED : item.status === 'Open' ? Colors.STATUS_OPEN : Colors.STATUS_DRAFT }]}>{item.status}</Text>
      </View>
      <View style={styles.detailColumn}>
        <Text style={[styles.detailLabel, globalTextStyle]}>Score</Text>
        <Text style={[styles.detailValue, globalBoldTextStyle]}>{item.score}</Text>
      </View>
      <View style={styles.detailColumn}>
        <Text style={[styles.detailLabel, globalTextStyle]}>Updates</Text>
        <Text style={[styles.detailValue, globalBoldTextStyle]}>{item.updates}</Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <TouchableOpacity style={styles.viewButton} accessibilityLabel={`View details of inspection ${item.projectNumber}`}>
        <Text style={[styles.viewButtonText, globalBoldTextStyle]}>View Details</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityLabel={`Delete inspection ${item.projectNumber}`}>
        <MaterialIcons name="delete" size={24} color={Colors.ERROR} />
      </TouchableOpacity>
    </View>
  </View>
);

export const HealthSafetyInspections = () => {
  const [searchDate, setSearchDate] = useState('');
  const [resultsCount, setResultsCount] = useState('ALL');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setShowScrollTopButton(scrollPosition > 200);
  };

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.BACKGROUND} />
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.newInspectionButton} 
          accessibilityLabel="Create new inspection"
          onPress={() => navigation.navigate('CreateInspectionHs')}
        >
          <Text style={[styles.newInspectionButtonText, globalBoldTextStyle]}>New Inspection</Text>
        </TouchableOpacity>

        <View style={styles.filters}>
          <TextInput
            style={[styles.dateInput, globalTextStyle]}
            placeholder="Search by date"
            value={searchDate}
            onChangeText={setSearchDate}
            accessibilityLabel="Search by date"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={resultsCount}
              style={[styles.picker, globalTextStyle]}
              onValueChange={(itemValue) => setResultsCount(itemValue)}
              accessibilityLabel="Select number of results"
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

        <FlatList
          ref={flatListRef}
          data={mockData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
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
    backgroundColor: Colors.BACKGROUND,
  },
  container: {
    marginTop: 10,
    flex: 1,
    padding: Sizes.PADDING,
  },
  newInspectionButton: {
    backgroundColor: Colors.BUTTON_BACKGROUND,
    padding: Sizes.BUTTON_PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
    alignItems: 'center',
    marginBottom: Sizes.PADDING,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  newInspectionButtonText: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.PADDING,
  },
  dateInput: {
    flex: 1.5,
    backgroundColor: Colors.WHITE,
    padding: Sizes.INPUT_PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
    marginRight: 10,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
  },
  pickerContainer: {
    flex: 2,
    backgroundColor: Colors.WHITE,
    borderRadius: Sizes.BORDER_RADIUS,
    marginRight: 10,
    justifyContent: 'center',
  },
  picker: {
    height: Sizes.PICKER_HEIGHT,
  },
  switchContainer: {
    width: 105,
    height: 34,
    borderRadius: 15,
    padding: 3,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchLabel: {
    fontSize: Sizes.FONT_SIZE_SMALL,
    marginLeft: 8, // Добавено ляво отстояние
    marginRight: 8,
  },
  switchLabelCompleted: {
    color: Colors.SWITCH_LABEL_COMPLETED,
  },
  switchLabelOpen: {
    color: Colors.SWITCH_LABEL_OPEN,
  },
  listContainer: {
    paddingBottom: Sizes.PADDING,
  },
  card: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Sizes.BORDER_RADIUS,
    padding: Sizes.CARD_PADDING,
    marginBottom: Sizes.CARD_MARGIN_BOTTOM,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectNumber: {
    fontSize: Sizes.FONT_SIZE_LARGE,
    color: Colors.WHITE,
  },
  date: {
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    color: Colors.TEXT_LIGHT,
  },
  address: {
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    color: Colors.WHITE,
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailColumn: {
    flex: 1,
  },
  detailLabel: {
    fontSize: Sizes.FONT_SIZE_SMALL,
    color: Colors.TEXT_LIGHT,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    color: Colors.WHITE,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  viewButtonText: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_SMALL,
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.BUTTON_BACKGROUND,
    borderRadius: Sizes.SCROLL_TOP_BUTTON_SIZE / 2,
    width: Sizes.SCROLL_TOP_BUTTON_SIZE,
    height: Sizes.SCROLL_TOP_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
});