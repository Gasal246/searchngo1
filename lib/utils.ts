import { PermissionsAndroid, Platform } from "react-native";

// fucntion to split any string to given number of parts --gasal
export function splitString(value: string, num: number): string {
    const result = [];
    for (let i = 0; i < value?.length; i += num) {
        result?.push(value?.slice(i, i + num))
    }
    return result?.join(' ')
}

// function to format Beared token to pass through header --gasal
export const formatBearerToken = (token: string) => {
    return 'Bearer'+ " " + token;
}

export const requestLocationPermission = async () => {
    try {
        if (Platform.OS === 'android') {
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
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // iOS or other platforms where permission is not required
    } catch (err) {
        console.warn(err);
        return false;
    }
};
