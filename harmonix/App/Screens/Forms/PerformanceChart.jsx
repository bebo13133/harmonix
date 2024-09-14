import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { styled } from 'nativewind';
import Svg, { Circle, Text as SvgText, LinearGradient, Stop } from 'react-native-svg';
import Colors from '../../Utils/Colors';
import { applyFontToStyle } from '../../Utils/GlobalStyles';

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const PerformanceChart = ({ performance, projectData }) => (
  <StyledScrollView className=" mb-4" >
    <StyledView className="p-4"  style={{backgroundColor: Colors.BACKGROUND_DARK, borderRadius:20}}>
      <StyledText style={applyFontToStyle({}, 'bold', 22)} className="mb-2 text-white bold">Performance Overview</StyledText>
      <StyledView className=" rounded-lg shadow-md p-4 mb-4"
        style={{backgroundColor: Colors.BACKGROUND,}}
      >
        <StyledText style={applyFontToStyle({}, 'bold', 17)} className="text-white bold mb-2">Previous Report: {projectData.previousReport}</StyledText>
        <StyledImage
          source={{ uri: projectData.imageUrl }}
          className="w-full h-40 rounded-md mb-4"
        />
        <StyledView className="flex-row justify-between items-center">
          <StyledView className="flex-1">
            <StyledText style={applyFontToStyle({}, 'bold', 24)} className="text-white bold">{performance}%</StyledText>
            <StyledText style={applyFontToStyle({}, 'regular', 17)} className="text-white">Overall Performance</StyledText>
          </StyledView>
          <Svg height="100" width="100">
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#FF0000" stopOpacity="1" />
              <Stop offset="50%" stopColor="#FFFF00" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00FF00" stopOpacity="1" />
            </LinearGradient>
            <Circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e0e0e0"
              strokeWidth="10"
              fill="transparent"
            />
            <Circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#grad)"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={`${performance * 2.83} ${283 - performance * 2.83}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <SvgText
              x="50"
              y="50"
              fontSize="18"
              fontWeight="bold"
              fill={Colors.GRAY}
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {`${performance}%`}
            </SvgText>
          </Svg>
        </StyledView>
      </StyledView>
      <StyledView className=" rounded-lg shadow-md p-4"  style={{backgroundColor: Colors.BACKGROUND,}}>
        <StyledView className="flex-row justify-between mb-2">
          <StyledText style={applyFontToStyle({}, 'regular', 17)} className="text-white">NCN:</StyledText>
          <StyledText style={applyFontToStyle({}, 'bold', 17)} className="text-white">{projectData.ncn}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between mb-2">
          <StyledText style={applyFontToStyle({}, 'regular', 17)} className="text-white">Inspector:</StyledText>
          <StyledText style={applyFontToStyle({}, 'bold', 17)} className="text-white">{projectData.inspector}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between">
          <StyledText style={applyFontToStyle({}, 'regular', 17)} className="text-white">Date:</StyledText>
          <StyledText style={applyFontToStyle({}, 'bold', 17)} className="text-white">{new Date().toLocaleDateString()}</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  </StyledScrollView>
);

export default PerformanceChart;