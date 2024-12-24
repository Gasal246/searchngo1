import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchLocation } from "../../query/networkqueries/functions";

interface NetworkDataState {
    ssid: string;
    location_info: any;
}

const initialState: NetworkDataState = {
    ssid: '',
    location_info: null
}

const networkDataState = createSlice({
    name: 'networkData',
    initialState,
    reducers: {
        storeSSID: (state, action: PayloadAction<string>) => {
            state.ssid = action.payload
        },
        storeLocationInfo: (state, action: PayloadAction<any>) => {
            state.location_info = action.payload
        }
    },
    extraReducers: (builder) => { 
        builder.addCase(fetchLocationData.fulfilled, (state, action) => { 
            state.location_info = action.payload;
        });
    }
})

export const fetchLocationData = createAsyncThunk(
    'networkData/fetchLocationData', 
    async (ssid: string) => {
        const response = await fetchLocation(ssid);
        console.log(response);
        return response;
    }
);

export const { storeLocationInfo, storeSSID } = networkDataState.actions;
export default networkDataState.reducer;
