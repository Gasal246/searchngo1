import React, { useCallback, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../../redux/store';
import { translations } from '../../../lib/translations';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, PermissionsAndroid, Alert, } from 'react-native';
import GradientButtonOne from '../GradientButtonOne';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { loadConnectionModal, loadLoadingModal } from '../../../redux/slices/remoteModalSlice';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import { convertIsoToUnixMinutes } from '../../../lib/utils';
import { fetchCampDetailsByCampId } from '../../../redux/slices/campSlice';
import { connectInternetFunction } from '../../../query/networkqueries/functions';
import { fetchLocationData, loadLoginConnectData, storeSSID } from '../../../redux/slices/NetworkSlice';

const ConnectionModal = () => {
    const modalVisible = useSelector((state: RootState) => state.remoteModals.connectionModal);
    const language = useSelector((state: RootState) => state.language.language);
    const dispatch = useDispatch<AppDispatch>();

    const closeModal = () => dispatch(loadConnectionModal(false));
    const { ssid: currentSSID } = useSelector((state: RootState) => state.networkData);
    const { user_data: userData, token: authToken } = useSelector((state: RootState) => state.authentication);
    const { location_info: locationData, loginConnectData: connectionData } = useSelector((state: RootState) => state.networkData);
    const { currentMemebership } = useSelector((state: RootState) => state.membership);

    // useEffect(() => {
    //     console.log(locationData)
    // }, [locationData]);

    const handleConnectInternet = async () => {
        dispatch(loadLoadingModal(true));
        if (!currentSSID) {
            const wifiState: any = await NetInfo.fetch('wifi');
            const ssId = wifiState?.details?.ssid?.toUpperCase();
            dispatch(storeSSID(ssId));
        }
        if (currentSSID?.split('_')[0] != 'SG') {
            return Toast.show({
                type: "error",
                text1: "Connect to Camp WIFI",
                text2: "connect camp wifi to continue this action.",
            })
        }
        if (!currentMemebership) {
            return Toast.show({
                type: 'error',
                text1: 'No Active Membership Found',
                text2: "please check your membership history."
            })
        }
        try {
            const activePackageData = currentMemebership[0];
            const campidFetch = await dispatch(fetchCampDetailsByCampId({ campId: userData?.location_camp?.location_camp_id, token: authToken! }))
            const camp_details = campidFetch.payload;
            const expiryMinutes: any = convertIsoToUnixMinutes(activePackageData?.package_expiry_date);
            console.log('CRMB', activePackageData);
            console.log('Package Expiry Date Unix', expiryMinutes);
            const descriptionData = `${activePackageData?.user?.phone} - ${activePackageData?.user?.name} - ${activePackageData?.user?.uuid}`;

            const data = new FormData();
            console.log("Active Package Data: ", activePackageData);
            const accessCodeData = (activePackageData?.user?.uuid ?? '') + (activePackageData?.package_code ?? '') + (activePackageData?.camp_id ?? '');
            // console.log("ACCESS CODE DATA: ", accessCodeData);
            data.append('Access_Code', accessCodeData);
            data.append('Package', activePackageData?.package_name);
            data.append('Expiry', expiryMinutes);
            data.append('Validity', activePackageData?.duration);
            data.append('Creator', activePackageData?.created_by_type);
            data.append('Billing_ID', activePackageData?.order_from_camp_detail?.id);
            data.append('upload_bandwidth', activePackageData?.download_bandwidth);
            data.append('download_bandwidth', activePackageData?.download_bandwidth);
            data.append('bandwidth_unit', 'mbps');
            data.append('description', descriptionData);
            data.append('user_admin', userData?.base_camp_client_id);
            data.append('user_site', userData?.base_camp_id);
            data.append('user_ip', locationData?.SG?.client_ip);
            data.append('Auth_Code', camp_details?.router_secret);

            const response = await connectInternetFunction(data, authToken!);
            console.log("Connection Res: ", response);
            if (response.SG || response?.SG?.Success === 1) {
                dispatch(loadLoginConnectData(response?.SG));
                closeModal();
                const l_data = await dispatch(fetchLocationData(currentSSID));
                return Toast.show({
                    type: "success",
                    text1: "Connected",
                    text2: "You have connected to internet."
                })
            } else {
                dispatch(loadLoginConnectData(null))
            }
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(loadLoadingModal(false));
        }
    }

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
                                    {/* <View style={styles.container}>
                                        <Text style={{ color: 'grey', marginTop: 10}}>SSID: {currentSSID}</Text>
                                    </View> */}
                                    <View style={styles.location_view}>
                                        <Text style={styles.location_title}>{translations[language].home_site_title}</Text>
                                        <Text style={styles.location_desc}>{userData?.location_camp?.location_camp_name || 'Out of service area'}</Text>
                                    </View>

                                    {currentMemebership && locationData?.SG?.InternetAccess == 'no' && locationData?.SG?.LoggedIn == 'no' ?
                                        <View style={styles.flex_container}>
                                            <GradientButtonOne
                                                colors={["#8D9092", "#626365"]}
                                                style={{ borderRadius: 10, width: "28%", marginBottom: 10 }}
                                                onPress={closeModal}
                                            >
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={styles.textSubmit}>{translations[language].home_skip}</Text>
                                                    <FontAwesome name="arrow-right" size={20} color="white" />
                                                </View>
                                            </GradientButtonOne>
                                            <GradientButtonOne
                                                colors={["#4EFBE6", "#5AE7A6"]}
                                                style={{ borderRadius: 10, width: "69%", marginBottom: 10 }}
                                                onPress={handleConnectInternet}
                                            >
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={styles.textSubmit}>{translations[language].home_submit}</Text>
                                                    <FontAwesome name="arrow-right" size={20} color="white" />
                                                </View>
                                            </GradientButtonOne>
                                        </View>
                                        :
                                        <TouchableOpacity style={styles.not_found_view} onPress={closeModal}>
                                            <Text style={styles.not_found_text}>{(!currentMemebership || locationData?.outside) ? "Close" : "Already Connected"}</Text>
                                        </TouchableOpacity>
                                    }
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
});

