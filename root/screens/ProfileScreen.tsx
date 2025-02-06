import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
            <View style={styles.page_view}>
                <View style={styles.box_view}>
                    <View style={styles.profile_image_container}>
                        <Image source={{ uri: `${profilePrefix(userData?.id)}?${userData?.updatedAt}` }} style={styles.profile_image} />
                    </View>
                    <TouchableOpacity style={styles.edit_view}>
                        <AntDesign name="edit" size={16} color='#4BCD9C' />
                        <Text style={styles.text_edit_profile}>Edit Profile</Text>
                    </TouchableOpacity>
                    <Text style={styles.text_one}>{userData?.name}</Text>
                    <View style={styles.field_view}>
                        <Text style={styles.field_key}>UUID:</Text>
                        <Text style={styles.field_value}>{splitString(userData?.uuid, 4)}</Text>
                    </View>
                    <View style={styles.field_view}>
                        <Text style={styles.field_key}>Phone:</Text>
                        <Text style={styles.field_value}>+{userData?.country_code + " " + userData?.phone}</Text>
                    </View>
                    <Text style={styles.section_devider_text}>Details: </Text>
                    <View style={styles.field_view}>
                        <Text style={styles.field_key}>Email:</Text>
                        <Text style={styles.field_value}>{userData?.email}</Text>
                    </View>
                    <View style={styles.field_view}>
                        <Text style={styles.field_key}>Nationality:</Text>
                        <Text style={styles.field_value}></Text>
                    </View>
                    <View style={styles.field_view}>
                        <Text style={styles.field_key}>Gender:</Text>
                        <Text style={styles.field_value}></Text>
                    </View>
                    <View style={styles.field_view}>
                        <Text style={styles.field_key}>Age:</Text>
                        <Text style={styles.field_value}></Text>
                    </View>
                    <View style={styles.field_view}>
                        <Text style={styles.field_key}>Passport ID:</Text>
                        <Text style={styles.field_value}></Text>
                    </View>
                </View>
            </View>
        </RootLayout>
    );
}

const styles = StyleSheet.create({
    page_view: {
        paddingHorizontal: 10,
        paddingTop: 70
    },
    box_view: {
        borderWidth: 2,
        borderColor: 'white',
        paddingVertical: 25,
        paddingHorizontal: 15,
        borderRadius: 15,
        position: 'relative',
        width: '100%',
        paddingTop: 85
    },
    profile_image_container: {
        backgroundColor: 'white',
        marginHorizontal: 'auto',
        overflow: 'hidden',
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 1,
        width: '45%',
        height: 'auto',
        aspectRatio: 1 / 1,
        position: "absolute",
        zIndex: 10,
        top: "-25%",
        left: '33%'
    },
    profile_image: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1 / 1
    },
    text_one: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    edit_view: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_edit_profile: {
        color: '#4BCD9C',
    },
    field_view: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderLeftWidth: 2,
        borderColor: '#4BCD9C',
        paddingLeft: 10,
        marginTop: 6
    },
    field_key: {
        color: '#4BCD9C',
        fontWeight: 'bold',
        fontSize: 15
    },
    field_value: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold'
    },
    section_devider_text: {
        marginTop: 20,
        color: '#51F3E0',

    }
})

export default ProfileScreen;
