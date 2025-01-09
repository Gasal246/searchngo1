import { formatBearerToken } from "../../lib/utils";
import { axiosInstance } from "../axios/instance";

type order_status = '0' | '1' | '2' | '3'

export async function getUserMembershipDetails ( token: string, status?: order_status ) {
    try {
        const res = await axiosInstance.get(`/users/internet-package/order${status ? '?order_status='+status : ''}`, {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function purchaseNewMembership ( payload: any, token: string ) {
    try {
        const res = await axiosInstance.post(`/users/internet-package/place-order`, payload, {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

