import axios from "axios";
import { formatBearerToken } from "../../lib/utils";

export async function fetchLocation(ssid: string) {
    try {
        const ssplit = ssid?.toUpperCase().split('_');
        // console.log("SSID passed: ", ssid)
        if (ssplit[0] != 'SG') return { outside: true };
        if(ssplit[ssplit.length - 1] == "AL") {
            const res = await fetch('https://gateway.searchngo.app/www/pub/login/user_info/?op=device_info', {
                method: 'GET',
                redirect: 'follow' // Ensures redirects are followed
              });
            return res.json();
        } else if (ssplit[ssplit.length - 1] == "TX") {
            console.log("####### ___YOU HAVEN'T SETUPED A TX LOCATION API___ #######")
        } else {
            throw new Error(`GIVEN SSID (${ssid?.toUpperCase()}) IS NOT FUNCIONAL`)
        }
        // let url = ''
        // switch (ssplit[ssplit?.length - 1]) {
        //     case 'AL': {
        //         url = 'http://gateway.searchngo.app/www/pub/login/user_info/?op=device_info';
        //         break;
        //     }
        //     case 'TX': {
        //         console.log("####### ___YOU HAVEN'T SETUPED A TX LOCATION API___ #######")
        //         break;
        //     }
        //     default: {
        //         throw new Error(`GIVEN SSID (${ssid?.toUpperCase()}) IS NOT FUNCIONAL`)
        //     }
        // }
        // const res = await axios.get(url);
        // return res.data;
    } catch (error) {
        console.log(error);
    }
}

const loginConnectApi = 'http://gateway.searchngo.app/www/pub/login/connect/';

export async function connectInternetFunction(formData: object, token: string) {
    try {
        const res = await axios.post(loginConnectApi, formData, {
            headers: {
                Authorization: formatBearerToken(token),
                'Content-Type': 'multipart/form-data',
            },
        })
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
