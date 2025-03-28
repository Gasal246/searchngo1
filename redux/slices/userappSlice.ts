import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserAppState {
    companionQrData: any;
}

const initialState: UserAppState = {
    companionQrData: null
}

const userAppState = createSlice({
    name: 'userapp',
    initialState,
    reducers: {
        storeCompanionQrData: (state, action: PayloadAction<any>) => {
            state.companionQrData = action.payload;
        }
    }
});

export const { storeCompanionQrData } = userAppState.actions;
export default userAppState.reducer;
