import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import RootLayout from '../../layouts/RootLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import UpcomingMembership from './components/UpcomingMembership';
import ExpiredMembership from './components/ExpiredMembership';
import { useGetUserMembershipDetails } from '../../../query/membership/queries';
import Toast from 'react-native-toast-message';
import { loadLoadingModal } from '../../../redux/slices/remoteModalSlice';
import { calculateValidityDate, formatDateString } from '../../../lib/utilities';
import TimeCounter from '../../../components/shared/utility/TimeCounter';
import { translations } from '../../../lib/translations';
import { useNavigation } from '@react-navigation/native';

type TabTypes = 'current' | 'upcoming' | 'expired';

const MembershipHistory = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>()
    const token = useSelector((state: RootState) => state.authentication.token);
    const { isGuest } = useSelector((state: RootState) => state.guest);
    const [membershipDetails, setMembershipDetails] = useState<any[]>([]);
    const [upcomingMembershipDetails, setUpcomingMembershipDetails] = useState<any[]>([]);
    const [expiredMembershipDetails, setExpireMembershipDetails] = useState<any[]>([]);
    const { mutateAsync: getMembershipDetails, isPending: fetchingMembershipDetails } = useGetUserMembershipDetails();
    const language = useSelector((state: RootState) => state.language.language);

    const handleFetchMemebershipDetails = async () => {
        if(isGuest) {
            navigation.navigate('Services');
            Alert.alert("🤷🏻‍♂️ Sorry!", "You Cannot Have Membership History!")
            return;
        }
        try {
            if (!token) {
                return Toast.show({ type: 'error', text1: 'Un Authorised Access' })
            }
            dispatch(loadLoadingModal(true));
            const response = await getMembershipDetails({ token: token });
            console.log(membershipDetails)
            if (response?.data?.list) {
                const list = response?.data?.list
                console.log(list)
                setMembershipDetails(list?.filter((order: any) => order.order_status == 1))
                setUpcomingMembershipDetails(list?.filter((order: any) => order.order_status == 3))
                setExpireMembershipDetails(list?.filter((order: any) => order.order_status == 2))
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(loadLoadingModal(false));
        }
    }

    useEffect(() => {
        handleFetchMemebershipDetails()
    }, [])

    return (
        <RootLayout>
            <View style={{ paddingHorizontal: 10, paddingTop: 10, flex: 1, paddingBottom: 20 }}>
                <Text style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 10 }}>{translations[language].membership_history}</Text>
                <View style={{ flex: 1, borderRadius: 15, overflow: 'hidden' }}>
                    <ScrollView style={{ flex: 1 }}>
                        {/* CURRENT MEMBERSHIP DETAILS */}
                        {membershipDetails?.length > 0 && membershipDetails?.map((details: any) => (
                            <View style={styles.package_wrapper} key={details?.id}>
                                <View style={styles.package_view}>
                                    <LinearGradient
                                        colors={["#00c8a4", "#006e7d"]}
                                        style={styles.package_header}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={styles.package_plan_name}>{translations[language].current_membership}</Text>
                                        <View style={styles.package_membership_view}>
                                            <Text style={styles.package_membership_charge_text}>{details?.package_name}</Text>
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
                                            <Text style={styles.package_detail_key_white}>{translations[language].expire_on}</Text>
                                            <Text style={styles.package_detail_value_white}>{formatDateString(details?.package_expiry_date)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.purchase_btn_wrapper}>
                                    <View style={styles.purchase_btn}>
                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>{translations[language].time_left}</Text>
                                        <TimeCounter textStyle={{ color: 'white', fontWeight: '700', fontSize: 16 }} targetDate={details?.package_expiry_date} />
                                    </View>
                                </View>
                            </View>
                        ))}

                        {/* UPCOMING MEMBERSHIP */}
                        {upcomingMembershipDetails?.length > 0 && <UpcomingMembership data={upcomingMembershipDetails} />}

                        {/* EXPIRED MEMBERSHIP */}
                        {expiredMembershipDetails?.length > 0 && <ExpiredMembership data={expiredMembershipDetails} />}

                    </ScrollView>
                </View>
            </View>
        </RootLayout>
    );
}

const styles = StyleSheet.create({
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
    package_header: { width: '100%', paddingVertical: 12, alignItems: 'center', position: 'relative', marginBottom: 30 },
    plan_header: { width: '100%', alignItems: 'center', borderBottomWidth: 2, borderColor: 'black', paddingTop: 10 },
    package_plan_name: { color: 'white', fontWeight: '700', fontSize: 18, marginBottom: 15 },
    package_membership_view: {
        alignItems: 'center',
        width: '85%',
        backgroundColor: '#005F78',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10,
        position: 'absolute',
        bottom: -20,
        shadowColor: 'black',
        shadowRadius: 5,
        elevation: 10,
    },
    package_membership_charge_text: { color: 'white', fontWeight: '600', fontSize: 16 },
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
        borderRadius: 15,
        shadowColor: 'black',
        shadowRadius: 10,
        elevation: 10,
        backgroundColor: '#005F78',
        paddingVertical: 10,
        paddingHorizontal: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default MembershipHistory;
