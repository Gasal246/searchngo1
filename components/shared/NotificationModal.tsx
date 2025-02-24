import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSocket } from '../../context/socketContext';

type RootStackParamList = {
  Verification: {
    verificationSessionId: string;
    userId: string;
  };
  [key: string]: any | undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string;
  data?: any;
}

const NotificationModal = ({ visible, onClose, title, body, data }: NotificationModalProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { socket, isConnected, sendMessage } = useSocket();

  const handleClose = () => {
    if (!socket || !isConnected) {
      Alert.alert('Error', 'Not connected to server. Please try again.');
      return;
    }

    if (data?.verificationSessionId) {
      sendMessage('submitVerification', {
        verificationSessionId: data.verificationSessionId,
        confirm: false
      });
    }
    onClose();
  };

  const handlePress = () => {
    console.log(data)
    onClose();
    if (data?.type === 'verification' && data?.verificationSessionId && data?.userId) {
      navigation.navigate('Verification', {
        verificationSessionId: data.verificationSessionId,
        userId: data.userId
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalBody}>{body}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={handlePress}
            >
              <Text style={styles.textStyle}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={handleClose}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
  },
  modalView: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#FF6B6B',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationModal;
