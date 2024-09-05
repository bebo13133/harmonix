// App/Utils/GlobalStyles.js
import { Platform } from 'react-native';

const selectFont = (options = {}) => {
  const ios = Platform.OS === 'ios';
  let fontFamily;
  if (ios) {
    fontFamily = 'System';
  } else {
    if (options.bold) {
      fontFamily = 'Montserrat-Bold';
    } else if (options.medium) {
      fontFamily = 'Montserrat-Medium';
    } else {
      fontFamily = 'Montserrat-Regular';
    }
  }

  return {
    fontFamily,
    fontWeight: options.bold ? 'bold' : (options.medium ? '500' : 'normal'),
  };
};

export const globalTextStyle = selectFont();
export const globalMediumTextStyle = selectFont({ medium: true });
export const globalBoldTextStyle = selectFont({ bold: true });

export const applyFontToStyle = (style, fontType = 'regular') => {
  switch (fontType) {
    case 'bold':
      return { ...style, ...globalBoldTextStyle };
    case 'medium':
      return { ...style, ...globalMediumTextStyle };
    default:
      return { ...style, ...globalTextStyle };
  }
};