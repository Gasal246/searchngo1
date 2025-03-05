import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { AntDesign } from '@expo/vector-icons';
import { loadQRModal } from '../../../redux/slices/remoteModalSlice';
import { splitString } from '../../../lib/utils';
import QRCode from 'react-native-qrcode-svg';
import { translations } from '../../../lib/translations';
import TimeCounter from '../utility/TimeCounter';
import { BlurView } from 'expo-blur';
import { guest_uuid } from '../../../lib/constants/guestData';

const ConnectionQR = () => {
    const modalVisible = useSelector((state: RootState) => state.remoteModals.qrModal);
    const userData = useSelector((state: RootState) => state.authentication.user_data);
    const { isGuest } = useSelector((state: RootState) => state.guest);
    const language = useSelector((state: RootState) => state.language.language);
    const { currentMemebership } = useSelector((state: RootState) => state.membership);
    const dispatch = useDispatch();

    return (
        <View>
            <View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                >
                    <BlurView experimentalBlurMethod="dimezisBlurView" intensity={60} tint="dark" style={styles.modalOverlay}>
                        <View style={{ margin: 10, padding: 10}}>
                            <View style={styles.section_header}>
                                <Text style={styles.section_title}>{translations[language].uuid_qr_title}</Text>
                                <TouchableOpacity style={styles.closeButton} onPress={() => dispatch(loadQRModal(false))}>
                                    <AntDesign name="close" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.qrContainer}>
                                <View style={styles.qrCode}>
                                    {userData?.uuid ? (
                                        <QRCode size={200} value={userData.uuid} />
                                    ) : (
                                        isGuest ? (
                                            <QRCode size={200} value={guest_uuid} />
                                        ) : (
                                            <Text>Loading...</Text>
                                        )
                                    )}
                                </View>
                                <View style={styles.uuid_section}>
                                    <Text style={{ ...styles.section_title, fontWeight: '500' }}>UUID</Text>
                                    <Text style={styles.text_uuid}>{splitString((isGuest ? guest_uuid : userData?.uuid), 4)}</Text>
                                    {isGuest && <Text style={{ color: 'gray', fontSize: 12, marginTop: 5 }}>For Kiosks.</Text>}
                                    {isGuest && <Text style={{ color: 'gray', fontSize: 12 }}>Scan The QR or Enter The UUID Manually.</Text>}
                                </View>
                                {currentMemebership?.package_name && <View style={styles.uuid_section}>
                                    <Text style={styles.section_title}>{translations[language].current_membership}</Text>
                                    <Text style={styles.section_description}>{currentMemebership?.package_name}</Text>
                                </View>}
                                {currentMemebership?.package_expiry_date && <View style={styles.uuid_section}>
                                    <Text style={styles.section_title}>{translations[language].membership_expire_on}</Text>
                                    <TimeCounter textStyle={styles.section_description} targetDate={currentMemebership?.package_expiry_date} />
                                </View>}
                            </View>
                        </View>
                    </BlurView>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section_header: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 10,
        overflow: 'hidden',
        position: 'relative'
    },
    section_header_title: {

    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        padding: 10,
        paddingHorizontal: 20,
        position: 'absolute',
        right: 0,
    },
    qrContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 40,
        paddingVertical: 50,
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrCode: {
        alignItems: 'center',
        paddingVertical: 20,
        borderWidth: 2,
        borderColor: 'black',
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 25
    },
    uuid_section: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    section_title: {
        fontSize: 14,
        color: 'gray',
        fontWeight: '400'
    },
    text_uuid: {
        fontSize: 20,
        fontWeight: '600',
        color: '#383838'
    },
    section_description: {
        color: 'gray',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 1
    }
})

export default ConnectionQR;
