import axios from "axios";
import { formatBearerToken } from "../../lib/utils";
import { axiosInstance, axiosInstanceOnImageUpload } from "../axios/instance";
import { apiPrefix, currentApi } from "../../lib/constants/constatntUrls";
// import FormData from "form-data";

export async function initialUpdateProfile(formData: FormData, token: string) {
    try {
        const data: any = {};
        data['name'] = formData.get('name');
        data['photo'] = formData.get('photo');
        console.log(data)
        const res = await axios.post(currentApi + apiPrefix + `/users/update-profile`, formData, {
            headers: {
                Authorization: formatBearerToken(token),
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateExpoPushToken(formData: { expo_push_token: string }, token: string ) {
    try {
        const res = await axiosInstance.post(`/users/update-expo-push-token`, formData, {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateMobileNumber(formData: { mobile: number, country_code: number }, token: string) {
    try {
        const res = await axiosInstance.post(`/users/change-mobile`, formData, {
            headers: {
                Authorization: formatBearerToken(token),
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function sendMobileChangeOTP(formData: { mobile: number, country_code: number }, token: string) {
    try {
        const res = await axiosInstance.post(`/users/verify-change-number`, formData, {
            headers: {
                Authorization: formatBearerToken(token),
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
