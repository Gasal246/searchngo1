import React, { useEffect } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConnectionModal from '../../components/shared/Connection/ConnectionModal';
import SideBar from '../../components/shared/SideBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadChangeBaseCampModal, loadQRModal } from '../../redux/slices/remoteModalSlice';
import ConnectionQR from '../../components/shared/Connection/ConnectionQR';
import { AppDispatch, RootState } from '../../redux/store';
import FetchEssentials from '../../components/shared/Connection/FetchEssentials';
import ChangeBaseCampDialogue from '../../components/shared/Dialogs/ChangeBaseCampDialogue';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user_data } = useSelector((state: RootState) => state.authentication);

    useEffect(() => {
        if(user_data?.is_new_user) {
            dispatch(loadChangeBaseCampModal(true));
        }
        if(!user_data?.baseCampAvailable) {
            dispatch(loadChangeBaseCampModal(true));
        }
    }, [user_data])

    return (
        <SafeAreaView style={{ backgroundColor: "#222831", width: "100%", height: "100%" }}>
            <ConnectionModal />
            <ConnectionQR />
            <ChangeBaseCampDialogue />
            <View style={styles.topbar_flex_container}>
                <FetchEssentials />
                <SideBar />
                <View style={styles.center_logo}>
                    <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 60, height: 70, objectFit: "contain" }} />
                </View>
                {/* <TouchableOpacity onPress={() => navigation.navigate("Profile")}><FontAwesome5 name="user" size={22} color="white" /></TouchableOpacity> */}
                <TouchableOpacity style={styles.qr_trigger} onPress={() => dispatch(loadQRModal(true))}><MaterialCommunityIcons name="qrcode" size={30} color="white" /></TouchableOpacity>
            </View>
            {children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    qr_trigger: {
        padding: 10
    },
    center_logo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        alignItems: "center"
    },
    topbar_flex_container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
})

export default RootLayout