import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Entypo } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import TimeCounter from '../utility/TimeCounter';
import { calculateValidityDate, formatDateString } from '../../../lib/utilities';
import GradientButtonOne from '../GradientButtonOne';
import { translations } from '../../../lib/translations';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const MembershipViewDialogue = ({ children, details }: { children: React.ReactNode, details: any }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const language = useSelector((state: RootState) => state.language.language);

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    const handleClickActivatePlan = () => {
        Alert.alert(
            "Already have a membershp plan ?",
            "You may lose your current plan while activating a new one",
            [
                {
                    text: "Continue",
                    onPress: () => {
                        // action to do in confirmation
                    }
                },
                {
                    text: "Discard",
                    style: "cancel",
                    onPress: () => {
                        // action to do in cancelling
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleModal}>
                {children}
            </TouchableOpacity>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.close_button} onPress={toggleModal}>
                            <Entypo name="cross" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableWithoutFeedback>
                            <View style={[styles.modalContent]}>
                                <View style={styles.package_wrapper}>
                                    <View style={styles.package_view}>
                                        <LinearGradient
                                            colors={["#00c8a4", "#006e7d"]}
                                            style={styles.package_header}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Text style={styles.package_plan_name}>{details?.package_name}</Text>
                                            <View style={styles.package_membership_view}>
                                                <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>{translations[language].membership_charge}</Text>
                                                <Text style={styles.package_membership_charge_text}>{details?.package_amount} {details?.client_data?.currency_code}</Text>
                                            </View>
                                        </LinearGradient>
                                        <View style={styles.package_detail_wrapper}>
                                            <View style={styles.package_detail_one}>
                                                <Text style={styles.package_detail_key}>{translations[language].complimentary_internet}</Text>
                                                <Text style={styles.package_detail_value}>{details?.package_speed}</Text>
                                            </View>
                                            <View style={styles.package_detail_two}>
                                                <Text style={styles.package_detail_key}>{translations[language].validity}</Text>
                                                <Text style={styles.package_detail_value}>{calculateValidityDate(details?.package_expiry_date, details?.package_start_date)}</Text>
                                            </View>
                                            <View style={styles.package_detail_three}>
                                                <Text style={styles.package_detail_key_white}>{translations[language].availible_services}</Text>
                                                <Text style={styles.package_detail_value_white}>All</Text>
                                            </View>
                                            <View style={styles.package_detail_four}>
                                                <Text style={styles.package_detail_key_white}>{translations[language].start_on}</Text>
                                                <Text style={styles.package_detail_value_white}>{formatDateString(details?.package_start_date)}</Text>
                                            </View>
                                            <View style={styles.package_detail_five}>
                                                <Text style={styles.package_detail_key_white}>{details?.order_status == 3 ? translations[language].expire_on : "Exipired On"}</Text>
                                                <Text style={styles.package_detail_value_white}>{formatDateString(details?.package_expiry_date)}</Text>
                                            </View>
                                            {/* {details?.order_status == 2 &&
                                                <>
                                                    <Text style={{ color: 'gray', marginTop: 10, fontWeight: '600', textAlign: 'center' }}>ALERT</Text>
                                                    <Text style={{ color: 'gray', marginBottom: 10, fontWeight: '600', textAlign: 'center' }}>You May Lose Your Current Membership Plan While You Are Activating New One...</Text>
                                                </>
                                            } */}
                                        </View>
                                    </View>
                                    {details?.order_status == 3 && <View style={styles.purchase_btn_wrapper}>
                                        <View style={styles.purchase_btn}>
                                            <GradientButtonOne
                                                colors={["#4EFBE6", "#5AE7A6"]}
                                                style={{ width: '100%' }}
                                                onPress={handleClickActivatePlan}
                                            >
                                                <Text style={{ color: 'black', fontWeight: '600', fontSize: 16 }}>Activate</Text>
                                            </GradientButtonOne>
                                        </View>
                                    </View>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        position: 'relative',
    },
    modalContent: {
        padding: 10
    },
    close_button: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 10
    },
    package_wrapper: {
        position: 'relative',
        marginBottom: 30
    },
    plan_row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
    },
    plan_title_view: {
        paddingHorizontal: 20
    },
    plan_title_view_text: {
        fontWeight: '600'
    },
    plan_view_btn: {
        paddingHorizontal: 20,
        backgroundColor: '#005F78',
        paddingVertical: 10,
    },
    plan_view_btn_text: {
        color: 'white',
        fontWeight: '600'
    },
    package_view: { width: '100%', backgroundColor: 'white', borderRadius: 20, overflow: "hidden", paddingBottom: 35 },
    plan_view: { width: '100%', backgroundColor: 'white', borderRadius: 20, overflow: "hidden", marginBottom: 10 },
    package_header: { width: '100%', paddingVertical: 12, alignItems: 'center', position: 'relative', marginBottom: 35 },
    plan_header: { width: '100%', alignItems: 'center', borderBottomWidth: 2, borderColor: 'black', paddingTop: 10 },
    package_plan_name: { color: 'white', fontWeight: '700', fontSize: 18, marginBottom: 15 },
    package_membership_view: {
        alignItems: 'center',
        width: '85%',
        backgroundColor: '#005F78',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: -22,
        shadowColor: 'black',
        shadowRadius: 5,
        elevation: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    package_membership_charge_text: { color: 'white', fontWeight: '600', fontSize: 18 },
    package_plan_price: { color: 'white', fontWeight: '700', fontSize: 20 },
    package_detail_wrapper: { paddingHorizontal: 25, paddingBottom: 10 },
    package_detail_one: { width: '100%', backgroundColor: '#7EEFB1', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
    package_detail_two: { width: '100%', backgroundColor: '#44D7A0', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
    package_detail_three: { width: '100%', backgroundColor: '#00C9A3', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
    package_detail_four: { width: '100%', backgroundColor: '#019678', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
    package_detail_five: { width: '100%', backgroundColor: '#016251', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
    package_detail_key: { color: 'black', fontSize: 14, fontWeight: '500' },
    package_detail_key_white: { color: 'white', fontSize: 14, fontWeight: '500' },
    package_detail_value: { color: 'black', fontSize: 16, fontWeight: '700' },
    package_detail_value_white: { color: 'white', fontSize: 16, fontWeight: '700' },
    purchase_btn_wrapper: {
        position: 'absolute',
        bottom: -18,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    purchase_btn: {
        width: '85%',
        borderRadius: 30,
        shadowColor: 'black',
        shadowRadius: 10,
        elevation: 10,
        // backgroundColor: '#005F78',
        paddingVertical: 10,
        paddingHorizontal: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default MembershipViewDialogue;
