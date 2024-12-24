import React, { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ConnectionModal from '../../components/shared/Connection/ConnectionModal';
import SideBar from '../../components/shared/SideBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadConnectionModal, loadQRModal } from '../../redux/slices/remoteModalSlice';
import ConnectionQR from '../../components/shared/Connection/ConnectionQR';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchLocationData, storeSSID } from '../../redux/slices/NetworkSlice';
import NetInfo from '@react-native-community/netinfo'
import Toast from 'react-native-toast-message';
import { useValidateCamp } from '../../query/camp/queries';
import { loadToken, loadUserData } from '../../redux/slices/appAuthenticationSlice';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [ssid, setSSID] = useState('');
    const [isModalShown, setIsModalShown] = useState(false); // this state will control the opening of connection modal only once if the ssid is staring with 'SG'
    const { ssid: currentSSID, location_info: locationData } = useSelector(
        (state: RootState) => state.networkData
    );
    const { token: authToken } = useSelector((state: RootState) => state.authentication);
    const { mutateAsync: validateCamp } = useValidateCamp();

    // Common function to Toast Information and Errors
    const showErrorToast = useCallback((title: string, message: string) => {
        Toast.show({
            type: 'error',
            text1: title,
            text2: message,
        });
    }, []);

    // Network listener with proper cleanup
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            NetInfo.fetch('wifi').then((wifiState: any) => {
                const ssId = wifiState?.details?.ssid?.toUpperCase();
                dispatch(storeSSID(ssId));
                if (!ssId) return;

                const ssplits = ssId.split('_');
                if (ssplits[0] !== 'SG') {
                    showErrorToast('Check Network!!', 'Please connect to the correct Wi-Fi.');
                    return;
                }

                if (ssId === currentSSID) return;

                setSSID(ssId);
                if (ssplits[0] === 'SG' && !isModalShown) { // here comparing if the ssid starts with 'SG' and the modal haven't opened already.
                    setIsModalShown(true); // manual state flag keeping inside the rootlayout so to track the modal is already opened or not. 
                    dispatch(loadConnectionModal(true));
                    dispatch(fetchLocationData(ssId));
                }
            });
        });

        return () => {
            unsubscribe();
        };
    }, [currentSSID, dispatch, isModalShown, showErrorToast, ssid]);

    // Validate camp function
    const handleValidateCampFunction = useCallback(async () => {
        if (!locationData || locationData?.outside) return;

        if (!authToken) {
            showErrorToast('Token Missing', "Can't access your auth token.");
            return;
        }

        try {
            const response = await validateCamp({
                camp_id: locationData?.SG?.location_id,
                client_mac: locationData?.SG?.client_mac,
                token: authToken,
            });

            dispatch(loadUserData(JSON.stringify(response?.data?.user_data)));
            dispatch(loadToken(response?.data?.token));
        } catch (error) {
            showErrorToast('Validation Error', 'Failed to validate camp.');
            console.error('Error validating camp:', error);
        }
    }, [authToken, dispatch, locationData, showErrorToast, validateCamp]);

    // Trigger validation when location data changes
    useEffect(() => {
        handleValidateCampFunction();
    }, [handleValidateCampFunction]);

    return (
        <SafeAreaView style={{ backgroundColor: "#222831", width: "100%", height: "100%" }}>
            <ConnectionModal />
            <ConnectionQR />
            <View style={styles.topbar_flex_container}>
                <SideBar />
                <View style={styles.center_logo}>
                    <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 60, height: 70, objectFit: "contain" }} />
                </View>
                {/* <TouchableOpacity onPress={() => navigation.navigate("Profile")}><FontAwesome5 name="user" size={22} color="white" /></TouchableOpacity> */}
                <TouchableOpacity style={styles.qr_trigger} onPress={() => dispatch(loadQRModal(true))}><MaterialCommunityIcons name="qrcode" size={30} color="white" /></TouchableOpacity>
            </View>
            {children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    qr_trigger: {
        padding: 10
    },
    center_logo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        alignItems: "center"
    },
    topbar_flex_container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
})

export default RootLayout