import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  language: 'english',
  orientation: 'left'
};

// Create a slice
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      if (action.payload === 'urdu' || action.payload === 'arabic') {
        state.orientation = 'right'
      } else {
        state.orientation = 'left'
      }
      AsyncStorage.setItem('user_language', action.payload);
    },
    loadLanguage: (state, action) => {
      state.language = action.payload;
      if (action.payload === 'urdu' || action.payload === 'arabic') {
        state.orientation = 'right'
      } else {
        state.orientation = 'left'
      }
    },
  },
});

export const { setLanguage, loadLanguage } = languageSlice.actions;

export default languageSlice.reducer;
