import React, { useCallback, useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import NetInfo from '@react-native-community/netinfo';
import { fetchLocationData, storeSSID } from '../../../redux/slices/NetworkSlice';
import Toast from 'react-native-toast-message';
import { requestLocationPermission } from '../../../lib/utils';
import { useNavigation } from '@react-navigation/native';
import { loadConnectionModal, loadLoadingModal } from '../../../redux/slices/remoteModalSlice';
import { useValidateCamp } from '../../../query/camp/queries';
import { loadToken, loadUserData } from '../../../redux/slices/appAuthenticationSlice';
import { clearAll, refetchUserMembershipDetails } from '../../../redux/slices/membershipDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FetchEssentials = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const [hasInitialized, setHasInitialized] = useState(false); // Prevent multiple executions
    const { location_info: locationData, ssid: currentSSID } = useSelector((state: RootState) => state.networkData);
    const { token: authToken } = useSelector((state: RootState) => state.authentication);
    const { mutateAsync: validateCamp } = useValidateCamp();
    let locationInformation: any = undefined;

    const showErrorToast = useCallback((title: string, message: string) => {
        Toast.show({
            type: 'error',
            text1: title,
            text2: message,
        });
    }, []);

    const handleLocationPermission = useCallback(async () => {
        if (Platform.OS === 'android') {
            const alreadyGranted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            if (alreadyGranted) {
                return true; // Permission is already granted
            }

            // Request permission if not already granted
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "We need access to your location to fetch Wi-Fi SSID.",
                    buttonNeutral: "Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    }, [navigation]);

    const handleNetworkChange = useCallback(
        async (state: any) => {
            if (!await handleLocationPermission()) return;
            console.log("Executing Network Change...");

            const wifiState: any = await NetInfo.fetch('wifi');
            const ssId = wifiState?.details?.ssid?.toUpperCase();

            if (ssId?.split('_')[0] !== 'SG') {
                locationInformation = null;
                throw new Error('not a SG network!');
            }

            if (!ssId || ssId === currentSSID) return;

            console.log("Storing Current SSID: ", ssId)
            dispatch(storeSSID(ssId));
            if (ssId.split('_')[0] === 'SG') {
                console.log("Fetching Location...");
                dispatch(loadLoadingModal(true));
                if (!locationInformation) {
                    const data = await dispatch(fetchLocationData(ssId));
                    locationInformation = data.payload;
                    console.log("Location Data: ", data.payload);
                } else {
                    console.log("Already Have Location Info: ", locationInformation);
                }
                dispatch(loadConnectionModal(true));
                dispatch(loadLoadingModal(false));
            }
        },
        [currentSSID, dispatch, handleLocationPermission, locationData]
    );

    const handleValidateCampFunction = useCallback(async () => {
        console.log("Handle Validating Camp...");
        if (!locationInformation && currentSSID?.split('_')[0] === 'SG') {
            dispatch(loadLoadingModal(true));
            const data = await dispatch(fetchLocationData(currentSSID));
            locationInformation = data.payload;
            dispatch(loadLoadingModal(false));
        }

        if (!authToken) {
            console.log("NO AUTH TOKEN");
            showErrorToast('Token Missing', "Access Denied!");
            return;
        }

        try {
            dispatch(loadLoadingModal(true));
            if(!locationInformation) return;
            console.log("Validating Camp...")
            const response = await validateCamp({
                camp_id: locationInformation?.SG?.location_id,
                client_mac: locationInformation?.SG?.client_mac,
                token: authToken,
            });
            console.log("Validate camp result", response)
            if (!response?.data) throw new Error("[VALIDATE CAMP] Response Data Not Found");
            dispatch(loadUserData(JSON.stringify(response.data.user_data)));
            await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user_data))
            dispatch(loadToken(response.data.token));
            await dispatch(refetchUserMembershipDetails(response.data.token));
        } catch (error) {
            showErrorToast('Validation Error', 'Failed to validate camp.');
            console.error('Error validating camp:', error);
        } finally {
            dispatch(loadLoadingModal(false));
        }
    }, [authToken, currentSSID, dispatch, locationInformation, showErrorToast, validateCamp]);

    const initialize = useCallback(async () => {
        if (hasInitialized) return; // Prevent re-initialization
        dispatch(clearAll()); // clearing all existing membership details
        setHasInitialized(true);

        const unsubscribe = NetInfo.addEventListener(async (state) => {
            await handleNetworkChange(state).then(async () => {
                await handleValidateCampFunction();
            })
            .catch((error: any) => {
                console.log(error);
                // return Toast.show({
                //     type: "info",
                //     text1: "Network Failure",
                //     text2: "connect to camp wifi to get all services"
                // })
            });
        });

        return () => {
            unsubscribe();
        };
    }, [handleNetworkChange, hasInitialized]);

    useEffect(() => {
        initialize();
    }, [initialize, currentSSID]);

    return null;
};

export default FetchEssentials;
