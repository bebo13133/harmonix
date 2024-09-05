import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { styled } from 'nativewind';
import Svg, { Circle, Text as SvgText, LinearGradient, Stop } from 'react-native-svg';
import Colors from '../../Utils/Colors';

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const PerformanceChart = ({ performance, projectData }) => (
  <StyledScrollView className="bg-gray-100 mb-4">
    <StyledView className="p-4">
      <StyledText className="text-lg font-bold mb-2 text-gray-800">Performance Overview</StyledText>
      <StyledView className="bg-white rounded-lg shadow-md p-4 mb-4">
        <StyledText className="text-sm text-gray-600 mb-2">Previous Report: {projectData.previousReport}</StyledText>
        <StyledImage
          source={{ uri: projectData.imageUrl }}
          className="w-full h-40 rounded-md mb-4"
        />
        <StyledView className="flex-row justify-between items-center">
          <StyledView className="flex-1">
            <StyledText className="text-xl font-bold text-gray-800">{performance}%</StyledText>
            <StyledText className="text-sm text-gray-600">Overall Performance</StyledText>
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
      <StyledView className="bg-white rounded-lg shadow-md p-4">
        <StyledView className="flex-row justify-between mb-2">
          <StyledText className="text-gray-600">NCN:</StyledText>
          <StyledText className="font-bold text-gray-800">{projectData.ncn}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between mb-2">
          <StyledText className="text-gray-600">Inspector:</StyledText>
          <StyledText className="font-bold text-gray-800">{projectData.inspector}</StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between">
          <StyledText className="text-gray-600">Date:</StyledText>
          <StyledText className="font-bold text-gray-800">{new Date().toLocaleDateString()}</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  </StyledScrollView>
);

export default PerformanceChart;