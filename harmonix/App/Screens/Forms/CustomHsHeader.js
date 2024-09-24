import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Menu, MenuItem } from 'react-native-material-menu';
import Colors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { applyFontToStyle } from '../../Utils/GlobalStyles';

const CustomHsHeader = ({ sections, currentSectionIndex, onSectionChange, formData, topInset = 0 }) => {
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);

    const calculateCompletionPercentage = (section) => {
        if (!section || !Array.isArray(section) || section.length < 2 || !section[1]?.questions) {
            return 0;
        }

        const sectionKey = section[0];
        const sectionData = section[1];
        const totalQuestions = sectionData.questions.length;
        
        let completedQuestions = 0;
        sectionData.questions.forEach(question => {
            const questionId = question.id;
            if (formData?.formSections?.[sectionKey]?.selectedStatuses?.[questionId]) {
                completedQuestions++;
            }
        });

        return Math.round((completedQuestions / totalQuestions) * 100);
    };

    const currentSection = Array.isArray(sections) && sections.length > currentSectionIndex
        ? sections[currentSectionIndex]
        : null;

    const sectionTitle = currentSection && currentSection[1] ? currentSection[1].title : 'Select Section';
    const questionsCount = currentSection && currentSection[1] && currentSection[1].questions ? currentSection[1].questions.length : 0;
    const completionPercentage = currentSection ? calculateCompletionPercentage(currentSection) : 0;

    return (
        <View style={[styles.header]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.WHITE} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Menu
                    visible={visible}
                    anchor={
                        <TouchableOpacity onPress={showMenu} style={styles.menuButton}>
                            <Text style={[styles.title, applyFontToStyle({}, 'bold',22)]}>{sectionTitle}</Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color={Colors.WHITE} />
                        </TouchableOpacity>
                    }
                    onRequestClose={hideMenu}
                >
                    {Array.isArray(sections) && sections.map((section, index) => (
                        <MenuItem
                            key={index}
                            onPress={() => {
                                onSectionChange(index);
                                hideMenu();
                            }}
                        >
                            <Text style={applyFontToStyle({},'bold',20)}>{section && section[1] && section[1].title ? section[1].title : `Section ${index + 1}`}</Text>
                        </MenuItem>
                    ))}
                </Menu>

                <Text style={[styles.subtitle, applyFontToStyle({},'regular',18)]}>
                    {`${questionsCount} questions | ${completionPercentage}% complete`}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.BACKGROUND,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: Platform.OS === 'android' ? 40 : 0, 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    backButton: {
        marginRight: 15,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: Colors.WHITE,
        marginRight: 5,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.WHITE,
        marginTop: 5,
    },
});

export default CustomHsHeader;