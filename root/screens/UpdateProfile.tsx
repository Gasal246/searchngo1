import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import GradientButtonOne from '../../components/shared/GradientButtonOne';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../lib/translations';
import { RootState } from '../../redux/store';
import CameraModal from '../../components/shared/CameraModal';
import { formatBearerToken, splitString } from '../../lib/utils';
import Toast from 'react-native-toast-message';
import { loadToken, loadUserData } from '../../redux/slices/appAuthenticationSlice';
import axios from 'axios';
import { apiPrefix, currentApi, profilePrefix } from '../../lib/constants/constatntUrls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
// import FormData from 'form-data';

const UpdateProfile = () => {
    const navigation = useNavigation<NavigationProp>();
    const language = useSelector((state: RootState) => state.language.language);
    const { user_data: userData, token: authToken } = useSelector((state: RootState) => state.authentication);
    const [isChanges, setIsChanges] = useState(false);
    const [fullName, setFullName] = useState<string>(userData?.name || '');
    const [imageUrl, setImageUrl] = useState<any>();
    const [imageError, setImageError] = useState(false);
    const dispatch = useDispatch();

    // Track original values using refs
    const originalName = useRef(userData?.name || '');
    const originalImageUrl = useRef(profilePrefix(userData?.id));

    useEffect(() => {
        const initialImageUrl = `${profilePrefix(userData?.id)}?t=${new Date().getTime()}`;
        setImageUrl(initialImageUrl);
        setImageError(!initialImageUrl);
    }, [userData?.id]);

    // Check for changes whenever name or image updates
    useEffect(() => {
        const nameChanged = fullName !== originalName.current;
        const cleanImageUrl = imageUrl?.split('?')[0];
        const cleanOriginalImageUrl = originalImageUrl.current?.split('?')[0];
        const imageChanged = cleanImageUrl !== cleanOriginalImageUrl;
        // const imageChanged = imageUrl !== originalImageUrl.current && !imageUrl?.startsWith(originalImageUrl.current);
        setIsChanges(nameChanged || imageChanged);
    }, [fullName, imageUrl]);

    const handleNameOnChange = (text: string) => {
        setFullName(text)
    }

    const handleUpdateProfile = async () => {
        if (!isChanges && fullName.trim().length > 0) {
            navigation.replace('Services');
        }
        try {
            const formData = new FormData();
            let hasChanges = false;

            // Check image changes
            if (imageUrl && !imageUrl.startsWith(originalImageUrl.current)) {
                if (imageUrl.startsWith("file://")) {
                    formData.append('photo', {
                        name: 'profileimage.jpg',
                        type: 'image/jpeg',
                        uri: imageUrl
                    } as any);
                }
                hasChanges = true;
            }

            // Check name changes
            if (fullName !== originalName.current) {
                formData.append("username", fullName);
                hasChanges = true;
            }

            if (!hasChanges) {
                navigation.replace('Services');
                return;
            };

            const { data: response } = await axios.post(
                `${currentApi}${apiPrefix}/users/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: formatBearerToken(authToken!),
                        "Content-Type": 'multipart/form-data'
                    }
                }
            );

            if (response?.error) {
                Toast.show({
                    type: 'error',
                    text1: "Error on updating profile"
                });
                return;
            }

            if (response?.data) {
                dispatch(loadToken(response.data.token));
                dispatch(loadUserData(JSON.stringify(response.data.user_data)));
                await AsyncStorage.multiSet([
                    ['user_data', JSON.stringify(response.data.user_data)],
                    ['user_token', response.data.token]
                ]);
                navigation.replace('Services');
            }

        } catch (error) {
            console.error('Update profile error:', error);
            Toast.show({
                type: 'error',
                text1: "Error On Initial Profile Update!",
                text2: "Please check the log for more details."
            });
        }
    };

    return (
        <View>
            <View style={styles.center_logo}>
                <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 130, height: 100, objectFit: "contain" }} />
            </View>
            <View style={styles.cover_view}>
                <View style={styles.absolute_view}>
                    <Text style={styles.absolute_title}>{translations[language].update_pf_id}</Text>
                    <Text style={styles.userid}>{splitString(userData?.uuid, 4)}</Text>
                </View>
                <View style={styles.form_view}>
                    <CameraModal
                        setImageUri={setImageUrl}>
                        {!imageError ? (
                            <Image source={{ uri: imageUrl, cacheKey: `profile-image` }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.camera_view}>
                                <FontAwesome name="camera" size={60} color="gray" />
                            </View>
                        )}
                    </CameraModal>
                    <View style={styles.input_area}>
                        <FontAwesome name='user-circle' size={30} color={"gray"} />
                        <TextInput placeholder={`${translations[language].update_pf_name}`}
                            style={styles.text_input}
                            value={fullName}
                            onChangeText={handleNameOnChange}
                        />
                    </View>
                    <GradientButtonOne colors={["#4EFBE6", "#5AE7A6"]} style={{ borderRadius: 10, width: "100%", marginBottom: 10 }} onPress={handleUpdateProfile}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.textSubmit}>{translations[language].update_pf_submit} </Text>
                            <FontAwesome name="arrow-right" size={20} color="white" />
                        </View>
                    </GradientButtonOne>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center_logo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 40,
        alignItems: "center"
    },
    cover_view: {
        position: "relative",
        width: "100%",
        height: "100%",
        marginTop: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 15
    },
    absolute_view: {
        position: "static",
        borderColor: "white",
        borderWidth: 2,
        padding: 15,
        borderRadius: 15,
        backgroundColor: "#222831",
        zIndex: 100
    },
    absolute_title: {
        fontSize: 15,
        color: "white",
        textAlign: "center"
    },
    userid: {
        color: "white",
        fontSize: 20,
        fontWeight: "700",
    },
    form_view: {
        padding: 15,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 15,
        width: "100%",
        marginTop: -38,
        paddingTop: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
        zIndex: -1
    },
    camera_view: {
        padding: 25,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 90,
        marginBottom: 20,
    },
    input_area: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        width: "100%",
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginBottom: 13,
    },
    text_input: {
        fontSize: 18,
        fontWeight: "500",
        width: "100%",
        paddingRight: 40
    },
    textSubmit: {
        color: "white",
        fontWeight: "800",
        fontSize: 20,
    },
    previewImage: {
        objectFit: 'cover',
        aspectRatio: 1 / 1,
        width: '50%',
        height: 'auto',
        borderRadius: 30,
        marginBottom: 15
    }
})

export default UpdateProfile;
