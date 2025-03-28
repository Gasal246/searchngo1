import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RootLayout from "../../layouts/RootLayout";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { loadCompanionCameraModal } from "../../../redux/slices/remoteModalSlice";

const CompanionScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companionQrData } = useSelector((state: RootState) => state.userapp);

  return (
    <RootLayout>
      <View style={styles.container}>
        <Text style={styles.headerText}>Companion Screen</Text>

        <View
          style={{
            backgroundColor: "black",
            marginTop: 10,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              color: "black",
              backgroundColor: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
              paddingVertical: 10,
            }}
          >
            Companion Devices:
          </Text>
          <View
            style={{
              padding: 15,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 10,
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
              onPress={() => dispatch(loadCompanionCameraModal(true))}
            >
              <MaterialIcons name="add" size={28} color="black" />
              <View>
                <Text style={{ color: "black", fontWeight: 'bold' }}>Add New Device</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 10,
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <MaterialIcons name="devices" size={28} color="black" />
              <View>
                <Text style={{ color: "black", fontWeight: 'bold' }}>Device 1</Text>
                <Text style={{ color: "black", fontSize: 12, fontWeight: '500' }}>NameOf The Device</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RootLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  headerText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "white",
    textAlign: "center",
    paddingVertical: 5,
    borderRadius: 10,
  },
});

export default CompanionScreen;
