import React, { useCallback, useEffect, useState } from 'react'
import RootLayout from '../layouts/RootLayout'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import GradientButtonOne from '../../components/shared/GradientButtonOne';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetCampInternetPackages } from '../../query/camp/queries';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { loadLoadingModal } from '../../redux/slices/remoteModalSlice';

const AvailableMembership = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.authentication.token);
  const { mutateAsync: getInternetPackages, isPending: pendingInternetPackages } = useGetCampInternetPackages();
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

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
  }, [token, getInternetPackages, dispatch]);

  const handlePurchaseInternetPackage = async () => {

  }

  return (
    <RootLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Available Plans at your service provider</Text>
        <View style={[styles.scrollWrapper]}>
          <ScrollView style={{ paddingTop: 10, flex: 1 }}>
            {packages?.map((plan) => (
              <View key={plan?.package_id} style={{ position: 'relative', marginBottom: 30 }}>
                <View style={{ width: '100%', backgroundColor: 'white', borderRadius: 20, overflow: "hidden", paddingBottom: 35 }}>
                  <LinearGradient
                    colors={["#00c8a4", "#006e7d"]}
                    style={{ width: '100%', paddingVertical: 12, alignItems: 'center', position: 'relative', marginBottom: 30 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 18, marginBottom: 15 }}>{plan?.package_name}</Text>
                    <View style={{
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
                    }}>
                      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Membership Charges</Text>
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 20 }}>{plan?.package_price} AED</Text>
                    </View>
                  </LinearGradient>
                  <View style={{ paddingHorizontal: 25 }}>
                    <View style={{ width: '100%', backgroundColor: '#7EEFB1', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 }}>
                      <Text style={{ color: 'black', fontSize: 14, fontWeight: '500' }}>Complimentary Internet</Text>
                      <Text style={{ color: 'black', fontSize: 16, fontWeight: '700' }}>{plan?.package_speed}</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#44D7A3', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 }}>
                      <Text style={{ color: 'black', fontSize: 14, fontWeight: '500' }}>Validity</Text>
                      <Text style={{ color: 'black', fontSize: 16, fontWeight: '700' }}>{plan?.original_duration} Days</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#00C7A6', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5 }}>
                      <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Available Services</Text>
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>All</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  position: 'absolute',
                  bottom: -18,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <GradientButtonOne style={{
                    width: '85%',
                    borderRadius: 15,
                    shadowColor: 'black',
                    shadowRadius: 10,
                    elevation: 10,
                  }} colors={["#51F3E0", "#5AE7A5"]}>
                    <Text style={styles.purchaseText}>Purchase</Text>
                  </GradientButtonOne>
                </View>
              </View>
            ))}
            {pendingInternetPackages && <Text style={{ fontSize: 18, color: 'white', fontWeight: '600', textAlign: 'center' }}>Loading.. .</Text>}
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
    // backgroundColor: 'red',
    marginHorizontal: 5
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 6,
    elevation: 5,
    position: 'relative',
    marginBottom: 15,
  },
  titleContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  banner: {
    width: '90%',
    height: 45,
    resizeMode: 'contain',
    objectFit: 'fill',
    position: 'relative',
    // backgroundColor:'blue'
  },
  titleText: {
    position: 'absolute',
    top: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  purchaseCardArea: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center'
  },
  memberShipButton: {
    width: '62%',
    borderRadius: 10,
    padding: 12
  },
  purchaseButton: {
    width: '36%',
    borderRadius: 10
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  detailsView: {
    display: 'flex',
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  details: {
    fontSize: 13,
    color: '#121212',
    fontWeight: '400'
  },
  value: {
    fontWeight: '500',
    fontSize: 13,
    color: '#121212',
  },
  purchaseMembership: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
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
  }
});

export default AvailableMembership
