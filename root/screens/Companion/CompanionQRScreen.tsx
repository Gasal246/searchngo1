import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Platform, Button, TouchableOpacity, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const CompanionQRScreen = () => {
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState<any>(null);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const prepareQRData = async () => {
            let expoToken = await AsyncStorage.getItem("expoToken");
            if (!expoToken) {
                if (Platform.OS === "android") {
                    await Notifications.setNotificationChannelAsync("default", {
                        name: "default",
                        importance: Notifications.AndroidImportance.MAX,
                    });
                }
                const { status: existingStatus } =
                    await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== "granted") {
                    console.log("Notification permissions not granted!");
                    return;
                }
                expoToken = (await Notifications.getExpoPushTokenAsync()).data;
                await AsyncStorage.setItem("expo-push-token", expoToken);
            }
            try {
                const deviceInfo = {
                    deviceName: Device.deviceName,
                    modelName: Device.modelName,
                    osName: Device.osName,
                    osVersion: Device.osVersion,
                };

                const data = {
                    expoToken: expoToken,
                    deviceInfo: deviceInfo,
                };

                const qrValue = JSON.stringify(data);

                setQrData(qrValue);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        prepareQRData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scan to Add Companion</Text>
            <View style={styles.qrContainer}>
                {loading ? (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#07524a" />
                        <Text style={styles.message}>Preparing Companion Device</Text>
                    </View>
                ) : error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : (
                    <QRCode
                        enableLinearGradient={true}
                        // gradientDirection={["left", "right"]}
                        linearGradient={["#07524a", "#048a94"]}
                        size={200}
                        value={qrData}
                        logo={require('../../../assets/icon.png')}
                    />
                )}
            </View>
            <Text style={{ marginTop: 20, color: "white", fontWeight: "bold" }}>How to connect with main device ?</Text>
            <View style={{ marginTop: 5 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 5 }}>
                    <Text style={{ color: "white", fontSize: 14 }}>1. Click Side Menu</Text>
                    <FontAwesome5 name="bars" color="white" size={14} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 5 }}>
                    <Text style={{ color: "white", fontSize: 14 }}>2. Select Other Devices</Text>
                    <MaterialIcons name="devices" size={18} color="white" />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 5 }}>
                    <Text style={{ color: "white", fontSize: 14 }}>3. Add New Device</Text>
                    <FontAwesome5 name="plus" color="white" size={14} />
                </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, borderRadius: 10, marginTop: 40, width: 150 }} onPress={() => navigation.goBack()}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        color: "white",
        fontWeight: "bold",
    },
    qrContainer: {
        width: 250,
        height: 250,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "white",
        borderRadius: 15,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    message: {
        marginTop: 10,
        fontSize: 14,
        textAlign: "center",
    },
    error: {
        color: "red",
        fontSize: 14,
        textAlign: "center",
        padding: 10,
    },
});

export default CompanionQRScreen;
