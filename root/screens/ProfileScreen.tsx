import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { translations } from '../../lib/translations';
import RootLayout from '../layouts/RootLayout';

const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const language = useSelector((state: any) => state.language.language);

    return (
        <RootLayout>
            <View style={styles.cover_view}>
                <View style={styles.absolute_view}>
                    <TouchableOpacity style={styles.absolute_flex_view} onPress={() => navigation.navigate("Wallet")}>
                        <View>
                            <Text style={styles.absolute_title}>{translations[language].pf_yourid}</Text>
                            <Text style={styles.userid}>1986 2568 9569 5263</Text>

                            <Text style={styles.absolute_title}>{translations[language].pf_membership}</Text>
                            <Text style={styles.userid}>Silver 30 Days</Text>

                            <Text style={styles.absolute_title}>{translations[language].pf_wallet}</Text>
                            <Text style={styles.wallet_balance}>100 AED</Text>
                        </View>
                        <View style={styles.qrview}>
                            <FontAwesome name='qrcode' size={130} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.body_view}>
                    <View style={styles.body_flex_view}>
                        <FontAwesome name="user-circle-o" color="#51E8BF" size={80} />
                        <View style={{ width: "70%" }}>
                            <Text style={styles.body_title}>Muhammed Shiyas</Text>
                            <View style={{ ...styles.body_obj_text_flex, flexDirection: language === 'arabic' || language === 'urdu' ? 'row-reverse' : 'row' }}>
                                <Text style={styles.body_key}>{translations[language].pf_nationality} :</Text>
                                <Text style={styles.body_value}>Indian</Text>
                            </View>
                            <View style={{ ...styles.body_obj_text_flex, flexDirection: language === 'arabic' || language === 'urdu' ? 'row-reverse' : 'row' }}>
                                <Text style={styles.body_key}>{translations[language].pf_contact} :</Text>
                                <Text style={styles.body_value}>0547626241</Text>
                            </View>
                            <View style={{ ...styles.body_obj_text_flex, flexDirection: language === 'arabic' || language === 'urdu' ? 'row-reverse' : 'row' }}>
                                <Text style={styles.body_key}>{translations[language].pf_blood} :</Text>
                                <Text style={styles.body_value}>A+</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </RootLayout>
    );
}

const styles = StyleSheet.create({
    center_logo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        alignItems: "center"
    },
    topbar_flex_container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    cover_view: {
        position: "relative",
        width: "100%",
        height: "100%",
        marginTop: 50,
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
        zIndex: 100,
        width: "90%"
    },
    absolute_flex_view: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    qrview: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        borderRadius: 15,
        padding: 10
    },
    absolute_title: {
        fontSize: 12,
        color: "white",
    },
    userid: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 5
    },
    wallet_balance: {
        color: "#4BCD9C",
        fontWeight: "700",
        fontSize: 25
    },
    body_view: {
        padding: 10,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 20,
        width: "100%",
        marginTop: -38,
        paddingTop: 50,
        paddingBottom: 40,
    },
    body_flex_view: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    body_obj_text_flex: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    body_title: {
        color: "white",
        fontSize: 20,
        fontWeight: "600"
    },
    body_key: {
        color: "#C3C3C2",
        fontWeight: "600",
        fontSize: 14
    },
    body_value: {
        color: "white",
        fontWeight: "500",
        fontSize: 14
    },
})

export default ProfileScreen;
