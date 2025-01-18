import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCampByCampId } from "../../query/camp/functions";

interface CampDataState {
    locationCampData: any;
}

const initialState: CampDataState = {
    locationCampData: null
}

const campDataState = createSlice({
    name: 'camp',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCampDetailsByCampId.fulfilled, (state, action: PayloadAction<any>) => {
            state.locationCampData = action.payload;
        })
    }
})

export const fetchCampDetailsByCampId = createAsyncThunk(
    'camp/fetchCampDetailsByCampId',
    async ({ campId, token }: { campId: string, token: string }) => {
        const response = await getCampByCampId(campId, token);
        return response?.data?.list ?? null;
    }
)

export const {} = campDataState.actions;
export default campDataState.reducer;
