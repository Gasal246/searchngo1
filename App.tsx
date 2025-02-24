import React, { useEffect, useRef, useState } from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import SplashScreen from './components/shared/SplashScreen';
import SelectLanguage from './root/screens/SelectLanguage';
import { SafeAreaView } from 'react-native-safe-area-context';
import './assets/index.css'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './root/screens/HomeScreen';
import { NavigationContainerRef } from '@react-navigation/native';

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
import LoaderSpin from './components/shared/LoaderSpin';
import AvailableMembership from './root/screens/Membership/AvailableMembership';
import MembershipHistory from './root/screens/Membership/MembershipHistory';
import WaterPlus from './root/screens/Services/WaterPlus';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateExpoPushToken } from './query/userqueries/functions';
import LogScreen from './root/screens/LogScreen';
import VerificationScreen from './root/screens/VerificationScreen';
import { SocketProvider } from './context/socketContext';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    genAndStore();
    setupNotifications();
    handlePendingNavigation();
    const timeout = setTimeout(() => {
      setShowSplashScreen(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  const handlePendingNavigation = async () => {
    try {
      const pendingNav = await AsyncStorage.getItem('pendingNavigation');
      if (pendingNav) {
        const { screen, params } = JSON.parse(pendingNav);
        // Clear the pending navigation
        await AsyncStorage.removeItem('pendingNavigation');
        // Wait for navigation to be ready
        setTimeout(() => {
          if (navigationRef.current && screen) {
            navigationRef.current.navigate(screen, params);
          }
        }, 2000);
      }
    } catch (error) {
      console.log('Error handling pending navigation:', error);
    }
  };

  const setupNotifications = async () => {
    // Configure notification handler for both background and foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
      }),
    });

    // Handle notifications received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      
      // If it's a verification request, navigate to verification screen
      const data = notification.request.content.data;
      if (data?.screen === 'Verification' && data?.params?.verificationSessionId && data?.params?.userId) {
        // Small delay to ensure app is ready to navigate
        setTimeout(() => {
          if (navigationRef.current) {
            navigationRef.current.navigate('Verification', {
              verificationSessionId: data.params.verificationSessionId,
              userId: data.params.userId
            });
          }
        }, 1000);
      }
    });

    // Handle notification responses (clicks)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      const data = response.notification.request.content.data;
      
      // Delay navigation slightly to ensure app is ready
      setTimeout(() => {
        if (data?.screen === 'Verification' && data?.params?.verificationSessionId && data?.params?.userId) {
          if (navigationRef.current) {
            navigationRef.current.navigate(data.screen, {
              verificationSessionId: data.params.verificationSessionId,
              userId: data.params.userId
            });
          } else {
            // Store the navigation intent for when app becomes ready
            AsyncStorage.setItem('pendingNavigation', JSON.stringify({
              screen: data.screen,
              params: {
                verificationSessionId: data.params.verificationSessionId,
                userId: data.params.userId
              }
            }));
          }
        }
      }, 1000);
    });

    // Register for push notifications
    await registerForPushNotifications();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

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
    console.log('Registering for push notifications...');
    const user_data = await AsyncStorage.getItem('user_data');
    setUserData(user_data ? JSON.parse(user_data) : null);
    if (!user_data) return;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: "8d669bbb-8148-4965-97a3-721ef40658cf"
      })).data;
      
      console.log('Push token:', token);
      await AsyncStorage.setItem('expo-push-token', token);
      
      const userToken = await AsyncStorage.getItem('user_token');
      const response = await updateExpoPushToken({
        expo_push_token: token
      }, userToken ? userToken : '');

      if(!response || response?.error) {
        await AsyncStorage.removeItem('expo-push-token');
      }

    } catch (error) {
      console.log('Error getting push token:', error);
    }
  };

  const handleNotificationResponse = async (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    console.log('Notification data:', data);
  
    if (data?.type === 'verification') {
      
      navigationRef.current?.navigate('Verification', {
        verificationSessionId: data.verificationSessionId,
        userId: data.userId
      });
    }
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const data = notification.request.content.data;
        
        if (data?.type === 'verification') {
          return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          };
        }
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    return () => responseSubscription.remove();
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
      <SocketProvider>
      <LanguageLoader />
      {showSplashScreen ? <SplashScreen /> :
        <TanstackProvider>
          <SafeAreaView style={{ backgroundColor: "#222831", width: "100%", height: "100%" }}>
            <LoaderSpin />
            <StatusBar barStyle="light-content" backgroundColor="#222831" />
            <NavigationContainer ref={navigationRef}>
            {/* initialRouteName={userData?.id ? "Services" : "Language"} */}
              <Stack.Navigator initialRouteName={userData?.id ? "Services" : "Language"} screenOptions={{
                contentStyle: {
                  backgroundColor: "#222831"
                }
              }}>
                <Stack.Screen
                  name="Verification" 
                  component={VerificationScreen} 
                  options={{ headerShown: false }} 
                />
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
        </SocketProvider>
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
