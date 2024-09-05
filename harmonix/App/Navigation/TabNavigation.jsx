import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import Colors from '../Utils/Colors';
import Home from '../Screens/HomeScreen/Home';
import Header from '../Screens/Header/Header';
import ProfileSettings from '../Screens/Profile/ProfileSettings';
import NotificationScreen from '../Screens/NotificationScreen/NotificationScreen';
import SearchScreen from '../Screens/SearchScreen/SearchScreen';
import { HealthSafetyInspections } from '../Screens/BookingScreen/HealthSafetyInspections';
import HsCreateForm from '../Screens/Forms/HsCreateForm';

const Stack = createStackNavigator();
const { width } = Dimensions.get('window');

const selectFont = (options = {}) => {
  const ios = Platform.OS === 'ios';
  return {
    fontFamily: ios
      ? options.bold
        ? 'System'
        : 'System'
      : options.bold
        ? 'Montserrat-Bold'
        : 'Montserrat-Regular',
    fontWeight: options.bold ? 'bold' : 'normal',
  };
};

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

function BottomTabBar({ activeTab, switchTab }) {
  return (
    <View style={styles.bottomTabBar}>
      <TouchableOpacity
        style={styles.bottomTab}
        onPress={() => switchTab('Home')}
      >
        <FontAwesome name="home" size={26} color={activeTab === 'Home' ? Colors.ACTIVE : Colors.GRAY} />
        <Text style={[styles.bottomTabText, { color: activeTab === 'Home' ? Colors.ACTIVE : Colors.GRAY }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomTab}
        onPress={() => switchTab('Search')}
      >
        <Feather name="search" size={26} color={activeTab === 'Search' ? Colors.ACTIVE : Colors.GRAY} />
        <Text style={[styles.bottomTabText, { color: activeTab === 'Search' ? Colors.ACTIVE : Colors.GRAY }]}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomTab}
        onPress={() => switchTab('Notifications')}
      >
        <Ionicons name="notifications" size={26} color={activeTab === 'Notifications' ? Colors.ACTIVE : Colors.GRAY} />
        <Text style={[styles.bottomTabText, { color: activeTab === 'Notifications' ? Colors.ACTIVE : Colors.GRAY }]}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomTab}
        onPress={() => switchTab('ProfileSettings')}
      >
        <FontAwesome name="user" size={26} color={activeTab === 'ProfileSettings' ? Colors.ACTIVE : Colors.GRAY} />
        <Text style={[styles.bottomTabText, { color: activeTab === 'ProfileSettings' ? Colors.ACTIVE : Colors.GRAY }]}>Profile</Text>
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
    .activeOffsetX([-10, 10]) // Това ще позволи вертикално скролване, докато не се достигне хоризонтално отместване от 10 пиксела
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
          <Home />
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
        options={{ header: () => <Header /> }} // Стандартен хедър за списъка
      />
      <HealthSafetyStack.Screen 
        name="CreateInspectionHs" 
        component={HsCreateForm}
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
    <View style={styles.container}>
      <TopTabBar activeTab={activeTab} switchTab={switchTab} />
      <MainContent activeTab={activeTab} switchTab={switchTab} />
      <BottomTabBar activeTab={activeTab} switchTab={switchTab} />
    </View>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation, route, options }) => {
          // Не показваме хедър за HealthSafety навигатора, тъй като той има свой CustomHsHeader
          if (route.name === 'HealthSafety') {
            return null;
          }
          // За всички останали екрани показваме стандартния Header
          return <Header navigation={navigation} />;
        },
      })}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="HealthSafety" 
        component={HealthSafetyNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
    </Stack.Navigator>
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
    width: width * 4, // Актуализирано за нов брой табове
  },
  screen: {
    width: width,
  },
  topTabBar: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY,
  },
  topTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTopTab: {
    borderBottomWidth: 4,  // Увеличено подчертаване
    borderBottomColor: "red", // Променено за активния таб
    borderRadius: 10,
  },
  topTabText: {
    ...selectFont(),
    color: Colors.GRAY,
    fontSize: 12,
  },
  activeTopTabText: {
    color: Colors.ACTIVE, // Променено за активния текст
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#e6e6e6',
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY,
  },
  bottomTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomTabText: {
    ...selectFont(),
    fontSize: 12,
    marginTop: 4,
    color: '#666666'
  },
});
