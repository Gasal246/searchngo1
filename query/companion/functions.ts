import { formatBearerToken } from "../../lib/utils";
import { axiosInstance } from "../axios/instance";

export async function addCompanionRecord (formData: any, token: string) {
    try {
        const res = await axiosInstance.post('/users/add-companion', formData, {
            headers: {
                Authorization: formatBearerToken(token)
            }
        });
        return res.data;
    } catch (error: any) {
        console.log(error);
    }
}