import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { translations } from '../../lib/translations';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

const PhoneInput = ({ setErrorState, setPhoneNumber, setCountryCode }: { setErrorState: React.Dispatch<React.SetStateAction<boolean>>, setPhoneNumber: React.Dispatch<React.SetStateAction<string>>, setCountryCode: React.Dispatch<React.SetStateAction<string>> }) => {
    const phoneInputRef = useRef<TextInput>(null);
    const [country, setCountry] = useState<string>('971');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [formattedPhone, setFormattedPhone] = useState<string>('');
    const language = useSelector((state: any) => state.language.language);

    useEffect(() => { setCountryCode('971')}, []); // For Development Purpose adding 971 as the only country code available.

    const handleOnFocusPhoneNumber = () => {
        if (!country) {
            Toast.show({
                type: "error",
                text1: `${translations[language].mobile_v_country_code}`,
                text2: `${translations[language].mobile_v_phone_c_code_err}`
            })
            setError(`${translations[language].mobile_v_phone_c_code_err}`);
        } else {
            setError('');
        }
    };

    const handleInputPhone = (text: string) => {
        try {
            const cleanedText = text.replace(/^0+/, '');
            if(cleanedText.length >= 10){
                Keyboard.dismiss()
            }
            setPhone(text);
            let formatted = country + cleanedText;
            setFormattedPhone(formatted);
            setPhoneNumber(cleanedText);
        } catch (err) {
            Toast.show({
                type: "error",
                text1: `${translations[language].mobile_v_placeholder_phone}`,
                text2: `${translations[language].mobile_v_phone_error2}`
            })
            setError(`${translations[language].mobile_v_phone_error2}`);
        }
    };

    return (
        <View aria-disabled>
            <View style={styles.container}>
                <View style={styles.countryCodeContainer}>
                    <Text style={styles.plus}>+</Text>
                    <TextInput
                        placeholder='971'
                        style={styles.textStyle}
                        value={country} // For development pupose now it is setuped to 971 initially.
                        maxLength={4}
                        keyboardType="phone-pad"
                        returnKeyType="next"
                        textContentType='telephoneNumber'
                    />
                </View>
                <View style={styles.phoneNumberContainer}>
                    <TextInput
                        ref={phoneInputRef}
                        style={styles.textStyle}
                        placeholder={`${translations[language].mobile_v_placeholder_phone}`}
                        onFocus={handleOnFocusPhoneNumber}
                        value={phone}
                        onChangeText={handleInputPhone}
                        keyboardType="phone-pad"
                        textContentType='telephoneNumber'
                    />
                </View>
            </View>
            {/* {formattedPhone && <Text style={styles.formattedText}>{formattedPhone}</Text>} */}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    countryCodeContainer: {
        padding: 10,
        borderRadius: 15,
        backgroundColor: "white",
        textAlign: "center",
        width: "28%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    phoneNumberContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
        textAlign: "center",
        width: "70%",
        display: "flex",
    },
    textStyle: {
        fontWeight: "500",
        fontSize: 16,
        color: "#424242",
        fontFamily: "Roboto-Medium"
    },
    formattedText: {
        fontWeight: "500",
        fontSize: 18,
        color: "#424242",
        paddingVertical: 5
    },
    errorText: {
        color: "#F35248",
        fontWeight: "500",
        paddingHorizontal: 5
    },
    plus: {
        color: 'black',
        fontWeight: "500",
        fontSize: 14
    }
});

export default PhoneInput;
