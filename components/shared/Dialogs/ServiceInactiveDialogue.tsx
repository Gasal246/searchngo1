import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { BlurView } from 'expo-blur';
import { loadServiceInactiveModal } from '../../../redux/slices/remoteModalSlice';
import { AntDesign, Entypo } from '@expo/vector-icons';

const ServiceInactiveDialogue = () => {
    const modalVisible = useSelector((state: RootState) => state.remoteModals.serviceInactiveModal);
    const dispatch = useDispatch<AppDispatch>();

    const closeModal = () => {
        dispatch(loadServiceInactiveModal(false));
    }

    return (
        <View>
            <View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                >
                    <BlurView experimentalBlurMethod="dimezisBlurView" intensity={60} tint="dark" style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.close_button} onPress={closeModal}>
                            <Entypo name="cross" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text 
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginBottom: 10,
                                        color: 'white',
                                        textAlign: 'center'
                                    }}
                                >⚠️ Service Inactive..</Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: 'white',
                                        textAlign: 'center',
                                        marginHorizontal: 30,
                                        fontWeight: '500'
                                    }}
                                >
                                    This service is currently inactive, We are working on it, waiting for the service to be up in service areas..
                                </Text>
                                <TouchableOpacity onPress={closeModal}
                                    style={{
                                        backgroundColor: '#545454',
                                        padding: 10,
                                        borderRadius: 10,
                                        marginTop: 20,
                                        alignItems: 'center',
                                        width: 150,
                                        marginHorizontal: 'auto'
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Ok</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </BlurView>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    close_button: {
        backgroundColor: 'black',
        padding: 10,
        position: 'absolute',
        top: 30,
        right: 10,
        borderRadius: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        position: 'relative',
    },
    modalContent: {
        width: '96%',
    },
})

export default ServiceInactiveDialogue;
