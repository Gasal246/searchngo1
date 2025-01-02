import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TimeCounterProps {
  targetDate: string;
  textStyle?: any // The date string to count down to
}

const TimeCounter: React.FC<TimeCounterProps> = ({ targetDate, textStyle }) => {
  const [timeLeft, setTimeLeft] = useState('');

  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return 'Time’s up!';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${days} Days ${hours} hours ${minutes} min ${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <Text style={textStyle}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default TimeCounter;
