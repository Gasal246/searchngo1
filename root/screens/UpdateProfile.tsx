import React = require('react');
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import GradientButtonOne from '../../components/shared/GradientButtonOne';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { translations } from '../../lib/translations';
import { getVerifiedData } from '../../helpers/UserHelper';
import { RootState } from '../../redux/store';

const UpdateProfile = () => {
    const navigation = useNavigation<NavigationProp>();
    const language = useSelector((state: RootState) => state.language.language);
    const userData = useSelector((state: RootState) => state.authentication.user_data);
    const [fullName, setFullName] = useState<string>(userData.name);

    const handleNameOnChange = (text: string) => {
        setFullName(text)
    }

    useEffect(() => {
        console.log(userData)
    }, [])

    return (
        <View>
            <View style={styles.center_logo}>
                <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 130, height: 100, objectFit: "contain" }} />
            </View>
            <View style={styles.cover_view}>
                <View style={styles.absolute_view}>
                    <Text style={styles.absolute_title}>{translations[language].update_pf_id}</Text>
                    <Text style={styles.userid}>{userData?.uuid}</Text>
                </View>
                <View style={styles.form_view}>
                    <View style={styles.camera_view}>
                        <FontAwesome name='camera' size={60} color={"gray"} />
                        {/* <Image source={{ uri: 'http://localhost:3019/public/uploads/user/profile/user_image-1729588788153.jpg' }} style={{ width: 130, height: 100, objectFit: "contain" }} /> */}
                    </View>
                    <View style={styles.input_area}>
                        <FontAwesome name='user-circle' size={30} color={"gray"} />
                        <TextInput placeholder={`${translations[language].update_pf_name}`}
                            style={styles.text_input}
                            value={fullName}
                            onChangeText={handleNameOnChange}
                        />
                    </View>
                    {/* Country will be added on next update of the project or some other place of this project. */}
                    {/* <View style={styles.input_area}>
                        <FontAwesome name='globe' size={30} color={"gray"} />
                        <TextInput placeholder={`${translations[language].update_pf_country}`} style={styles.text_input} />
                    </View> */}
                    <GradientButtonOne colors={["#4EFBE6", "#5AE7A6"]} style={{ borderRadius: 10, width: "100%", marginBottom: 10 }} onPress={() => navigation.navigate("Home")}>
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
        paddingBottom: 20
    },
    camera_view: {
        padding: 25,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 90,
        marginBottom: 20
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
    }
})

export default UpdateProfile;
