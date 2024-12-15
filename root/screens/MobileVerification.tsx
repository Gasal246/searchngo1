import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GradientButtonOne from '../../components/shared/GradientButtonOne';
import PhoneInput from '../../components/shared/PhoneInput';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../lib/translations';
import Toast from 'react-native-toast-message';
import { useSendMobileOtp } from '../../query/verification/query';
import { countryCallingCodes, getPhoneNumberLength } from '../../lib/constants/phone_values';
import { getIpAddress, setIpAddress } from '../../lib/constants/appConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setVerificationState } from '../../redux/slices/verificationSlice';

const MobileVerification = () => {
    const [via, setVia] = useState<'phone' | 'email'>('phone');
    const navigation = useNavigation<NavigationProp>();
    const [error, setError] = useState(false);
    const [countryCode, setCountryCode] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const language = useSelector((state: any) => state.language.language);
    const { mutateAsync: sendOtp, isPending: sendingOtp } = useSendMobileOtp();
    const [mac_id, setMacid] = useState('');
    
    const dispatch = useDispatch();

    useEffect(() => {
        const ip = getIpAddress();
        setMacid(ip);
    }, [])

    const handleSelectMethod = async (method: 'phone' | 'email') => {
        setVia(method);
        setValue('')
    }

    const handleEmailInput = (text: string) => {
        setValue(text)
    }

    const handleSendOtp = async () => {
        if (via === 'phone') {
            const formData = {
                mobile: parseInt(value),
                device_mac_id: mac_id,
                country_code: parseInt(countryCode)
            }
            const country = countryCallingCodes.find((c: any) => c.dial_code === countryCode);
            const phLength = getPhoneNumberLength(country?.code);
            if (value.length !== phLength) {
                return Toast.show({
                    type: 'error',
                    text1: `${translations[language].mobile_v_phone_title}`,
                    text2: `${translations[language].mobile_v_length_error}`
                })
            }
            const res = await sendOtp(formData);
            if(res.error){
                return Toast.show({
                    type: "error",
                    text1: "Error Sending Otp"
                })
            }
            console.log(res.message);
            AsyncStorage.setItem('user_data', JSON.stringify(res.data.user_data));
            Toast.show({
                type: 'success',
                text1: `${translations[language].mobile_v_otp_send}`,
                text2: `${translations[language].mobile_v_check_message}`
            })
            dispatch(setVerificationState({
                country_code: parseInt(countryCode),
                mobile: parseInt(value),
                device_mac_id: mac_id,
                camp_id: null
            }))
            navigation.navigate('OtpPage');
        } else if (via === 'email') {
            const formData = {
                email: value,
                device_mac_id: mac_id,
                country_code: parseInt(countryCode)
            }
            // COMPLETE EMAIL AUTHETICATION ALSO..
        }
    }

    return (
        <View>
            <View style={styles.center_logo}>
                <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 130, height: 100, objectFit: "contain" }} />
            </View>
            <View style={styles.boxedContainer}>
                <Text style={styles.title}>{via == 'phone' ? translations[language].mobile_v_phone_title : translations[language].mobile_v_email_title}</Text>
                <Text style={styles.description}>{via == 'phone' ? translations[language].mobile_v_desc : translations[language].mobile_v_desc_email}</Text>
                <View style={styles.gridView}>
                    <TouchableOpacity style={styles.selectView} onPress={() => handleSelectMethod('phone')}>
                        <FontAwesome name='check-circle' color={via === 'phone' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={styles.selectText}>{translations[language].mobile_v_phone}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.selectView} onPress={() => handleSelectMethod('email')}>
                        <FontAwesome name='check-circle' color={via === 'email' ? '#8CC82F' : 'gray'} size={25} />
                        <Text style={styles.selectText}>{translations[language].mobile_v_email}</Text>
                    </TouchableOpacity> */}
                </View>
                {via == 'phone' ? <View style={{ marginTop: 10 }}>
                    <PhoneInput setErrorState={setError} setCountryCode={setCountryCode} setPhoneNumber={setValue} />
                </View> :
                    <View style={{ marginTop: 10 }}>
                        <TextInput placeholder={`${translations[language].mobile_v_placeholder_email}`} value={value} onChangeText={handleEmailInput} textContentType='emailAddress' style={styles.emailInput} />
                    </View>
                }
                <GradientButtonOne disabled={sendingOtp} colors={["#4EFBE6", "#5AE7A6"]} style={{ marginTop: 20, borderRadius: 10 }} onPress={handleSendOtp}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.textSubmit}>{translations[language].mobile_v_submit} </Text>
                        <FontAwesome name="arrow-right" size={20} color="white" />
                    </View>
                </GradientButtonOne>
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
    boxedContainer: {
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingVertical: 30,
        marginHorizontal: 20,
        marginTop: 40
    },
    title: {
        color: "white",
        fontWeight: "600",
        fontSize: 25,
        fontFamily: "Roboto-Regular"
    },
    description: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
        fontFamily: "Roboto-Regular"
    },
    gridView: {
        display: "flex",
        flexWrap: 'wrap',
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        justifyContent: "center"
    },
    selectView: {
        backgroundColor: "white",
        borderRadius: 14,
        width: "100%", // width: "48%",
        padding: 15,
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    selectText: {
        fontSize: 18,
        fontWeight: "600"
    },
    textSubmit: {
        color: "white",
        fontWeight: "800",
        fontSize: 20,
    },
    emailInput: {
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 10,
        fontWeight: "500"
    }
})

export default MobileVerification;
