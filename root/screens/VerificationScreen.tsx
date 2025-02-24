// VerificationScreen.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSocket } from '../../context/socketContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Verification'>;

const VerificationScreen: React.FC<Props> = ({ route }) => {
  const { socket, isConnected, sendMessage } = useSocket();
  const navigation = useNavigation();
  const { verificationSessionId } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerification = async (confirm: boolean) => {
    if (!socket || !isConnected) {
      Alert.alert('Error', 'Not connected to server. Please try again.');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      sendMessage('submitVerification', {
        verificationSessionId,
        confirm
      });

      // Wait a bit to ensure the message is sent
      await new Promise(resolve => setTimeout(resolve, 500));
      
      Alert.alert(
        confirm ? 'Verification Confirmed' : 'Verification Declined',
        confirm ? 'You have successfully verified your identity.' : 'You have declined this verification request.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20}}>
        <Image source={require('../../assets/images/png/sngcolor.png')} style={{ width: 100, height: 90, objectFit: "contain", aspectRatio: 1/1, }} />
      </View>
      <Text style={styles.title}>Verify Your Identity !!</Text>
      <Text style={styles.subtitle}>Are you trying to sign in on a kiosk ?</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleVerification(true)}
          style={[styles.confirmButton, isSubmitting && styles.disabledButton]}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : "Yes, It's me"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleVerification(false)}
          style={[styles.discardButton, isSubmitting && styles.disabledButton]}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'No, Discard'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#222831",
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#dbdbdb'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 44,
    textAlign: 'center',
    color: '#dbdbdb',
    fontWeight: 'bold'
  },
  buttonContainer: {
    width: '60%',
    gap: 14,
  },
  confirmButton: {
    backgroundColor: '#00C9A3',
    paddingVertical: 5,
    borderRadius: 5
  },
  discardButton: {
    backgroundColor: '#F35248',
    paddingVertical: 5,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'black', 
    textShadowOffset: { width: 0.6, height: 0.6 }, 
    textShadowRadius: 1
  }
});

export default VerificationScreen;