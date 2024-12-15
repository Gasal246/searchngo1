import axios from "axios";
import { apiPrefix, currentApi } from "../../lib/constants/constatntUrls";

export const axiosInstance = axios.create({
    baseURL: currentApi + apiPrefix,
    headers: {
        'Content-Type': 'application/json',
    },
});