import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
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
import { useGetUserMembershipDetails } from '../../../query/membership/queries';
import { fetchUserCurrentMembership } from '../../../redux/slices/membershipDetails';

const FetchEssentials = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const [hasInitialized, setHasInitialized] = useState(false); // Prevent multiple executions
    const { location_info: locationData, ssid: currentSSID } = useSelector((state: RootState) => state.networkData);
    const { mutateAsync: fetchMembershipDetails, isPending: fetchingMembershipDetails } = useGetUserMembershipDetails();
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
        const permission = await requestLocationPermission();
        if (!permission) {
            Alert.alert(
                "Enable Location",
                "Please give access to turn location on to continue using the app.",
                [
                    {
                        text: "Continue",
                        onPress: async () => {
                            await requestLocationPermission();
                        },
                    },
                    {
                        text: "Cancel",
                        onPress: () => {
                            navigation.navigate('Services');
                        },
                    },
                ]
            );
            return false;
        }
        return true;
    }, [navigation]);

    const handleNetworkChange = useCallback(
        async (state: any) => {
            // console.log("Hello Network Change")
            if (!await handleLocationPermission()) return;

            const wifiState: any = await NetInfo.fetch('wifi');
            const ssId = wifiState?.details?.ssid?.toUpperCase();

            if (ssId?.split('_')[0] !== 'SG') {
                throw new Error('network failure', { cause: 'network failure' });
            }

            if (!ssId || ssId === currentSSID) return;

            dispatch(storeSSID(ssId));
            if (ssId.split('_')[0] === 'SG') {
                dispatch(loadLoadingModal(true));
                if (!locationData) {
                    const data = await dispatch(fetchLocationData(ssId));
                    let string = JSON.stringify(data.payload);
                    let obj = JSON.parse(string);
                    locationInformation = obj;
                    // console.log("Location Data: ", locationInformation);
                }
                dispatch(loadConnectionModal(true));
                dispatch(loadLoadingModal(false));
            }
        },
        [currentSSID, dispatch, handleLocationPermission, locationData]
    );

    const handleValidateCampFunction = useCallback(async () => {
        // console.log("Hello Camp Validation")
        if (!locationData && currentSSID?.split('_')[0] === 'SG') {
            dispatch(loadLoadingModal(true));
            await dispatch(fetchLocationData(currentSSID));
            dispatch(loadLoadingModal(false));
        }

        if (!authToken) {
            showErrorToast('Token Missing', "Can't access your auth token.");
            return;
        }

        try {
            dispatch(loadLoadingModal(true));
            // console.log(locationInformation, authToken)
            const response = await validateCamp({
                camp_id: locationInformation?.SG?.location_id,
                client_mac: locationInformation?.SG?.client_mac,
                token: authToken,
            });
            if (!response?.data) throw new Error("[VALIDATE CAMP] Response Data Not Found");
            dispatch(loadUserData(JSON.stringify(response.data.user_data)));
            dispatch(loadToken(response.data.token));
            await dispatch(fetchUserCurrentMembership(response.data.token));
        } catch (error) {
            showErrorToast('Validation Error', 'Failed to validate camp.');
            console.error('Error validating camp:', error);
        } finally {
            dispatch(loadLoadingModal(false));
        }
    }, [authToken, currentSSID, dispatch, locationData, showErrorToast, validateCamp]);

    const initialize = useCallback(async () => {
        if (hasInitialized) return; // Prevent re-initialization
        setHasInitialized(true);

        const unsubscribe = NetInfo.addEventListener(async (state) => {
            await handleNetworkChange(state).then(async () => {
                await handleValidateCampFunction();
            })
            .catch((error: any) => {
                return Toast.show({
                    type: "info",
                    text1: "Network Failure",
                    text2: "connect to camp wifi to get all services"
                })
            });
        });

        return () => {
            unsubscribe();
        };
    }, [handleNetworkChange, hasInitialized]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return null;
};

export default FetchEssentials;
