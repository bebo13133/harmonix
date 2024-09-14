import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { applyFontToStyle } from '../../Utils/GlobalStyles';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';

const DetailsScreen = ({ route }) => {
  const { inspection } = route.params;

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, applyFontToStyle({}, 'bold', Sizes.FONT_SIZE_LARGE)]}>{title}</Text>
      {children}
      <View style={styles.sectionDivider} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Section title="General Information">
        <Text style={styles.detail}>Project No: {inspection.projectNumber}</Text>
        <Text style={styles.detail}>Date: {inspection.date}</Text>
        <Text style={styles.detail}>Address: {inspection.address}</Text>
      </Section>
      
      <Section title="Status">
        <Text style={styles.detail}>Status: {inspection.status}</Text>
        <Text style={styles.detail}>Completion: {inspection.completionPercentage}%</Text>
        <Text style={styles.detail}>Score: {inspection.score}%</Text>
        <Text style={styles.detail}>Started: {inspection.date}</Text>
        <Text style={styles.detail}>Last modified: {inspection.lastModified}</Text>
      </Section>
      
      <Section title="Inspection Type">
        <Text style={styles.detail}>Type: {inspection.formType}</Text>
        <Text style={styles.detail}>Inspector: {inspection.inspectorName}</Text>
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_DARK,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: Colors.WHITE,
    marginBottom: 10,
  },
  detail: {
    color: Colors.TEXT_LIGHT,
    fontSize: Sizes.FONT_SIZE_MEDIUM,
    marginBottom: 15,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.BACKGROUND,
    marginTop: 10,
  },
});

export default DetailsScreen;