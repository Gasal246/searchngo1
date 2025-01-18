import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchLocation } from "../../query/networkqueries/functions";

interface NetworkDataState {
    ssid: string;
    location_info: any;
    loginConnectData: any;
}

const initialState: NetworkDataState = {
    ssid: '',
    location_info: null,
    loginConnectData: null
}

const networkDataState = createSlice({
    name: 'networkData',
    initialState,
    reducers: {
        storeSSID: (state, action: PayloadAction<string>) => {
            state.ssid = action.payload;
        },
        storeLocationInfo: (state, action: PayloadAction<any>) => {
            state.location_info = action.payload;
        },
        loadLoginConnectData: (state, action: PayloadAction<any> ) => {
            state.loginConnectData = action.payload;
        } 
    },
    extraReducers: (builder) => { 
        builder.addCase(fetchLocationData.fulfilled, (state, action) => {
            // console.log(action.payload);
            state.location_info = action.payload;
        });
    }
})

export const fetchLocationData = createAsyncThunk(
    'networkData/fetchLocationData', 
    async (ssid: string) => {
        const response = await fetchLocation(ssid);
        return response;
    }
);

export const { storeLocationInfo, storeSSID, loadLoginConnectData } = networkDataState.actions;
export default networkDataState.reducer;
