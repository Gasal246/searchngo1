import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RootLayout from "../../layouts/RootLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { LinearGradient } from "expo-linear-gradient";
import PhoneInput from "../../../components/shared/PhoneInput";
import { OTPInput } from "../../../components/shared/OtpInput";
import { sendMobileChangeOTP } from "../../../query/userqueries/functions";
import { formatDateString } from "../../../lib/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { guest_country_code, guest_phone } from "../../../lib/constants/guestData";

const ChangeMobileNumber = () => {
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorState, setErrorState] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const [isOtpSend, setIsOtpSend] = useState(false);
  const [codes, setCodes] = useState<string[] | undefined>(Array(5).fill(""));
  const [errorMessages, setErrorMessages] = useState<string[] | undefined>(
    Array(5).fill("")
  );

  const { user_data: userData, token: authToken } = useSelector(
    (state: RootState) => state.authentication
  );
  const { isGuest } = useSelector((state: RootState) => state.guest);
  const dispatch = useDispatch<AppDispatch>();

  const refs: RefObject<TextInput>[] = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

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

  const handleSendOTP = async () => {
    if(!phoneNumber) return;
    if (`${userData?.country_code}` + `${userData?.phone}` == `${countryCode}` + `${phoneNumber}` ) {
      Alert.alert( "Same Number", "Ohh! You have already this mobile number! 😃" );
      return;
    }
    if (!authToken) {
      Alert.alert("Malpractice", "You need to login first.");
      return;
    }
    const nextMobChange = await AsyncStorage.getItem('next_mobile_number_change_on');
    
    if(nextMobChange && new Date(formatDateString(nextMobChange)) > new Date()){
      Alert.alert("Wait for Next Change", "Your next change is on " + formatDateString(nextMobChange))
      return;
    }

    Alert.alert(
      "Mobile Number Changing",
      "Are you sure wan't to change your mobile number? You could only change mobile number once in every 30 days.",
      [
        {
          text: "Send-OTP",
          onPress: async () => {
            if(isGuest) return;
            setIsLoading(true);
            try {
              const formData = {
                mobile: parseInt(phoneNumber),
                country_code: parseInt(countryCode),
              };
              const response = await sendMobileChangeOTP(formData, authToken);
              if (response.status == 200) {
                await AsyncStorage.setItem('next_mobile_number_change_on', new Date(response?.data?.userData?.next_mobile_change_at).toString());
                Alert.alert("OTP Send!", response.message);
                setIsOtpSend(true);
              }
              if (response?.status == 302) {
                await AsyncStorage.setItem('next_mobile_number_change_on', new Date(response?.data?.userData?.next_mobile_change_at).toString());
                Alert.alert("Recently Changed", `You have changed your number recently. Please wait for next change. @${formatDateString(response?.data?.userData?.next_mobile_change_at)}`);
              }
              if (response.error) {
                Alert.alert("Error", response.message);
              }
              return;
            } catch (error: any) {
              console.log(error);
              Alert.alert("Error", error.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
        {
          text: "Discard",
          style: "cancel",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <RootLayout>
      <View style={styles.page_wrapper}>
        <Text style={styles.page_title}>Change Your Mobile Number</Text>
        <View style={styles.package_wrapper}>
          <View style={styles.package_view}>
            <LinearGradient
              colors={["#00c8a4", "#006e7d"]}
              style={styles.package_header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.package_plan_name}>Current Phone Number</Text>
            </LinearGradient>
            <View style={styles.package_detail_wrapper}>
              <Text style={styles.current_mobile_number}>
                +{isGuest ? guest_country_code : userData?.country_code} {isGuest ? guest_phone : userData?.phone}
              </Text>
            </View>
          </View>
          <View style={styles.purchase_btn_wrapper}>
            <TouchableOpacity
              onPress={() => {
                if(isGuest) {
                  Alert.alert("Sorry!", "You can't change guest mobile number.", [{ text: "OK", onPress: () => { setIsChange(false) } }]);
                }
                setIsChange(!isChange);
              }}
              style={[
                styles.purchase_btn,
                { backgroundColor: isChange ? "#005F78" : "#00c8a4" },
              ]}
              disabled={isLoading || isOtpSend}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                {isChange
                  ? isOtpSend
                    ? "OTP Sended!"
                    : "Don't Change"
                  : "Change"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isChange && (
          <View
            style={{
              width: "100%",
              paddingHorizontal: 10,
              backgroundColor: "#005F78",
              paddingVertical: 20,
              borderRadius: 10,
            }}
          >
            <Text style={styles.page_title}>
              {isOtpSend
                ? `Enter OTP Send To +${971} ${phoneNumber}`
                : "Enter New Mobile Number"}
            </Text>
            {!isOtpSend ? (
              <View>
                <PhoneInput
                  setErrorState={setErrorState}
                  setPhoneNumber={setPhoneNumber}
                  setCountryCode={setCountryCode}
                  placeholder_text="new mobile number"
                />
                <TouchableOpacity
                  onPress={handleSendOTP}
                  style={{
                    backgroundColor: "#00c8a4",
                    width: "100%",
                    borderRadius: 10,
                    padding: 10,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Send OTP
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ width: 300 }}>
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
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#00c8a4",
                    width: "100%",
                    borderRadius: 10,
                    padding: 10,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Confirm OTP
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </RootLayout>
  );
};

const styles = StyleSheet.create({
  page_wrapper: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  page_title: {
    color: "black",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 13,
    fontWeight: "bold",
    backgroundColor: "white",
    textAlign: "center",
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  package_wrapper: {
    position: "relative",
    marginBottom: 30,
    width: "100%",
  },
  package_view: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    paddingBottom: 35,
  },
  package_header: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
    marginBottom: 15,
  },
  package_plan_name: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  package_detail_wrapper: { paddingHorizontal: 25 },
  purchase_btn_wrapper: {
    position: "absolute",
    bottom: -18,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  purchase_btn: {
    width: "85%",
    borderRadius: 15,
    shadowColor: "black",
    shadowRadius: 10,
    elevation: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  current_mobile_number: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChangeMobileNumber;
