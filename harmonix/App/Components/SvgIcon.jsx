import React from 'react';
import { SvgXml } from 'react-native-svg';
import { TouchableOpacity } from 'react-native';
import { icons } from '../Utils/icons';


const SvgIcon = ({ name, size = 24, color, onPress, hitSlop }) => {
  const xml = icons[name];
  if (!xml) return null;

  const Icon = <SvgXml xml={xml} width={size} height={size} color={color} />;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} hitSlop={hitSlop}>
        {Icon}
      </TouchableOpacity>
    );
  }

  return Icon;
};

export default SvgIcon;