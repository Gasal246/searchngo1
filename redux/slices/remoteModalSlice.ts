import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RemoteModalState {
    connectionModal: boolean;
    loadingModal: boolean;
    qrModal: boolean;
    changeBaseCampModal: boolean;
}

const initialState: RemoteModalState = {
    connectionModal: false,
    loadingModal: false,
    qrModal: false,
    changeBaseCampModal: false,
}

const remoteModalSlice = createSlice({
    name: 'remoteModals',
    initialState,
    reducers: {
        loadConnectionModal: (state, action: PayloadAction<boolean>) => {
            state.connectionModal = action.payload;
        },
        loadLoadingModal: (state, action: PayloadAction<boolean>) => {
            state.loadingModal = action.payload;
        },
        loadQRModal: (state, action: PayloadAction<boolean>) => {
            state.qrModal = action.payload;
        },
        loadChangeBaseCampModal: (state, action: PayloadAction<boolean>) => {
            state.changeBaseCampModal = action.payload;
            console.log("Dispatched ", action.payload)
        },
    }
})

export const { loadConnectionModal, loadLoadingModal, loadQRModal, loadChangeBaseCampModal } = remoteModalSlice.actions;
export default remoteModalSlice.reducer;

