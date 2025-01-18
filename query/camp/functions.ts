import { axiosInstance } from "../axios/instance";
import { formatBearerToken } from "../../lib/utils";

export async function getUserCampInternetPackages(token: string) {
    try {
        const res = await axiosInstance.get(`/users/camps/packages/internet`, {
            headers: { Authorization: formatBearerToken(token) }
        });
        return res?.data ?? { status: 'failed' };
    } catch (error) {
        console.log(error);
    }
}

export async function validateCampApiFunction ( camp_id: string, client_mac: string, token: string ) {
    try {
        const res = await axiosInstance.post(`/users/validate-camp`, { camp_id: camp_id, client_mac_id: client_mac }, {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res?.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getCampByCampId ( campId: string, token: string ) {
    try {
        const res = await axiosInstance.get(`/users/camps/${campId}`, {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

