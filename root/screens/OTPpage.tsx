import React, { RefObject, useRef, useState } from 'react';
import { Image, Keyboard, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { OTPInput } from '../../components/shared/OtpInput';
import GradientButtonOne from '../../components/shared/GradientButtonOne';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { translations } from '../../lib/translations';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useVerifyOtp } from '../../query/verification/query';
import { RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAuthentication, loadToken, loadUserData } from '../../redux/slices/appAuthenticationSlice';
import { loadLoadingModal } from '../../redux/slices/remoteModalSlice';
import * as Notifications from 'expo-notifications';
import { useUpdateExpoPushToken } from '../../query/userqueries/queries';

const OTPpage = () => {
    const navigation = useNavigation<NavigationProp>();
    const [codes, setCodes] = useState<string[] | undefined>(Array(5).fill(""));
    const language = useSelector((state: any) => state.language.language);
    const { mutateAsync: verifyOtp, isPending: pendingVerification } = useVerifyOtp();
    const mobile = useSelector((state: RootState) => state.verification.mobile);
    const device_mac_id = useSelector((state: RootState) => state.verification.device_mac_id);
    const country_code = useSelector((state: RootState) => state.verification.country_code);
    const dispatch = useDispatch();
    const { mutateAsync: updateExpoPushTokenInUserData } = useUpdateExpoPushToken()

    const refs: RefObject<TextInput>[] = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const [errorMessages, setErrorMessages] = useState<string[]>();

    const onChangeCode = (text: string, index: number) => {
        if (text.length >= codes!.length) {
            Keyboard.dismiss();
            return;
        }

        if (text.length > 1) {
            setErrorMessages(undefined);
            const newCodes = text.split("").slice(0, codes!.length);
            setCodes(newCodes);

            // Only focus on the next input if it's not the last one
            if (index + 1 < refs.length) {
                refs[index + 1]?.current?.focus();
            }
            return;
        }

        setErrorMessages(undefined);
        const newCodes = [...codes!];
        newCodes[index] = text;
        setCodes(newCodes);

        // Focus on the next input if it's not the last one
        if (text !== "" && index + 1 < refs.length) {
            refs[index + 1]?.current?.focus();
        }
    };
    const registerForPushNotifications = async () => {
        const user_data = await AsyncStorage.getItem('user_data');
        if (!user_data) return;
        const expo_push_token = await AsyncStorage.getItem('expo-push-token');
        if (expo_push_token) return;
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                });
            }
            // Request notification permissions and get the token
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Notification permissions not granted!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            await AsyncStorage.setItem('expo-push-token', token);
            const userToken = await AsyncStorage.getItem('user_token');
            await updateExpoPushTokenInUserData({
                formData: {
                    expo_push_token: token
                }, token: userToken ? userToken : ''
            });
            return;
        } catch (error) {
            console.log(error)
        }
    };

    async function verifyPhoneNumberAndProgress() {
        dispatch(loadLoadingModal(true))
        const fullCode = codes!.join("");
        const formData = {
            otp: parseInt(fullCode),
            country_code: country_code!,
            mobile: mobile!,
            device_mac_id: device_mac_id!,
        }
        try {
            const res = await verifyOtp(formData);
            console.log(res);
            if (res?.status === 201) {
                await AsyncStorage.setItem('verification', JSON.stringify({ auth: true }))
                dispatch(loadAuthentication(true));
                dispatch(loadUserData(JSON.stringify(res?.data?.user_data)));
                await AsyncStorage.setItem('user_data', JSON.stringify(res?.data?.user_data));
                dispatch(loadToken(res?.data?.token));
                await AsyncStorage.setItem('user_token', res.data?.token);
                dispatch(loadLoadingModal(false))
                Toast.show({
                    type: "success",
                    text1: 'User Verified',
                    text2: "OTP Verification Successfull"
                })
                await registerForPushNotifications();
                return navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'UpdateProfile' }],
                    })
                );
            } else {
                dispatch(loadLoadingModal(false))
                return Toast.show({
                    type: "error",
                    text1: 'OTP Verification Failed',
                    text2: res?.message || 'Please Enter Valid Digits'
                })
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: 'OTP Verification Failed',
                text2: 'Please Enter Valid Digits'
            })
        }
    }

    return (
        <View>
            <View style={styles.center_logo}>
                <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 130, height: 100, objectFit: "contain" }} />
            </View>
            <View style={styles.container}>
                <View style={styles.otp_container}>
                    <Text style={styles.otp_title}>{translations[language].otp_title}</Text>
                    <Text style={styles.otp_description}>{translations[language].otp_desc}</Text>
                    <OTPInput
                        codes={codes!}
                        errorMessages={errorMessages}
                        onChangeCode={onChangeCode}
                        refs={refs}
                        config={{
                            borderColor: "white",
                            focusColor: "#5AE7A6",
                            backgroundColor: "white",
                        }}
                    />
                    <GradientButtonOne colors={["#4EFBE6", "#5AE7A6"]} style={{ marginTop: 20, borderRadius: 10 }} onPress={verifyPhoneNumberAndProgress}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.textSubmit}>{pendingVerification ? 'Verification..' : translations[language].verify_otp} </Text>
                            <FontAwesome name="arrow-right" size={20} color="white" />
                        </View>
                    </GradientButtonOne>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center_logo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 60,
        alignItems: "center"
    },
    container: {
        width: "100%",
        height: "75%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 20
    },
    otp_container: {
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 23,
        padding: 20,
        width: "100%"
    },
    otp_title: {
        color: "white",
        fontSize: 26,
        fontWeight: "600"
    },
    otp_description: {
        color: "white",
        fontSize: 14,
        marginBottom: 20
    },
    textSubmit: {
        color: "white",
        fontWeight: "800",
        fontSize: 20,
    }
})

export default OTPpage;
