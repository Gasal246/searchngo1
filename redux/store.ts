import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import verificationReducer from './slices/verificationSlice';
import authenticationReducer from './slices/appAuthenticationSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    verification: verificationReducer,
    authentication: authenticationReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

