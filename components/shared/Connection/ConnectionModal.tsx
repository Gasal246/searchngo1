import React, { useCallback, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../../redux/store';
import { translations } from '../../../lib/translations';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, PermissionsAndroid, Alert, } from 'react-native';
import GradientButtonOne from '../GradientButtonOne';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { loadConnectionModal } from '../../../redux/slices/remoteModalSlice';

const ConnectionModal = () => {
    const modalVisible = useSelector((state: RootState) => state.remoteModals.connectionModal);
    const language = useSelector((state: RootState) => state.language.language);
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();

    const closeModal = () => dispatch(loadConnectionModal(false));
    const currentSSID = useSelector((state: RootState) => state.networkData.ssid);
    const { token: authToken, user_data: userData } = useSelector((state: RootState) => state.authentication);

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.close_button} onPress={closeModal}>
                            <Entypo name="cross" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.connectivity_view}>
                                    <Text style={styles.connectivity_text}>{translations[language].home_connectivity}</Text>
                                    <Text style={styles.connectivity_desc}>{translations[language].home_conn_desc}</Text>
                                    <View style={styles.container}>
                                        <Text style={{ color: 'grey', marginTop: 10}}>SSID: {currentSSID}</Text>
                                    </View>
                                    <View style={styles.location_view}>
                                        <Text style={styles.location_title}>{translations[language].home_site_title}</Text>
                                        <Text style={styles.location_desc}>{userData?.location_camp?.location_camp_name || 'Out of service area'}</Text>
                                    </View>

                                    <View style={styles.flex_container}>
                                        <GradientButtonOne
                                            colors={["#8D9092", "#626365"]}
                                            style={{ borderRadius: 10, width: "28%", marginBottom: 10 }}
                                            onPress={() => navigation.navigate("Services")}
                                        >
                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <Text style={styles.textSubmit}>{translations[language].home_skip}</Text>
                                                <FontAwesome name="arrow-right" size={20} color="white" />
                                            </View>
                                        </GradientButtonOne>
                                        <GradientButtonOne
                                            colors={["#4EFBE6", "#5AE7A6"]}
                                            style={{ borderRadius: 10, width: "69%", marginBottom: 10 }}
                                            onPress={() => navigation.navigate("Services")}
                                        >
                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <Text style={styles.textSubmit}>{translations[language].home_submit}</Text>
                                                <FontAwesome name="arrow-right" size={20} color="white" />
                                            </View>
                                        </GradientButtonOne>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default ConnectionModal;

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
});

