import React from 'react'
import { Image, Modal, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { loadLoadingModal } from '../../redux/slices/remoteModalSlice';

const LoaderSpin = () => {
    const modalVisible = useSelector((state: RootState) => state.remoteModals.loadingModal);
    const dispatch = useDispatch();

    const closeModal = () => dispatch(loadLoadingModal(false));

  return (
    <View style={styles.container}>
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.modalOverlay}>
                <Image source={require('../../assets/images/gif/loading.gif')} style={styles.loaderImage} />
            </View>
        </Modal>
    </View>
  )
}

export default LoaderSpin

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15
    },
    loaderImage: {
        width: 80,
        height: 'auto',
        aspectRatio: 1/1
    }
})