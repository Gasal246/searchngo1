import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadLanguage } from '../../redux/slices/languageSlice';
import { loadAuthentication, loadToken, loadUserData } from '../../redux/slices/appAuthenticationSlice';

const LanguageLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadPersistedLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('user_language');
      if (savedLanguage) {
        dispatch(loadLanguage(savedLanguage));
      }
    };
    const loadAuthState = async () => {
      const response = await AsyncStorage.getItem('verification');
      if(response){
        const data = JSON.parse(response)
        dispatch(loadUserData(JSON.stringify(data.user_data)));
        dispatch(loadToken(data.token));
        dispatch(loadAuthentication(true))
      }
    }
    loadPersistedLanguage();
    loadAuthState();
  }, [dispatch]);

  return null; // This component doesn't need to return UI
};

export default LanguageLoader;
