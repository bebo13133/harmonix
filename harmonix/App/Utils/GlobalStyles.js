// App/Utils/GlobalStyles.js
import { Platform, PixelRatio, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Базираме се на вертикалния размер на iPhone 11 за изчисляване на скалата
const scale = SCREEN_HEIGHT / 896;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const selectFont = (options = {}) => {
  let fontFamily;
  
  if (options.bold) {
    fontFamily = 'Montserrat-Bold';
  } else if (options.medium) {
    fontFamily = 'Montserrat-Medium';
  } else {
    fontFamily = 'Montserrat-Regular';
  }

  return {
    fontFamily,
    fontWeight: options.bold ? 'bold' : (options.medium ? '500' : 'normal'),
    fontSize: options.size ? normalize(options.size) : undefined,
  };
};

export const globalTextStyle = selectFont();
export const globalMediumTextStyle = selectFont({ medium: true });
export const globalBoldTextStyle = selectFont({ bold: true });

export const applyFontToStyle = (style = {}, fontType = 'regular', size) => {
  let baseStyle;
  switch (fontType) {
    case 'bold':
      baseStyle = globalBoldTextStyle;
      break;
    case 'medium':
      baseStyle = globalMediumTextStyle;
      break;
    default:
      baseStyle = globalTextStyle;
  }
  
  return {
    ...baseStyle,
    ...style,
    fontSize: size ? normalize(size) : (style.fontSize || baseStyle.fontSize),
  };
};

export const Typography = {
  header: applyFontToStyle({}, 'bold', 24),
  subheader: applyFontToStyle({}, 'medium', 20),
  body: applyFontToStyle({}, 'regular', 16),
  caption: applyFontToStyle({}, 'regular', 14),
  // Добавете повече предефинирани стилове според нуждите
};