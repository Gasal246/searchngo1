import axios from "axios";

export async function fetchLocation (ssid: string) {
    try {
        const ssplit = ssid?.toUpperCase().split('_');
        // console.log("SSID passed: ", ssid)
        if(ssplit[0] != 'SG') return { outside: true }; 
        let url = ''
        switch(ssplit[ssplit?.length - 1]){
            case 'AL': {
                url = 'http://gateway.searchngo.app/www/pub/login/user_info/?op=device_info';
                // console.log('fetching SG location Api')
                break;
            }
            case 'TX': {
                console.log("####### ___YOU HAVEN'T SETUPED A TX LOCATION API___ #######")
                break;
            }
            default: {
                throw new Error(`GIVEN SSID (${ssid?.toUpperCase()}) IS NOT FUNCIONAL`)
            }
        }
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

