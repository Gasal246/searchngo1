import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getWalletDetails } from "../../query/wallet/functions";

interface AuthenticationState {
    token: string | null;
    user_data: any | null;
    isAuthenticated?: boolean;
    wallet_info: any | null;
}

const initialState: AuthenticationState = {
    token: null,
    user_data: null,
    isAuthenticated: false,
    wallet_info: null
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
        },
        loadToken: (state, action:PayloadAction<string>) => {
            state.token = action.payload;
        },
        loadLogoutApp: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user_data = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserWallet.fulfilled, (state, action: PayloadAction<any>) => {
            state.wallet_info = action.payload;
        })
    },
})

// Async Actions

export const fetchUserWallet = createAsyncThunk(
    'authentication/fetchUserWallet',
    async (token: string) => {
        const response = await getWalletDetails(token);
        return response.data;
    }
)

export const { loadAuthentication, loadUserData, loadToken, loadLogoutApp } = authenticationSlice.actions;
export default authenticationSlice.reducer;

