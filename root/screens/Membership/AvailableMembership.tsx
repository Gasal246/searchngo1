import React, { useCallback, useEffect, useState } from 'react'
import RootLayout from '../../layouts/RootLayout'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import GradientButtonOne from '../../../components/shared/GradientButtonOne';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetCampInternetPackages } from '../../../query/camp/queries';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { loadLoadingModal } from '../../../redux/slices/remoteModalSlice';
import { usePurchaseNewMembership } from '../../../query/membership/queries';
import Toast from 'react-native-toast-message';
import { refetchUserMembershipDetails } from '../../../redux/slices/membershipDetails';
import { fetchUserWallet } from '../../../redux/slices/appAuthenticationSlice';

const AvailableMembership = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.authentication.token);
  const { upcomingMembership } = useSelector((state: RootState) => state.membership)
  const { mutateAsync: getInternetPackages, isPending: pendingInternetPackages } = useGetCampInternetPackages();
  const { mutateAsync: purchaseMembership, isPending: purchasingMemebership } = usePurchaseNewMembership();
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    // console.log(token)
    if (!token) return;
    console.log("Token :", token)
    const fetchInternetPackages = async () => {
      try {
        dispatch(loadLoadingModal(true));
        const response = await getInternetPackages({ token });
        setPackages(response?.data?.list || []);
      } catch (error) {
        console.error("Error fetching internet packages:", error);
      } finally {
        dispatch(loadLoadingModal(false));
      }
    };

    fetchInternetPackages();
  }, [token]);

  const handlePurchaseClick = async (plan: any) => {
    if (upcomingMembership) {
      Alert.alert("Already Have an Upcoming Plan", "make sure you don't have an upcoming membership plan before purchasing new one.")
    } else {
      Alert.alert(
        "Confirm Purchase",
        `You Are Purchasing ${plan?.package_name}, for ${plan?.package_price + " " + plan?.currency_code}`,
        [
          {
            text: "Continue",
            onPress: () => {
              handlePurchaseInternetPackage(plan?.package_id)
            }
          },
          {
            text: "Discard",
            style: "cancel",
            onPress: () => { }
          }
        ],
        { cancelable: false }
      );
    }
  }

  const handlePurchaseInternetPackage = async (packageId: string) => {
    dispatch(loadLoadingModal(true))
    try {
      const response = await purchaseMembership({ payload: { package_id: packageId }, token: token! });
      await dispatch(refetchUserMembershipDetails(token!));
      console.log("Purchased Membership", response)
      if (response?.status == 200) {
        dispatch(fetchUserWallet(token!))
        return Toast.show({
          type: "success",
          text1: "1 Package Added",
          text2: "new membership package added."
        })
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(loadLoadingModal(false))
    }
  }

  return (
    <RootLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Available Plans at your service provider</Text>
        <View style={[styles.scrollWrapper]}>
          <ScrollView style={styles.scrollView}>
            {packages?.map((plan) => (
              <View key={plan?.package_id} style={styles.package_wrapper}>
                <View style={styles.package_view}>
                  <LinearGradient
                    colors={["#00c8a4", "#006e7d"]}
                    style={styles.package_header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.package_plan_name}>{plan?.package_name}</Text>
                    <View style={styles.package_membership_view}>
                      <Text style={styles.package_membership_charge_text}>Membership Charges</Text>
                      <Text style={styles.package_plan_price}>{plan?.package_price} {plan?.currency_code}</Text>
                    </View>
                  </LinearGradient>
                  <View style={styles.package_detail_wrapper}>
                    <View style={styles.package_detail_one}>
                      <Text style={styles.package_detail_key}>Complimentary Internet</Text>
                      <Text style={styles.package_detail_value}>{plan?.package_speed}</Text>
                    </View>
                    <View style={styles.package_detail_two}>
                      <Text style={styles.package_detail_key}>Validity</Text>
                      <Text style={styles.package_detail_value}>{plan?.original_duration} Days</Text>
                    </View>
                    <View style={styles.package_detail_three}>
                      <Text style={styles.package_detail_key_white}>Available Services</Text>
                      <Text style={styles.package_detail_value_white}>All</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.purchase_btn_wrapper}>
                  <GradientButtonOne onPress={() => handlePurchaseClick(plan)} style={styles.purchase_btn} colors={["#51F3E0", "#5AE7A5"]}>
                    <Text style={styles.purchaseText}>Purchase</Text>
                  </GradientButtonOne>
                </View>
              </View>
            ))}
            {pendingInternetPackages && <Text style={styles.loadingText}>Loading.. .</Text>}
            {packages?.length > 0 && <Text style={styles.end_text}>More Plans Are Coming Soon..</Text>}
          </ScrollView>
        </View>
      </View>
    </RootLayout>
  )
}

const styles = StyleSheet.create({
  scrollWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 5,
    marginBottom: 20,
    flex: 1,
    marginHorizontal: 5
  },
  scrollView: {
    paddingTop: 10,
    flex: 1
  },
  package_wrapper: {
    position: 'relative',
    marginBottom: 30
  },
  package_view: { width: '100%', backgroundColor: 'white', borderRadius: 20, overflow: "hidden", paddingBottom: 35 },
  package_header: { width: '100%', paddingVertical: 12, alignItems: 'center', position: 'relative', marginBottom: 30 },
  package_plan_name: { color: 'white', fontWeight: '700', fontSize: 18, marginBottom: 15 },
  package_membership_view: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  package_detail_wrapper: { paddingHorizontal: 25 },
  package_detail_one: { width: '100%', backgroundColor: '#7EEFB1', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
  package_detail_two: { width: '100%', backgroundColor: '#44D7A3', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
  package_detail_three: { width: '100%', backgroundColor: '#00C7A6', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 },
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
  },
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 8,
    // backgroundColor: 'red'
  },
  header: {
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: 'white',
    fontWeight: '500',
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 5
  },
  purchaseText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
  },
  end_text: {
    color: 'white',
    textAlign: 'center',
    width: '100%',
    paddingBottom: 20
  },
  loadingText: { fontSize: 18, color: 'white', fontWeight: '600', textAlign: 'center' },
});

export default AvailableMembership
