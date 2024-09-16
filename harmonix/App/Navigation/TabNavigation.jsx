import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import Colors from '../Utils/Colors';
import { applyFontToStyle, Typography } from '../Utils/GlobalStyles';
import Home from '../Screens/HomeScreen/Home';
import Header from '../Screens/Header/Header';
import ProfileSettings from '../Screens/Profile/ProfileSettings';
import NotificationScreen from '../Screens/NotificationScreen/NotificationScreen';
import SearchScreen from '../Screens/SearchScreen/SearchScreen';
import { HealthSafetyInspections } from '../Screens/BookingScreen/HealthSafetyInspections';
import HsCreateForm from '../Screens/Forms/HsCreateForm';
import CustomBottomTabBar from './CustomBottomTabBar';
import CustomHsHeader from '../Screens/Forms/CustomHsHeader';
import EnvCreateForm from '../Screens/Forms/EnvCreateForm';
import QaCreateForm from '../Screens/Forms/QaCreateForm';
import DcFormCreate from '../Screens/Forms/DcFormCreate';
import DetailsScreen from '../Screens/DetailsScreen/DetailsScreen';
import { Ionicons } from '@expo/vector-icons';
import Sizes from '../Utils/Sizes';
import EditInspection from '../Screens/EditInspection/EditInspection';


const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

function TopTabBar({ activeTab, switchTab }) {
  return (
    <View style={styles.topTabBar}>
      <TouchableOpacity
        style={[styles.topTab, activeTab === 'Home' && styles.activeTopTab]}
        onPress={() => switchTab('Home')}
      >
        <Text style={[styles.topTabText, activeTab === 'Home' && styles.activeTopTabText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.topTab, activeTab === 'Search' && styles.activeTopTab]}
        onPress={() => switchTab('Search')}
      >
        <Text style={[styles.topTabText, activeTab === 'Search' && styles.activeTopTabText]}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.topTab, activeTab === 'Notifications' && styles.activeTopTab]}
        onPress={() => switchTab('Notifications')}
      >
        <Text style={[styles.topTabText, activeTab === 'Notifications' && styles.activeTopTabText]}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.topTab, activeTab === 'ProfileSettings' && styles.activeTopTab]}
        onPress={() => switchTab('ProfileSettings')}
      >
        <Text style={[styles.topTabText, activeTab === 'ProfileSettings' && styles.activeTopTabText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

function MainContent({ activeTab, switchTab }) {
  const translateX = useSharedValue(activeTab === 'Home' ? 0 : -width * ['Home', 'Search', 'Notifications', 'ProfileSettings'].indexOf(activeTab));

  useEffect(() => {
    const config = {
      damping: 20,
      stiffness: 150,
    };
    translateX.value = withSpring(-width * ['Home', 'Search', 'Notifications', 'ProfileSettings'].indexOf(activeTab), config);
  }, [activeTab]);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      const index = ['Home', 'Search', 'Notifications', 'ProfileSettings'].indexOf(activeTab);
      const nextTranslateX = event.translationX + (-width * index);

      if (nextTranslateX <= 0 && nextTranslateX >= -width * 3) {
        translateX.value = nextTranslateX;
      }
    })
    .onEnd((event) => {
      const config = {
        damping: 20,
        stiffness: 150,
      };
      const index = ['Home', 'Search', 'Notifications', 'ProfileSettings'].indexOf(activeTab);

      if (event.translationX > width / 4 && index > 0) {
        runOnJS(switchTab)(['Home', 'Search', 'Notifications', 'ProfileSettings'][index - 1]);
      } else if (event.translationX < -width / 4 && index < 3) {
        runOnJS(switchTab)(['Home', 'Search', 'Notifications', 'ProfileSettings'][index + 1]);
      } else {
        translateX.value = withSpring(-width * index, config);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.screen}>
          <HealthSafetyInspections />
        </View>
        <View style={styles.screen}>
          <SearchScreen />
        </View>
        <View style={styles.screen}>
          <NotificationScreen />
        </View>
        <View style={styles.screen}>
          <ProfileSettings />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const HealthSafetyStack = createStackNavigator();

function HealthSafetyNavigator() {
  return (
    <HealthSafetyStack.Navigator>
      <HealthSafetyStack.Screen
        name="HealthSafetyList"
        component={HealthSafetyInspections}
        options={{ header: () => <Header /> }}
      />
      <HealthSafetyStack.Screen
        name="CreateInspectionHs"
        component={HsCreateForm}
        options={{
          header: (props) => <CustomHsHeader {...props} />,
        }}
      />
      <HealthSafetyStack.Screen
        name="CreateInspectionEnvironmental"
        component={EnvCreateForm}
        options={{
          header: (props) => <CustomHsHeader {...props} />,
        }}
      />
      <HealthSafetyStack.Screen
        name="CreateInspectionQa"
        component={QaCreateForm}
        options={{
          header: (props) => <CustomHsHeader {...props} />,
        }}
      />
      <HealthSafetyStack.Screen
        name="CreateInspectionDc"
        component={DcFormCreate}
        options={{
          header: (props) => <CustomHsHeader {...props} />,
        }}
      />
    </HealthSafetyStack.Navigator>
  );
}

function TabNavigator() {
  const [activeTab, setActiveTab] = useState('Home');

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <TopTabBar activeTab={activeTab} switchTab={switchTab} /> */}
      <MainContent activeTab={activeTab} switchTab={switchTab} />
      <CustomBottomTabBar activeTab={activeTab} switchTab={switchTab} />
    </SafeAreaView>
  );
}
const CustomInspectionHeader = ({ navigation, route }) => {
  const { inspection } = route.params;
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.BACKGROUND_DARK} barStyle="light-content" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerDate, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE)]}>{inspection.date}</Text>
          <Text style={[styles.headerInspector, applyFontToStyle({}, 'medium', Sizes.FONT_SIZE_MEDIUM)]}>{inspection.inspectorName}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default function MainNavigator() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HealthSafety"
          component={HealthSafetyNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileSettings"
          component={ProfileSettings}
        />
        <Stack.Screen
          name="InspectionDetails"
          component={DetailsScreen}
          options={({ route, navigation }) => ({
            header: () => <CustomInspectionHeader navigation={navigation} route={route} />,
          })}
        />
        <Stack.Screen
          name="EditInspection"
          component={EditInspection}
          options={({ route }) => ({
            title: `Edit ${route.params.formType} Inspection`,
          })}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    width: width * 4,
  },
  screen: {
    width: width,
  },
  topTabBar: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: Colors.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY,
  },
  topTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTopTab: {
    borderBottomWidth: 4,
    borderBottomColor: "red",
    borderRadius: 10,
  },
  topTabText: {
    ...applyFontToStyle({}, 'regular', 16),
    color: "white",
  },
  activeTopTabText: {
    ...applyFontToStyle({}, 'bold', 16),
    color: "white",
  },
  safeArea: {
    backgroundColor: Colors.BACKGROUND_DARK,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.BACKGROUND_DARK,
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        paddingTop: 44, // Дава допълнително място за статус лентата на iOS
      },
      android: {
        paddingTop: 40,
      },
    }),
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerDate: {
    color: Colors.WHITE,
    marginBottom: 4,
  },
  headerInspector: {
    color: Colors.TEXT_LIGHT,
  },
  moreButton: {
    padding: 5,
  },
});