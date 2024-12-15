import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../querykeys";
import { sendEmailOtp, sendMobileOtp, verfifyOtp } from "./functions";

interface MobileOtpForm {
    mobile: number;
    country_code: number;
    device_mac_id: string;
}

interface VerfiyOtpData {
    otp: number;
    mobile: number;
    device_mac_id: string;
    country_code: number;
    camp_id?: string | null;
}

export const useSendMobileOtp = () => {
    return useMutation({
        mutationFn: async (formData: MobileOtpForm) => sendMobileOtp(formData)
    })
}

export const useSendEmailOtp = () => {
    return useMutation({
        mutationFn: async (formData: any) => sendEmailOtp(formData)
    })
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: async (formData: VerfiyOtpData) => verfifyOtp(formData)
    })
}

