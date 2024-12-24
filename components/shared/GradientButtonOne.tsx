import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, ViewStyle, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  colors?: string[];
  disabled?: boolean;
}

const GradientButtonOne: React.FC<GradientButtonProps> = ({ 
  children, 
  onPress, 
  style, 
  colors = ['#4c669f', '#3b5998', '#192f6a'], 
  disabled = false 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Dim the colors slightly when the button is pressed
  const dimmedColors = colors.map(color => adjustColorBrightness(color, -30));

  return (
    <TouchableWithoutFeedback
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={isPressed ? dimmedColors : colors}
        style={[styles.gradient, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

// Function to adjust the brightness of a color
const adjustColorBrightness = (color: string, amount: number): string => {
  let usePound = false;

  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);

  let r = Math.max(0, Math.min(255, (num >> 16) + amount));
  let g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  let b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));

  return (usePound ? '#' : '') + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 25,
    overflow: 'hidden',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientButtonOne;
