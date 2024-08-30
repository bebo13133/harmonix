import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';

const QuickAccessButton = ({ title, icon, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.quickAccessButtonContainer}>
    <LinearGradient
      colors={['#8B0000', '#4B0000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.quickAccessButton, { opacity: 0.7 }]}
    >
      <MaterialIcons name={icon} size={40} color={Colors.WHITE} />
      <Text style={styles.quickAccessButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const Home = () => {
  const navigation = useNavigation();

  const quickAccessItems = [
    { title: 'Health & Safety', icon: 'security', route: 'HealthSafety' },
    { title: 'Observation', icon: 'visibility', route: 'ObservationInspections' },
    { title: 'Scaffold', icon: 'build', route: 'ScaffoldInspections' },
    { title: 'Temporary Works', icon: 'construction', route: 'TemporaryWorksInspections' },
  ];

  return (
    <ScrollView style={styles.container} >
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://harmonix.emage.co.uk/storage/photos/1714728588.jpg' }}
          style={styles.backgroundImage}
        />
        <View style={styles.darkOverlay} />
        <Text style={styles.welcome}>Building a Safer Future Together</Text>
      </View>


      <View style={styles.content}>
        <View style={styles.quickAccessContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item, index) => (
              <QuickAccessButton
                key={index}
                title={item.title}
                icon={item.icon}
                onPress={() => navigation.navigate(item.route)}
              />
            ))}
          </View>
        </View>

        <LinearGradient
          colors={['#2c3e50', '#3498db']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.recentActivityContainer}
        >
          <Text style={styles.gradientSectionTitle}>Recent Activity</Text>
          <Text style={styles.gradientPlaceholderText}>No recent activities</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#2c3e50', '#3498db']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsContainer}
        >
          <Text style={styles.gradientSectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.gradientStatNumber}>12</Text>
              <Text style={styles.gradientStatLabel}>Open</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.gradientStatNumber}>5</Text>
              <Text style={styles.gradientStatLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.gradientStatNumber}>98%</Text>
              <Text style={styles.gradientStatLabel}>Safety</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 180,
    justifyContent: 'center',
    padding: Sizes.PADDING,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden', 
  },
  welcome: {
    color: Colors.WHITE,
    fontSize: Sizes.FONT_SIZE_LARGE * 2,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.9)', 
    textShadowOffset: { width: 3, height: 4 }, 
    textShadowRadius: 16, 
    textAlign: 'center', 
  },
  content: {
    paddingTop: Sizes.PADDING / 2,
  },
  quickAccessContainer: {
    padding: Sizes.PADDING,
    paddingBottom: Sizes.PADDING / 2,
  },
  sectionTitle: {
    fontSize: Sizes.FONT_SIZE_LARGE,
    fontWeight: 'bold',
    marginBottom: Sizes.PADDING / 2,
    color: Colors.BLACK,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessButtonContainer: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: Sizes.PADDING,
  },
  quickAccessButton: {
    flex: 1,
    borderRadius: Sizes.BORDER_RADIUS,
    padding: Sizes.BUTTON_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  quickAccessButtonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    fontSize: Sizes.FONT_SIZE_MEDIUM,
  },
  recentActivityContainer: {
    padding: Sizes.PADDING,
    marginHorizontal: Sizes.PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statsContainer: {
    padding: Sizes.PADDING,
    marginTop: Sizes.PADDING,
    marginBottom: Sizes.PADDING,
    marginHorizontal: Sizes.PADDING,
    borderRadius: Sizes.BORDER_RADIUS,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  gradientSectionTitle: {
    fontSize: Sizes.FONT_SIZE_LARGE,
    fontWeight: 'bold',
    marginBottom: Sizes.PADDING / 2,
    color: Colors.WHITE,
  },
  gradientPlaceholderText: {
    color: Colors.WHITE,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  gradientStatNumber: {
    fontSize: Sizes.FONT_SIZE_LARGE,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  gradientStatLabel: {
    color: Colors.WHITE,
    marginTop: 5,
    fontSize: Sizes.FONT_SIZE_SMALL,
    opacity: 0.9,
  },
});

export default Home;
