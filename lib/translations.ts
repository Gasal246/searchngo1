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
    service_at_your_finger_tips?: string;
    service_wallet?: string;
    service_water_plus?: string;
    service_mess_mate?: string;
    service_smart_wash?: string;
    service_ex_rate?: string;
    service_best_offers?: string;
    service_big_win?: string;
    service_help_desk?: string;
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
    // other
    current_membership: string;
    membership_expire_on: string;
    retake: string;
    useit: string;
    processing: string;
    show_your_face: string;
    need_cam_permission: string;
    dashboard: string;
    membership: string;
    connect_to_membership: string;
    available_membership: string;
    membership_history: string;
    user: string;
    user_profile: string;
    lang_settings: string;
    change_mob_number: string;
    change_service_location: string;
    application: string;
    logs: string;
    change_pin: string;
    sign_out: string;
    //service_page
    services_title: string;
    deals_title: string;
    uuid_qr_title: string;
    // membership history 
    complimentary_internet: string;
    validity: string;
    availible_services: string;
    start_on: string;
    expire_on: string;
    time_left: string;
    upcoming_membership: string;
    view: string;
    membership_charge: string;
    transactions: string;
    balance: string;
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
