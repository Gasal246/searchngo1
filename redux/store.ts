import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import verificationReducer from './slices/verificationSlice';
import authenticationReducer from './slices/appAuthenticationSlice';
import remoteModalReducer from './slices/remoteModalSlice';
import networkDataReducer from './slices/NetworkSlice';
import membershipDataReducer from './slices/membershipDetails';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    verification: verificationReducer,
    authentication: authenticationReducer,
    remoteModals: remoteModalReducer,
    networkData: networkDataReducer,
    membership: membershipDataReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

