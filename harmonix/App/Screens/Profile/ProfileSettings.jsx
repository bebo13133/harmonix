import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import Colors from '../../Utils/Colors'; 
import { globalBoldTextStyle } from '../../Utils/GlobalStyles'; 

export default function ProfileSettings() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
          <Text style={[styles.backText, globalBoldTextStyle]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, globalBoldTextStyle]}>Profile Settings</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>Profile Settings Content</Text>
        {/* Тук да се добави съдържанието на настройките на профила - Боби или Ники */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    color: Colors.WHITE, 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20, 
    color: Colors.WHITE, 
    marginRight: 32, 
    fontWeight: 'bold', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    color: Colors.WHITE, 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
});
