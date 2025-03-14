import React from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { loadChangeBaseCampAlreadyShown, loadChangeBaseCampModal, loadLoadingModal } from '../../../redux/slices/remoteModalSlice';
import { Entypo } from '@expo/vector-icons';
import GradientButtonOne from '../GradientButtonOne';
import { assignUserCamp, changeUserCamp, validateCampApiFunction } from '../../../query/camp/functions';
import Toast from 'react-native-toast-message';
import { loadToken, loadUserData } from '../../../redux/slices/appAuthenticationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refetchUserMembershipDetails } from '../../../redux/slices/membershipDetails';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

const ChangeBaseCampDialogue = () => {

    const modalVisible = useSelector((state: RootState) => state.remoteModals.changeBaseCampModal);
    const currentUserData = useSelector((state: RootState) => state.authentication.user_data);
    const authToken = useSelector((state: RootState) => state.authentication.token);
    const { changeBaseCampAlreadyShown } = useSelector((state: RootState) => state.remoteModals)
    const locationData = useSelector((state: RootState) => state.networkData.location_info);
    const navigation = useNavigation<NavigationProp>();

    const dispatch = useDispatch<AppDispatch>()
    const closeModal = () => {
        if(changeBaseCampAlreadyShown){
            dispatch(loadChangeBaseCampModal(false));
            navigation.replace('Services');
            return;
        }
        dispatch(loadChangeBaseCampModal(false));
        dispatch(loadChangeBaseCampAlreadyShown(true));
        return;
    }

    const handleSubmitCampId = async () => {
        if (!authToken) {
            Toast.show({
                type: 'error',
                text1: "Auth Token Is Missing!"
            })
            return;
        }
        if (currentUserData?.baseCampAvailable) {
            if (currentUserData?.base_camp_client_id != currentUserData?.location_camp?.location_camp_client_id) {
                Alert.alert(
                    "Different Client!!",
                    `You Can't Use Your EXISTING WALLET In This Camp If you switch to this camp. As Every wallet is differ amoung different clients a new wallet for the client and you will be created if not already existing.`,
                    [
                        {
                            text: "I Understand Risk, Continue",
                            onPress: async () => {
                                dispatch(loadLoadingModal(true))
                                try {
                                    const response = await changeUserCamp(currentUserData?.location_camp?.location_camp_id, authToken);
                                    if (response) {
                                        Toast.show({
                                            type: "info",
                                            text1: `${response?.message}`
                                        })
                                    }
                                    const res = await validateCampApiFunction(locationData?.SG?.location_id, locationData?.SG?.client_mac, authToken);
                                    dispatch(loadUserData(JSON.stringify(res.data.user_data)));
                                    await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user_data));
                                    dispatch(loadToken(res.data.token));
                                    await dispatch(refetchUserMembershipDetails(res.data.token));
                                } catch (error) {
                                    console.log(error)
                                } finally {
                                    dispatch(loadLoadingModal(false));
                                    closeModal();
                                }
                            }
                        },
                        {
                            text: "Discard",
                            style: "cancel",
                            onPress: () => {
                                closeModal();
                                Toast.show({
                                    type: "success",
                                    text1: "That's my dude!!"
                                })
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    "Changing Your Base Camp ?",
                    `You Are Changing Your Base Camp to ${currentUserData?.location_camp?.location_camp_name}`,
                    [
                        {
                            text: "Continue",
                            onPress: async () => {
                                dispatch(loadLoadingModal(true))
                                try {
                                    const response = await changeUserCamp(currentUserData?.location_camp?.location_camp_id, authToken);
                                    if (response) {
                                        Toast.show({
                                            type: "info",
                                            text1: `${response?.message}`
                                        })
                                    }
                                    const res = await validateCampApiFunction(locationData?.SG?.location_id, locationData?.SG?.client_mac, authToken);
                                    dispatch(loadUserData(JSON.stringify(res.data.user_data)));
                                    await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user_data));
                                    dispatch(loadToken(res.data.token));
                                    await dispatch(refetchUserMembershipDetails(res.data.token));
                                } catch (error) {
                                    console.log(error)
                                } finally {
                                    dispatch(loadLoadingModal(false));
                                    closeModal();
                                }
                            }
                        },
                        {
                            text: "Discard",
                            style: "cancel",
                            onPress: () => {
                                closeModal()
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }
        } else {
            Alert.alert(
                "Setting Base Camp",
                `Are you sure to set ${currentUserData?.location_camp?.location_camp_name} as your Base Camp ?`,
                [
                    {
                        text: "Yeah!",
                        onPress: async () => {
                            dispatch(loadLoadingModal(true))
                            try {
                                const response = await assignUserCamp(currentUserData?.location_camp?.location_camp_id, authToken);
                                if (response) {
                                    Toast.show({
                                        type: "info",
                                        text1: `${response?.message}`
                                    })
                                }
                                const res = await validateCampApiFunction(locationData?.SG?.location_id, locationData?.SG?.client_mac, authToken);
                                dispatch(loadUserData(JSON.stringify(res.data.user_data)));
                                await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user_data));
                                dispatch(loadToken(res.data.token));
                                await dispatch(refetchUserMembershipDetails(res.data.token));
                            } catch (error) {
                                console.log(error)
                            } finally {
                                dispatch(loadLoadingModal(false));
                                closeModal();
                            }
                        }
                    },
                    {
                        text: "Nop!",
                        style: "cancel",
                        onPress: () => {
                            closeModal()
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <BlurView experimentalBlurMethod="dimezisBlurView" intensity={60} tint="dark" style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.close_button} onPress={closeModal}>
                            <Entypo name="cross" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.connectivity_view}>
                                    <Text style={styles.title}>{currentUserData?.baseCampAvailable ? "Change" : "Setup"} your base camp</Text>
                                    <View style={styles.camp_details_view}>
                                        <Text style={styles.camp_details_title}>YOU ARE AT</Text>
                                        <Text style={styles.camp_details_camp_name}>{currentUserData?.location_camp?.location_camp_name || 'OUT OF SERVICE AREA'}</Text>
                                        {!currentUserData?.location_camp?.location_camp_id && <View style={styles.error_display}>
                                            <Text style={styles.error_text}>You should be connected to camp wifi from camp</Text>
                                        </View>}
                                        {currentUserData?.location_camp?.location_camp_id && (currentUserData?.location_camp?.location_camp_id == currentUserData?.base_camp_id) && <View style={styles.error_display}>
                                            <Text style={styles.error_text}>This is camp is already your base camp.</Text>
                                        </View>}
                                    </View>
                                    {currentUserData?.location_camp?.location_camp_id && (currentUserData?.location_camp?.location_camp_id != currentUserData?.base_camp_id)
                                        ?
                                        <View>
                                            <GradientButtonOne onPress={handleSubmitCampId} style={{ borderRadius: 10 }} colors={['#4AF4CF', '#00C9A3']}>
                                                <Text style={styles.action_text}>Set this camp as base camp</Text>
                                            </GradientButtonOne>
                                        </View>
                                        :
                                        <View>
                                            <GradientButtonOne onPress={closeModal} style={{ borderRadius: 10 }} colors={['#F35248', '#F35248']}>
                                                <Text style={styles.action_text}>Cancel Setup</Text>
                                            </GradientButtonOne>
                                        </View>}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </BlurView>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    camp_details_view: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 10 },
    camp_details_title: { fontSize: 12, textAlign: 'center' },
    camp_details_camp_name: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    error_display: { 
        // backgroundColor: '#EF9995', 
        padding: 2, paddingHorizontal: 10, borderRadius: 10,marginBottom: 5 
    },
    error_text: { fontWeight: 'bold', fontSize: 12, textAlign: 'center', color: "red" },
    action_text: { color: "white", fontWeight: 'bold', textShadowColor: 'black', textShadowOffset: { width: 0.6, height: 0.6 }, textShadowRadius: 1 },
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        textAlign: 'center'
    },
    close_button: {
        backgroundColor: 'black',
        padding: 10,
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 10
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
        width: '96%',
    },
    connectivity_view: {
        borderColor: "white",
        borderWidth: 2,
        marginTop: 20,
        borderRadius: 22,
        paddingVertical: 22,
        paddingHorizontal: 20,
        backgroundColor: 'black',
    }
})

export default ChangeBaseCampDialogue;
