import axios from "axios";
import { axiosInstance } from "../axios/instance";

export async function sendMobileOtp (formData: any) {
    try {
        const res = await axiosInstance.post(`/users/send-otp`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function sendEmailOtp (formData: any) {
    try {
        const res = await axiosInstance.post(`/users/send-email-otp`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function verfifyOtp (formData: any) {
    try {
        const res = await axiosInstance.post(`/users/otp-verification`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

