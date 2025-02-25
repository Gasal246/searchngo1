import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { translations } from '../../lib/translations';
import RootLayout from '../layouts/RootLayout';
import { RootState } from '../../redux/store';
import { splitString } from '../../lib/utils';
import { profilePrefix } from '../../lib/constants/constatntUrls';
import { Image } from 'expo-image';

const ProfileScreen = () => {
    const { user_data: userData } = useSelector((state: RootState) => state.authentication);

    return (
        <RootLayout>
            <ScrollView style={styles.page_view}>
                
            </ScrollView>
        </RootLayout>
    );
}

const styles = StyleSheet.create({
    page_view: {
        paddingHorizontal: 10,
        paddingTop: 70,
        flex: 1,
        backgroundColor: '#003f43',
        borderColor: 'red',
        borderWidth: 1
    },
})

export default ProfileScreen;
