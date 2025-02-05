import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { loadChangeBaseCampModal } from '../../../redux/slices/remoteModalSlice';
import { Entypo } from '@expo/vector-icons'

const ChangeBaseCampDialogue = () => {
    const modalVisible = useSelector((state: RootState) => state.remoteModals.changeBaseCampModal)

    const dispatch = useDispatch<AppDispatch>()
    const toggleModal = () => {
        dispatch(loadChangeBaseCampModal(!modalVisible));
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.close_button} onPress={toggleModal}>
                            <Entypo name="cross" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.connectivity_view}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Change YOur Base Camp Here:</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        padding: 10,
        backgroundColor: '#ffffff',
        marginVertical: 5,
        borderRadius: 8,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    close_button: {
        backgroundColor: 'black',
        padding: 10,
        position: 'absolute',
        top: 10,
        right: 10,
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
    flex_container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    connectivity_view: {
        borderColor: "white",
        borderWidth: 2,
        marginTop: 20,
        borderRadius: 22,
        paddingVertical: 22,
        paddingHorizontal: 20,
        backgroundColor: 'black',
    },
    connectivity_text: {
        color: "white",
        fontSize: 24,
        fontWeight: "500",
    },
    connectivity_desc: {
        color: "white",
        fontSize: 13,
    },
    location_view: {
        backgroundColor: "white",
        padding: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginVertical: 15,
    },
    location_title: {
        color: "gray",
        fontSize: 16,
        textAlign: "center",
    },
    location_desc: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "500",
    },
    textSubmit: {
        color: "white",
        fontWeight: "700",
        fontSize: 18,
    },
    not_found_view: {
        backgroundColor: '#F35248',
        width: '100%',
        padding: 10,
        alignContent: 'center',
        borderRadius: 10
    },
    not_found_text: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default ChangeBaseCampDialogue;
