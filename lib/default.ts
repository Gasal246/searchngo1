import {Dimensions, Platform} from 'react-native';
import ConstantsHelper from '../helpers/ConstantsHelpers';
import axios from 'axios';
import UrlHelper from '../Helpers/UrlHelper';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions, StackActions} from '@react-navigation/native';
import {AppDispatch, RootStateValues, store} from '../store';
import {AnyAction, ThunkDispatch} from '@reduxjs/toolkit';
import {navigationRef} from './RootNavigation';
import {reset} from '../Pages/Verification/store/verificationSlice';
import i18n from './i18n';
import moment from 'moment';
import {logApiResponse, resetLogs} from '../Pages/store/logsSlice';

let token: any = '';

export const storeLocalData = async (fieldname: any, fieldvalue: any) => {
  return await AsyncStorage.setItem(fieldname, fieldvalue);
};

export const getLocalData = async (fieldname: string) => {
  return await AsyncStorage.getItem(fieldname);
};
export const clearLocalData = async () => {
  return await AsyncStorage.clear();
};
export const checkOutOfLocation = async (
  userClientId: string,
  locationCampId: string,
) => {
  let userLocal: any = await getLocalData('userData');
  let userObj = JSON.parse(userLocal);
  if (userObj?.baseCampAvailable === false) {
    return ConstantsHelper.baseCampFlag;
  }

  if (userClientId !== 'undefined') {
    if (
      userClientId === locationCampId &&
      userObj?.baseCampAvailable === true
    ) {
      return true;
    } else if (locationCampId === '0') {
      return ConstantsHelper.outOfServiceFlag;
    } else {
      if (userObj?.baseCampAvailable === false) {
        return ConstantsHelper.baseCampFlag;
      } else if (userClientId !== locationCampId) {
        return ConstantsHelper.anotherServiceFlag;
      } else {
        return ConstantsHelper.outOfServiceFlag;
      }
    }
  } else {
    return ConstantsHelper.outOfServiceFlag;
  }
};

export const getServiceErrorMessage = (title: string) => {
  if (title == ConstantsHelper.baseCampFlag) {
    return i18n.t('set-base-camp-title');
  } else if (title == ConstantsHelper.outOfServiceFlag) {
    return i18n.t('out-of-service-title');
  } else if (title == ConstantsHelper.anotherServiceFlag) {
    return i18n.t('under-another-service-title');
  } else {
    return '';
  }
};

export const updateBaseCampAvailable = async (baseCampAvailable: boolean) => {
  let userLocal: any = await getLocalData('userData');
  let userObj = JSON.parse(userLocal);
  userObj.baseCampAvailable = baseCampAvailable;
  storeLocalData('userData', JSON.stringify(userObj));
};

export const setAuthToken = async (token: any) => {
  global.token = token;
  token = token;
};

export const getAuthToken = () => {
  return 'Bearer ' + (global?.token ? global?.token : token);
};

export const setIpAddress = async (ipAddress: string) => {
  global.ipAddress = ipAddress;
};

export const getIpAddress = () => {
  return global.ipAddress;
};

export const isLogin = () => {
  return global?.isLogin;
};

const axiosInstance = axios.create({
  baseURL: UrlHelper.currentApiUrl + UrlHelper.prefix,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (  response: any) => response,
    (  error: { response: { config: { data: any; params: any; }; request: { _url: any; }; data: any; }; }) => {
    // console.log('error::', error.response);
    const request = error.response?.config?.data
      ? error.response?.config?.data
      : error.response?.config?.params
      ? error.response?.config?.params
      : '';
    let errorData = {
      url: error.response?.request?._url,
      response: error?.response?.data,
      requestPayload: request,
    };
    store.dispatch(logApiResponse(errorData));

    return Promise.reject(error);
  },
);

export default axiosInstance;

export const logoutApp = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction> | AppDispatch,
) => {
  clearLocalData();
  let store = RootStateValues.root;
  let storeKeys = Object.keys(store);
  dispatch(reset());
  dispatch(resetLogs());
  storeKeys.map(item => dispatch({type: `${item}/reset`}));

  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'UserVerification'}],
    }),
  );
};
type ParamType = {[k: string]: string};

export const customNavigate = (pageName: string, params: ParamType = {}) => {
  const pushAction = StackActions.push(pageName, params);
  navigationRef.dispatch(pushAction);
};

export const uuidFormat = (value: any) => {
  return (
    value &&
    [...value]
      .map((d, i) => (i % 4 == 0 ? ' ' + d : d))
      .join('')
      .trim()
  );
};

export const dateMoment = (data: string) => {
  return moment(data).format('MMM DD, YYYY');
};

export const getCurrentStatus = (statusCode: number) => {
  if (statusCode == 1) {
    return 'Active';
  } else if (statusCode == 2) {
    return 'Expired';
  } else if (statusCode == 3) {
    return 'Upcoming';
  } else {
    return '';
  }
};

export const screenHeight = Dimensions.get('window').height;

export const screenWidth = Dimensions.get('window').width;

let previousMessage = '';
export const showSnackbar = (
  message: any,
  type: any = ColorsHelper.infocolor,
) => {
  if (!message) {
    return;
  }

  if (message === previousMessage) {
    return;
  }
  previousMessage = message;
  var backcolor = ColorsHelper.infocolor;
  if (type == ConstantsHelper.alertInfoTitle) {
    backcolor = ColorsHelper.infocolor;
  } else if (type == ConstantsHelper.alertWarningTitle) {
    backcolor = ColorsHelper.warningcolor;
  } else if (type == ConstantsHelper.alertErrortitle) {
    backcolor = ColorsHelper.errorcolor;
  } else if (type == ConstantsHelper.alertSuccessTitle) {
    backcolor = ColorsHelper.successcolor;
  }

  var msg = message.split(',').join('\n');
  setTimeout(
    () => {
      Snackbar.show({
        text: '' + msg,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: backcolor,
        textColor: ColorsHelper.whiteClr,
      });
    },
    Platform.OS == 'ios' ? 50 : 200,
  );
  setTimeout(() => {
    previousMessage = '';
  }, 5000);
};

export const gradientColorChoice1 = [
  ColorsHelper.gradientColor1,
  ColorsHelper.gradientColor2,
  ColorsHelper.gradientColor3,
];
export const gradientColorChoice2 = [
  ColorsHelper.gradientColor4,
  ColorsHelper.gradientColor5,
  ColorsHelper.gradientColor6,
];

export const gradientColorChoice3 = [
  ColorsHelper.btnColor1,
  ColorsHelper.btnColor2,
];

export const convertIsoToUnixMinutes = (
  isoDateString: string | number | Date,
) => {
  const unixSeconds = moment(isoDateString).unix();
  return unixSeconds;
};

export const wifiConnectBtnBgColor = (name: string) => {
  if (name === 'outOfService') {
    return gradientColorChoice2;
  } else if (name === 'connectToWifi') {
    return [ColorsHelper.infocolor, ColorsHelper.infocolor];
  } else if (name === 'connectionFailed') {
    return [ColorsHelper.errorcolor, ColorsHelper.errorcolor];
  } else if (name === 'wifiConnected') {
    return gradientColorChoice1;
  } else if (name === 'wifiNotConnected') {
    return gradientColorChoice2;
  } else {
    return gradientColorChoice2;
  }
};

export const wifiConnectBtnTitle = (name: string) => {
  if (name === 'outOfService') {
    return 'Out of Service Area';
  } else if (name === 'connectToWifi') {
    return 'Activate';
  } else if (name === 'connectionFailed') {
    return 'Activation Failed';
  } else if (name === 'wifiConnected') {
    return 'Membership Activated';
  } else if (name === 'wifiNotConnected') {
    return 'Wifi not Connected';
  } else {
    return 'Wifi Connect';
  }
};
