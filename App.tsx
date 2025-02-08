import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import SplashScreen from './components/shared/SplashScreen';
import SelectLanguage from './root/screens/SelectLanguage';
import { SafeAreaView } from 'react-native-safe-area-context';
import './assets/index.css'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './root/screens/HomeScreen';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import MobileVerification from './root/screens/MobileVerification';
import UpdateProfile from './root/screens/UpdateProfile';
import OTPpage from './root/screens/OTPpage';
import ServicesScreen from './root/screens/ServicesScreen';
import ProfileScreen from './root/screens/ProfileScreen';
import WalletScreen from './root/screens/WalletScreen';
import { useFonts } from 'expo-font';
import TanstackProvider from './query/TanstackProvider';
import LanguageLoader from './components/shared/LanguageLoader';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { setIpAddress } from './lib/constants/appConstants';
import { getVerifiedData } from './helpers/UserHelper';
import LoaderSpin from './components/shared/LoaderSpin';
import AvailableMembership from './root/screens/Membership/AvailableMembership';
import MembershipHistory from './root/screens/Membership/MembershipHistory';
import WaterPlus from './root/screens/Services/WaterPlus';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdateExpoPushToken } from './query/userqueries/queries';
import { updateExpoPushToken } from './query/userqueries/functions';
import LogScreen from './root/screens/LogScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplashScreen(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  async function genAndStore() {
    try {
      const ip = uuidv4();
      setIpAddress(ip)
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error}`
      })
      console.log(error)
    }
  }

  const registerForPushNotifications = async () => {
    const user_data = await AsyncStorage.getItem('user_data');
    setUserData(user_data ? JSON.parse(user_data) : null);
    if (!user_data) return;
    const expo_push_token = await AsyncStorage.getItem('expo-push-token');
    if (expo_push_token) return;
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await AsyncStorage.setItem('expo-push-token', token);
      const userToken = await AsyncStorage.getItem('user_token');
      const response = await updateExpoPushToken({
        expo_push_token: token
      }, userToken ? userToken : '');
      if(!response || response?.error) {
        await AsyncStorage.removeItem('expo-push-token')
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    genAndStore();
    registerForPushNotifications();
  }, [])

  const [fontLoaded] = useFonts({
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
  })

  const toastConfig = {
    info: (props: any) => (
      <BaseToast
        {...props}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 12,
          fontWeight: 'bold',
        }}
      />
    ),
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 12,
          fontWeight: 'bold',
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
  };

  return (
    <Provider store={store}>
      <LanguageLoader />
      {showSplashScreen ? <SplashScreen /> :
        <TanstackProvider>
          <SafeAreaView style={{ backgroundColor: "#222831", width: "100%", height: "100%" }}>
            <LoaderSpin />
            <StatusBar barStyle="light-content" backgroundColor="#222831" />
            <NavigationContainer>
              <Stack.Navigator initialRouteName={userData?.id ? "Services" : "Language"} screenOptions={{
                contentStyle: {
                  backgroundColor: "#222831"
                }
              }}>
                <Stack.Screen name="LogScreen" component={LogScreen} options={{
                  headerShown: true,
                }} />
                <Stack.Screen name="MembershipHistory" component={MembershipHistory} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="AvailableMembership" component={AvailableMembership} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="WaterPlus" component={WaterPlus} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="Wallet" component={WalletScreen} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="Services" component={ServicesScreen} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="MobileVerification" component={MobileVerification} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="OtpPage" component={OTPpage} options={{
                  headerShown: false,
                }} />
                <Stack.Screen name="Language" component={SelectLanguage} options={{
                  headerShown: false
                }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{
                  headerShown: false,
                }} />
              </Stack.Navigator>
              <Toast config={toastConfig} />
            </NavigationContainer>
          </SafeAreaView>
        </TanstackProvider>}
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
