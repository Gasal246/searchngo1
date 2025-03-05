import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestState {
    isGuest: boolean;
}

const initialState: GuestState = {
    isGuest: false,
}

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        loadIsGuest: (state, action: PayloadAction<boolean>) => {
            state.isGuest = action.payload;
        },
    },
})

export const { loadIsGuest } = guestSlice.actions;
export default guestSlice.reducer;