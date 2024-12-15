import { arabic } from "./translations/arabic";
import { bengali } from "./translations/bengali";
import { english } from "./translations/english";
import { hindi } from "./translations/hindi";
import { malayalam } from "./translations/malayalam";
import { tamil } from "./translations/tamil";
import { telugu } from "./translations/telugu";
import { urdu } from "./translations/urdu";

type TranslationProps = Record<string, {
    // language page
    choose_lang: string,
    choose_lang_desc: string,
    choose_lang_submit: string,
    // signin page
    mobile_v_phone_title: string;
    mobile_v_email_title: string;
    mobile_v_desc: string;
    mobile_v_desc_email: string;
    mobile_v_phone: string;
    mobile_v_email: string;
    mobile_v_placeholder_phone: string;
    mobile_v_placeholder_email: string;
    mobile_v_submit: string;
    mobile_v_phone_error1: string;
    mobile_v_phone_error2: string;
    mobile_v_phone_c_code_err: string;
    mobile_v_country_code: string;
    mobile_v_length_error: string;
    mobile_v_otp_send: string;
    mobile_v_check_message: string;
    // otp page
    otp_title: string;
    otp_desc: string;
    verify_otp: string;
    // updateprofile page
    update_pf_id: string;
    update_pf_name: string;
    update_pf_country: string;
    update_pf_submit: string;
    // home page
    home_title: string;
    home_premium_tag: string;
    home_sub_date: string;
    home_connectivity: string;
    home_conn_desc: string;
    home_site_title: string;
    home_site_info: string;
    home_skip: string;
    home_submit: string;
    // service page
    service_food?: string;
    service_goccery?: string;
    service_water?: string;
    service_laundry?: string;
    service_restaurant?: string;
    service_clean?: string;
    service_devices?: string;
    service_jobs?: string;
    service_win?: string;
    service_rate?: string;
    service_files?: string;
    service_weather?: string;
    // profile page
    pf_yourid: string;
    pf_membership: string;
    pf_wallet: string;
    pf_nationality: string;
    pf_contact: string;
    pf_blood: string;
    // wallet page
    wallet_history_title: string;
    wallet_history: string;
    wallet_fund_add: string;
    wallet_fund_used: string;
    wallet_add_fund: string;
}>

export const translations: TranslationProps = {
    english: {...english},
    hindi: {...hindi},
    arabic: {...arabic},
    malayalam: {...malayalam},
    tamil: {...tamil},
    urdu: {...urdu},
    bengali: {...bengali},
    telugu: {...telugu}
};
