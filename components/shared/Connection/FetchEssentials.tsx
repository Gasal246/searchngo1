import React, { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import NetInfo from '@react-native-community/netinfo';
import { fetchLocationData, storeSSID } from '../../../redux/slices/NetworkSlice';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { loadLoadingModal } from '../../../redux/slices/remoteModalSlice';
import { loadToken, loadUserData } from '../../../redux/slices/appAuthenticationSlice';
import { clearAll, refetchUserMembershipDetails } from '../../../redux/slices/membershipDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateCampApiFunction } from '../../../query/camp/functions';
import { saveLog } from '../../../lib/utils';
import { storeLog } from '../../../redux/slices/logSlice';
import { fetchLocation } from '../../../query/networkqueries/functions';

const FetchEssentials = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const [hasInitialized, setHasInitialized] = useState(false);
    const { token: authToken } = useSelector((state: RootState) => state.authentication);

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

            if (alreadyGranted) return true;

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
        } else if (Platform.OS == 'ios') {
            // todo: ask ios permission..
        }
        return true;
    }, [navigation]);

    const handleFetchLocationInformation = async (ssid: string) => {
        console.log("Fetching location info...");
        dispatch(loadLoadingModal(true));
        try {
            const res: any = await fetchLocation(ssid);
            dispatch(storeSSID(ssid)); // Update Redux with the new SSID
            dispatch(fetchLocationData(res)); // Assume this action stores location data
            console.log(res)
            dispatch(storeLog({ key: 'fetched_location_information_state', value: res }));
            return res;
        } catch (error) {
            console.log(error);
            dispatch(storeLog({ key: 'location_fetch_error', value: error }));
            throw error;
        } finally {
            dispatch(loadLoadingModal(false));
        }
    };

    const handleNetworkChange = async () => {
        if (!await handleLocationPermission()) return;
        console.log("Executing Network Change...");
        dispatch(storeLog({ key: 'executing_network_change', value: true }));

        const wifiState: any = await NetInfo.fetch('wifi');
        const ssId = wifiState?.details?.ssid?.toUpperCase();

        await AsyncStorage.setItem("store_ssid", ssId);
        dispatch(storeLog({ key: 'stored_ssid', value: ssId }));

        try {
            const locationInfo = await handleFetchLocationInformation(ssId);
            if (!locationInfo) {
                showErrorToast('Error', 'Failed to fetch location information');
                return;
            }

            if (ssId?.split('_')[0] !== 'SG') {
                dispatch(storeLog({ key: 'invalid_ssid', value: 'Not an SG network' }));
                return;
            }

            await handleValidateCampFunction(ssId, locationInfo);
        } catch (error) {
            console.error('Network change error:', error);
        }
    };

    const handleValidateCampFunction = async (ssid: string, locationInfo: any) => {
        if (!authToken) {
            console.log("NO AUTH TOKEN");
            dispatch(storeLog({ key: 'missing_auth_token', value: 'Token not found' }));
            showErrorToast('Token Missing', "Access Denied!");
            return;
        }

        console.log("Validating Camp...");
        dispatch(storeLog({ key: 'validating_camp', value: true }));
        dispatch(loadLoadingModal(true));

        try {
            console.log(`location_id: ${locationInfo?.SG?.location_id}\nclient_mac${locationInfo?.SG?.client_mac}`)
            const response = await validateCampApiFunction(
                locationInfo?.SG?.location_id,
                locationInfo?.SG?.client_mac,
                authToken
            );

            if (!response?.data) {
                console.log(response?.message)
                await saveLog("camp_validation_error", "Response data not found");
                throw new Error("Validation failed: No data received");
            }

            dispatch(storeLog({ key: 'camp_validation_response', value: response }));
            dispatch(loadUserData(JSON.stringify(response.data.user_data)));
            await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user_data));
            dispatch(loadToken(response.data.token));
            await dispatch(refetchUserMembershipDetails(response.data.token));
        } catch (error) {
            showErrorToast('Validation Error', 'Failed to validate camp.');
            console.error('Camp validation error:', error);
        } finally {
            dispatch(loadLoadingModal(false));
        }
    };

    const initialize = useCallback(async () => {
        if (hasInitialized) return;
        dispatch(clearAll());
        setHasInitialized(true);

        const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

        return () => {
            unsubscribe();
        };
    }, [handleNetworkChange, hasInitialized]);

    useEffect(() => {
        initialize();
    }, []);

    return null;
};

export default FetchEssentials;