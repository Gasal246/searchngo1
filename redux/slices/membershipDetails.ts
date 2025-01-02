import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserMembershipDetails } from "../../query/membership/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MembershipDataState {
    currentMemebership: any;
    expiredMembership: any;
    upcomingMembership: any;
}

const initialState: MembershipDataState = {
    currentMemebership: null,
    expiredMembership: null,
    upcomingMembership: null
}

const membershipDataState = createSlice({
    name: 'membership',
    initialState,
    reducers: {
        clearAll: (state) => {
            state.currentMemebership = null;
            state.upcomingMembership = null;
            state.expiredMembership = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserCurrentMembership.fulfilled, (state, action) => {
            state.currentMemebership = action.payload;
        })
    }
})

export const fetchUserCurrentMembership = createAsyncThunk(
    'membership/fetchUserCurrentMembership',
    async (token: string) => {
        const response = await getUserMembershipDetails(token, '1');
        console.log("Membership Data Fetched");
        await AsyncStorage.setItem('current_membership', JSON.stringify(response?.data?.list[0]))
        return response?.data?.list[0];
    }
)

export const {} = membershipDataState.actions;
export default membershipDataState.reducer;
