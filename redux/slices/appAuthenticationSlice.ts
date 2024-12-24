import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthenticationState {
    token: string | null;
    user_data: any | null;
    isAuthenticated?: boolean;
}

const initialState: AuthenticationState = {
    token: null,
    user_data: null,
    isAuthenticated: false
}

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        loadAuthentication: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        loadUserData: (state, action: PayloadAction<string>) => {
            state.user_data = JSON.parse(action.payload);
            AsyncStorage.setItem('user_data', action.payload);
        },
        loadToken: (state, action:PayloadAction<string>) => {
            state.token = action.payload;
            AsyncStorage.setItem('user_token', action.payload)
        },
        loadLogoutApp: (state) => {
            state.isAuthenticated = false
            state.token = null
            state.user_data = null
        }
    }
})

export const { loadAuthentication, loadUserData, loadToken, loadLogoutApp } = authenticationSlice.actions;
export default authenticationSlice.reducer;

