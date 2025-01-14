import { formatBearerToken } from "../../lib/utils";
import { axiosInstance } from "../axios/instance";

export async function getWalletDetails (token: string) {
    try {
        const res = await axiosInstance.get('/users/wallet', {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getWalletTransactions (token: string, walletId: string, count?: number) {
    try {
        const res = await axiosInstance.get(`/users/wallet-transactions/${walletId+''}${count ? `?show_count=${count}` : ''}`, {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

