import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LogDataState {
    logger: { [key: string]: any }[];
}

const initialState: LogDataState = {
    logger: []
}

const logDataState = createSlice({
    name: 'logs',
    initialState,
    reducers: {
        storeLog: (state, action: PayloadAction<{ key: string; value: any }>) => {
            state.logger.push({
                [action.payload.key]: action.payload.value
            });
        }
    }
})

export const { storeLog } = logDataState.actions;
export default logDataState.reducer;
