import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loadCompanionCameraModal } from "../../redux/slices/remoteModalSlice";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert, } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { storeLog } from "../../redux/slices/logSlice";
import { storeCompanionQrData } from "../../redux/slices/userappSlice";
import { addCompanionRecord } from "../../query/companion/functions";
import Toast from "react-native-toast-message";

const CompanionScanner = () => {
  const modalVisible = useSelector((state: RootState) => state.remoteModals.companionCameraModal);
  const { token } = useSelector((state: RootState) => state.authentication);
  const dispatch = useDispatch<AppDispatch>();

  const closeModal = () => {
    dispatch(loadCompanionCameraModal(false));
    setScanned(false);
  };

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    if (modalVisible) getBarCodeScannerPermissions();
  }, [modalVisible]);

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
    dispatch(storeLog({ key: 'scanned_qr_code', value: data }));
    const obj = JSON.parse(data);
    if (!obj || !obj.deviceInfo) {
      Alert.alert("Invalid QR Code", "The scanned QR code is invalid.", [
        { text: "Discard", onPress: closeModal },
        { text: "Rescan", onPress: () => setScanned(false) },
      ]);
      return;
    }
    Alert.alert("Device Confirmation", `Your device is ${obj?.deviceInfo?.deviceName}, ${obj?.deviceInfo?.modelName}`, [
      { text: "Add", onPress: () => handleAddDevice(obj) },
      { text: "Rescan", onPress: () => setScanned(false) },
    ]);
  };

  const handleAddDevice = async (data: any) => {
    if (!token) {
      Alert.alert("Token Missing", "Action will be reported.");
      return;
    }
    // create record data
    const recordData = {
      deviceName: data?.deviceInfo?.deviceName,
      deviceModel: data?.deviceInfo?.modelName,
      deviceOs: data?.deviceInfo?.osName,
      deviceOsVersion: data?.deviceInfo?.osVersion,
      companionET: data?.expoToken
    };
    dispatch(storeCompanionQrData(recordData));

    const response = await addCompanionRecord(recordData, token);
    if (response?.status == 200) {
      Toast.show({
        type: "success",
        text1: "Device Added",
        text2: `${recordData?.deviceName}, ${recordData?.deviceModel} Added as Companion.`
      })
      closeModal();
    } else {
      Toast.show({
        type: 'error',
        text1: "Failed to add device",
        text2: "Please try again later."
      })
      dispatch(storeCompanionQrData(null));
      closeModal();
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={{ width: "80%" }}>
              <Text style={styles.modalTitle}>{`${hasPermission ? 'Scan Companion QR' : 'Requesting for camera permission'}`}</Text>
              <Text style={styles.modalDescription}>
                {hasPermission ? 'Align the QR code within the frame to scan.' : 'Please grant camera permission to scan.'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Entypo name="cross" size={32} color="red" />
            </TouchableOpacity>
          </View>
          <View style={styles.scannerContainer}>
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    paddingTop: 15,
  },
  modalContent: {
    flex: 1,
    width: "97%",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalTitle: {
    color: "#c9ffeb",
    fontSize: 18,
    fontWeight: "600",
  },
  modalDescription: {
    fontSize: 14,
    color: "#c9ffeb",
  },
  closeButton: {
    padding: 10,
  },
  scannerContainer: {
    width: "100%",
    height: "60%",
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default CompanionScanner;
