import { StyleSheet, Dimensions, Platform } from 'react-native';
import Colors from '../../Utils/Colors';
import Sizes from '../../Utils/Sizes';

const { width } = Dimensions.get('window');

const selectFont = (options = {}) => {
    const ios = Platform.OS === 'ios';
    return {
        fontFamily: ios
            ? options.bold
                ? 'System'
                : 'System'
            : options.bold
                ? 'Roboto-Bold'
                : 'Roboto-Regular',
        fontWeight: options.bold ? 'bold' : 'normal',
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.PADDING,
    },
    backButtonText: {
        color: Colors.WHITE,
        marginLeft: 10,
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        ...selectFont(),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    formTitle: {
        fontSize: Sizes.FONT_SIZE_LARGE,
        fontWeight: 'bold',
        color: Colors.WHITE,
        textAlign: 'center',
        marginVertical: Sizes.PADDING,
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    performanceContainer: {
        backgroundColor: Colors.BACKGROUND_DARK,
        padding: Sizes.PADDING,
        alignItems: 'center',
        borderColor: Colors.RED_BORDER,
        borderWidth: 1,
        marginBottom: Sizes.PADDING,
        borderRadius: Sizes.BORDER_RADIUS,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    projectImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: Sizes.PADDING,
        borderRadius: Sizes.BORDER_RADIUS,
    },
    previousReportText: {
        color: Colors.WHITE,
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        fontWeight: 'bold',
        marginBottom: Sizes.PADDING,
        textAlign: 'center',
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    performanceText: {
        color: Colors.FORM_TEXT,
        fontSize: Sizes.FONT_SIZE_SMALL,
        marginTop: Sizes.PADDING / 2,
        ...selectFont(),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    formContainer: {
        padding: Sizes.PADDING,
    },
    pickerContainer: {
        marginBottom: Sizes.PADDING * 1.5,
    },
    label: {
        color: Colors.FORM_TEXT,
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        marginBottom: Sizes.PADDING / 2,
        fontWeight: 'bold',
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    pickerWrapper: {
        borderRadius: Sizes.BORDER_RADIUS,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    picker: {
        height: Sizes.PICKER_HEIGHT,
        color: Colors.WHITE,
        ...selectFont(),
    },
    sectionContainer: {
        marginBottom: Sizes.PADDING * 1.5,
        // Добавяме сянка за целия контейнер на секцията
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Sizes.PADDING,
        paddingRight: Sizes.PADDING * 2, 
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
        overflow: 'hidden',
        // Добавяме допълнителна сянка за заглавието
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        ...selectFont({ bold: true }),
        fontSize: Sizes.FONT_SIZE_MEDIUM - 2,
        color: Colors.WHITE,
        flexShrink: 1,
        marginRight: 20,
        flex: 1,
        // Добавяме сянка на текста за по-добър контраст
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    expandedContent: {
        padding: Sizes.PADDING,
        borderRadius: Sizes.BORDER_RADIUS,
        // Добавяме сянка за разширеното съдържание
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    questionContainer: {
        marginBottom: Sizes.PADDING * 1.2,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.PADDING / 2,
    },
    questionText: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        flex: 1,
    },
    checkboxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Sizes.PADDING / 2,
    },
    checkboxWrapper: {
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    checkboxLabel: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        marginTop: 4,
        color: Colors.WHITE,
    },
    additionalFieldsContainer: {
        marginTop: Sizes.PADDING / 2,
    },
    commentInput: {
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING,
        marginBottom: Sizes.PADDING / 2,
        width: '100%',
        borderWidth: 1,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    imageButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Sizes.PADDING / 2,
    },
    imagePickerButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: Sizes.PADDING / 4,
    },
    imagePickerButtonText: {
        ...selectFont({ bold: true }),
        color: Colors.WHITE,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginTop: Sizes.PADDING / 2,
    },
    imageWrapper: {
        marginRight: Sizes.PADDING / 2,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: Sizes.BORDER_RADIUS,
    },
    imageSize: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        color: Colors.WHITE,
        textAlign: 'center',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING,
        width: '80%',
    },
    modalTitle: {
        ...selectFont({ bold: true }),
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        marginBottom: Sizes.PADDING / 2,
    },
    modalDescription: {
        ...selectFont(),
        fontSize: Sizes.FONT_SIZE_SMALL,
        marginBottom: Sizes.PADDING,
    },
    closeButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING / 2,
        alignItems: 'center',
    },
    closeButtonText: {
        ...selectFont({ bold: true }),
        color: Colors.WHITE,
    },
    previewModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    previewImage: {
        width: width * 0.9,
        height: width * 0.9,
    },
    closePreviewButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 10,
    },
    deleteImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        padding: 4,
    },
    additionalSection: {
        marginBottom: Sizes.PADDING * 2,
        padding: Sizes.PADDING,
        backgroundColor: Colors.CARD_BACKGROUND,
        borderRadius: Sizes.BORDER_RADIUS,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    additionalSectionTitle: {
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        fontWeight: 'bold',
        color: Colors.WHITE,
        marginBottom: Sizes.PADDING,
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    additionalSectionInput: {
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
        padding: Sizes.PADDING,
        minHeight: 120,
        textAlignVertical: 'top',
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        color: Colors.TEXT,
    },
    signatureSection: {
        marginBottom: Sizes.PADDING * 2,
        padding: Sizes.PADDING,
        backgroundColor: Colors.CARD_BACKGROUND,
        borderRadius: Sizes.BORDER_RADIUS,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    signatureSectionTitle: {
        fontSize: Sizes.FONT_SIZE_MEDIUM,
        fontWeight: 'bold',
        color: Colors.WHITE,
        marginBottom: Sizes.PADDING,
        ...selectFont({ bold: true }),
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    signatureContainer: {
        height: 250,
        backgroundColor: Colors.WHITE,
        borderRadius: Sizes.BORDER_RADIUS,
        overflow: 'hidden',
    },
    signatureSvg: {
        backgroundColor: Colors.WHITE,
    },
    clearButton: {
        backgroundColor: Colors.BUTTON_BACKGROUND,
        padding: Sizes.PADDING / 2,
        borderRadius: Sizes.BORDER_RADIUS,
        alignItems: 'center',
        marginTop: Sizes.PADDING,
        alignSelf: 'flex-end',
        width: 100,
    },
    clearButtonText: {
        color: Colors.WHITE,
        fontSize: Sizes.FONT_SIZE_SMALL,
        fontWeight: 'bold',
    },
    
   

});
export default styles;