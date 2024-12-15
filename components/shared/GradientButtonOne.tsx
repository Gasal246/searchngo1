import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  colors?: string[];
  disabled?: boolean;
}

const GradientButtonOne: React.FC<GradientButtonProps> = ({ children, onPress, style, colors = ['#4c669f', '#3b5998', '#192f6a'], disabled = false }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]} >
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientButtonOne;
