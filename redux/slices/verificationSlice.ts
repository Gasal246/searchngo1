import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface verificationState {
    mobile: number | null;
    country_code: number | null;
    device_mac_id: string | null;
    camp_id: number | null;
}

const initialState: verificationState = {
  mobile: null,
  country_code: null,
  device_mac_id: null,
  camp_id: null
};

// Create a slice
const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setVerificationState: (state, action: PayloadAction<verificationState>) => {
      state.camp_id = action.payload.camp_id
      state.country_code = action.payload.country_code
      state.device_mac_id = action.payload.device_mac_id
      state.mobile = action.payload.mobile
    },
  },
});
export const { setVerificationState } = verificationSlice.actions;

export default verificationSlice.reducer;
