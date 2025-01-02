import React, { useCallback, useEffect, useState } from 'react'
import RootLayout from '../../layouts/RootLayout'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import GradientButtonOne from '../../../components/shared/GradientButtonOne';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetCampInternetPackages } from '../../../query/camp/queries';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { loadLoadingModal } from '../../../redux/slices/remoteModalSlice';

const AvailableMembership = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.authentication.token);
  const { mutateAsync: getInternetPackages, isPending: pendingInternetPackages } = useGetCampInternetPackages();
  const [packages, setPackages] = useState<any[]>([]);

  const [selectedPlan, setSelectedPlan] = useState<any>()

  useEffect(() => {
    if (!token) return;
    // console.log("Rerendering App") 
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
  }, []);

  const handlePurchaseClick = async (pid: string) => {
    const planIdx = packages.findIndex((pkg: any) => pkg?.package_id == pid);
    setSelectedPlan(packages[planIdx]);
  }

  useEffect(() => {
    if (selectedPlan) {
      Alert.alert(
        "Confirm Purchase",
        `You Are Purchasing ${selectedPlan?.package_name}, for ${selectedPlan?.package_price} AED`,
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
              setSelectedPlan(null)
            }
          }
        ],
        { cancelable: false }
      );
    }
  }, [selectedPlan])

  const handlePurchaseInternetPackage = async () => {

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
                      <Text style={styles.package_plan_price}>{plan?.package_price} AED</Text>
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
                  <GradientButtonOne onPress={() => handlePurchaseClick(plan?.package_id)} style={styles.purchase_btn} colors={["#51F3E0", "#5AE7A5"]}>
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
