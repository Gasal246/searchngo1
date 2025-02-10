import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Alert, PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';

export default function ResponseTest() {
  const [ssid, setSsid] = useState('Loading...');
  const [resLoading, setResLoading] = useState(false);
  const [response1, setResponse1] = useState('');
  const [response1Https, setResponse1Https] = useState('');
  const [response2, setResponse2] = useState('');
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [url1, setUrl1] = useState('http://10.45.45.2/www/pub/login/db/get_user_data.php?ip=10.45.0.248');
  const [url1https, setUrl1Https] = useState('https://gateway.searchngo.app/www/pub/login/user_info/index.php?op=device_info');
  const [url2, setUrl2] = useState('https://api.searchngo.app/');

  const fetchResponse = async () => {
    setResLoading(true)
    try {
      let data1 = '';
      let data1https = '';
      let data2 = '';
      const res1 = await axios.get("http://gateway.searchngo.app/www/pub/login/user_info/?op=device_info", {
        headers: {
          'Host': 'gateway.searchngo.app'
        }
      });
      if (res1.data) {
        data1 = JSON.stringify(res1.data);
      } else {
        data1 = 'No Response'
      }
      setResponse1(data1);

      const res2 = await axios.get(url2);
      if (res2?.data) {
        data2 = JSON.stringify(res2.data);
      } else {
        data2 = 'No Response'
      }
      setResponse2(data2);

      const res1https = await axios.get(url1https);
      if(res1https?.data) {
        data1https = JSON.stringify(res1https.data)
      } else {
        data1https = 'No Response'
      }
      setResponse1Https(data1https)
    } catch (error: any) {
      console.log(JSON.stringify(error));
      setResponse1("Error Fetching Response: " + JSON.stringify(error))
    } finally {
      setResLoading(false);
    }
  }

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (alreadyGranted) {
          return true; // Permission is already granted
        }

        // Request permission if not already granted
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "We need access to your location to fetch Wi-Fi SSID.",
            buttonNeutral: "Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    const unsubscribe = NetInfo.addEventListener(async () => {
        const wifiState: any = await NetInfo.fetch('wifi');
        const ssId = wifiState?.details?.ssid?.toUpperCase();
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          setSsid('Permission denied');
          return;
        }

        setSsid(ssId || 'No SSID found');
    });

    return () => {
        unsubscribe();
    };
  
    // const getSsid = async () => {
    //   try {
    //     const hasPermission = await requestLocationPermission();
    //     if (!hasPermission) {
    //       setSsid('Permission denied');
    //       return;
    //     }
        
    //     const id = await NetworkInfo.getSSID();
    //     setSsid(id || 'No SSID found');
    //   } catch (error) {
    //     setSsid(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    //   }
    // };
  
    // getSsid();
  }, []);
  
  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <TouchableOpacity style={styles.button} onPress={fetchResponse}>
        <Text style={styles.buttonText}>SHOW CURRENT RESPONSE</Text>
      </TouchableOpacity>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Current SSID:</Text>
        <Text style={styles.ssidText}>{ssid}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {response1 && <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
          <Text style={styles.responseLabel}>URL:</Text>
          <Text style={styles.urlLabel}>{url1}</Text>
        </View>}
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          {response1 && <Text style={styles.responseTitle}>RESPONSE</Text>}
          {resLoading ? <Text style={{ color: '#00bfff', fontSize: 14 }}>Loading...</Text> :
            <Text style={styles.responseText}>{response1 || 'Click the button to fetch Response'}</Text>
          }
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
          {response1 && <Text style={styles.responseTitle}>HTTPS RESPONSE</Text>}
          {resLoading ? <Text style={{ color: '#00bfff', fontSize: 14 }}>Loading...</Text> :
            <Text style={styles.responseText}>{response1Https || 'Click the button to fetch Response'}</Text>
          }
        </View>
        {response2 && <View style={{ paddingVertical: 14 }}>
          <View style={{ borderStyle: 'dashed', borderWidth: 1.3, borderTopColor: '#04697a', padding: 0 }}></View>
        </View>}
        {response2 && <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
          <Text style={styles.responseLabel}>URL:</Text>
          <Text style={styles.urlLabel}>{url2}</Text>
        </View>}
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          {response1 && <Text style={styles.responseTitle}>RESPONSE</Text>}
          {response1 && <Text style={styles.responseText}>{response2}</Text>}
        </View>
      </ScrollView>
      <View style={{ borderColor: '#04697a', borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 6, width: '100%', marginTop: 10, padding: 10 }}>
        <Text style={{ color: '#04697a', fontWeight: '700' }}>Server Response:</Text>
        <Text style={{ color: '#04697a' }}>http://5.161.235.50:3019</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'cyan',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: '800',
  },
  infoBox: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#04697a',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00ad8e',
  },
  ssidText: {
    fontSize: 16,
    color: '#02d1ab',
  },
  scrollView: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#04697a',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    height: 420,

  },
  responseLabel: {
    fontSize: 13,
    color: '#db8760',
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0059b3',
  },
  responseText: {
    fontSize: 16,
    color: '#fab669',
  },
  responseTitle: {
    fontSize: 12,
    color: '#009933',
  },
});
