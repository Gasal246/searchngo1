import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserAppState {
    companionQrData: any;
    selectedCompanion: any;
}

const initialState: UserAppState = {
    companionQrData: null,
    selectedCompanion: null,
}

const userAppState = createSlice({
    name: 'userapp',
    initialState,
    reducers: {
        storeCompanionQrData: (state, action: PayloadAction<any>) => {
            state.companionQrData = action.payload;
        },
        storeSelectedCompanion: (state, action: PayloadAction<any>) => {
            state.selectedCompanion = action.payload;
        }
    }
});

export const { storeCompanionQrData } = userAppState.actions;
export default userAppState.reducer;
