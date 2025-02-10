import AsyncStorage from "@react-native-async-storage/async-storage"

export const getVerifiedData = async () => {
    try {
        const response = await AsyncStorage.getItem('user_data');
        console.log("Current User Data: ", response)
        return response ? JSON.parse(response) : null;
    } catch (error) {
        console.log(error)
    }
}

