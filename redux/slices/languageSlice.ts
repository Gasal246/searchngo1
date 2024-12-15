import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  language: 'english',
};

// Create a slice
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      AsyncStorage.setItem('user_language', action.payload);
    },
    loadLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});
export const { setLanguage, loadLanguage } = languageSlice.actions;

export default languageSlice.reducer;
