import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
    Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { translations } from "../../lib/translations";
import RootLayout from "../layouts/RootLayout";
import { RootState } from "../../redux/store";
import { splitString } from "../../lib/utils";
import { profilePrefix } from "../../lib/constants/constatntUrls";
import { Image } from "expo-image";
import { loadQRModal } from "../../redux/slices/remoteModalSlice";
import { loadLogoutApp } from "../../redux/slices/appAuthenticationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { guest_country_code, guest_email, guest_name, guest_phone, guest_uuid } from "../../lib/constants/guestData";

const ProfileScreen = () => {
  const { user_data: userData } = useSelector(
    (state: RootState) => state.authentication
  );
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { isGuest } = useSelector((state: RootState) => state.guest);

  const handleOnClickUUID = () => {
    dispatch(loadQRModal(true));
  };

  const logoutFunction = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure to sign out of application",
      [
        {
          text: "Yes",
          onPress: async () => {
            dispatch(loadLogoutApp());
            await AsyncStorage.clear();
            navigation.navigate("Language");
          },
        },
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            Toast.show({
              type: "success",
              text1: "cancelled signout attempt!",
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <RootLayout>
      <View style={styles.page_view}>
        <View style={styles.container}>
          {/* Profile Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={ isGuest ? require("../../assets/images/png/guest_avatar.png") : { uri: profilePrefix(userData?.id) }}
              style={styles.logo}
            />
          </View>

          {/* Profile Info */}
          <Text style={styles.name}>{(isGuest ? guest_name : userData?.name)}</Text>

          <View style={styles.infoContainer}>
            <TouchableOpacity
              style={styles.infoItem}
              onPress={handleOnClickUUID}
            >
              <Text style={styles.infoLabel}>UUID:</Text>
              <Text style={styles.infoValue}>
                {splitString((isGuest ? guest_uuid : userData?.uuid), 4)}
              </Text>
            </TouchableOpacity>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>
                +{isGuest ? guest_country_code : userData?.country_code} {isGuest ? guest_phone : userData?.phone}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{isGuest ? guest_email : userData?.email}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.container, { marginTop: 10 }]}>
            <Text style={styles.reminder}>please remember you could only use one device at a time and if you want to signin to another device please signout of this one first.</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#FF0000" }]} onPress={logoutFunction}>
            <Text style={styles.buttonText}>SignOut</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RootLayout>
  );
};

const styles = StyleSheet.create({
  page_view: {
    paddingHorizontal: 10,
    paddingTop: 100,
    flex: 1,
  },
  container: {
    backgroundColor: "#2E3A3F",
    borderRadius: 10,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
    borderColor: "white",
    borderWidth: 2,
  },
  logoContainer: {
    position: "absolute",
    top: -70,
    backgroundColor: "transparent",
  },
  name: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginTop: 55,
  },
  logo: {
    width: 150,
    height: 150,
    aspectRatio: 1 / 1,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
  },
  infoContainer: {
    marginTop: 10,
    width: "100%",
  },
  infoItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  infoLabel: {
    color: "white",
    fontSize: 16,
  },
  infoValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#005F78",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  reminder: {
    color: "gray",
    textAlign: 'center',
    marginBottom: 20
  }
});

export default ProfileScreen;
