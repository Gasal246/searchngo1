let liveUrl = '';
// let demoUrl = 'http://5.161.235.50:3019/';
let demoUrl = 'https://api.searchngo.app/';

let isProduction = false;

const UrlHelper = {
  currentApiUrl: isProduction ? liveUrl : demoUrl,
  prefix: 'api/',

  // Camp locations apis
  getCampIdByLocationApi: 'camp/get-by-location',
  assignUserCampApi: 'users/camps/assign-user-camp',
  campInternetPackageApi: 'users/camps/packages/internet',
  campByIdApi: 'users/camps/',
  getBaseCampApi: 'users/camps/get-base-camp',
  changeBaseCampApi: 'users/camps/change-user-camp',
  getClientWiseCamp: 'users/camps/get-client-wise-camp',
  validateCampApi: 'users/validate-camp',
  loginConnectApi: 'http://gateway.searchngo.app/www/pub/login/connect/',

  // user varification apis
  otpSendApi: 'users/send-otp',
  otpVerificationApi: 'users/otp-verification',
  updateMobileNumber: 'users/update-mobile-number',
  optVerificationNewNumber: 'users/otp-verification-new-number',

  // profile apis
  profileUpdateApi: 'users/profile-update',
  profileGetApi: 'users/profile',
  countryGetApi: 'users/country',
  nationalityId: 'users/national-type',

  // recharge apis
  rechargeHistoryGetApi: 'users/recharge-history',
  internetPackageOrderGetApi: 'users/internet-package/order',
  internetPackagePlaceOrderApi: 'users/internet-package/place-order',
  internetPackageManualActiveApi: 'users/internet-package/manual-active',
  internetPackageOrderByUserApi: 'pos/internet-package/order-by-user',

  //get camp apis
  // getCampApi: 'https://websorbz.pro/testapi.php',
  getCampApi:
    'http://gateway.searchngo.app/www/pub/login/user_info/?op=device_info',
};
export default UrlHelper;
