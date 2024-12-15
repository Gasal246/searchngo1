import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import GradientButtonOne from '../../components/shared/GradientButtonOne';
import { useNavigation } from '@react-navigation/native';
import { translations } from '../../lib/translations';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const language = useSelector((state: any) => state.language.language);

    return (
        <View>
            <View style={styles.center_logo}>
                <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 130, height: 100, objectFit: "contain" }} />
            </View>
            <View style={styles.container}>
                <View style={styles.membership_card}>
                    <View style={styles.title_view}>
                        <Text style={styles.title_text}>{translations[language].home_title}</Text>
                    </View>
                    <View style={styles.card_body}>
                        <FontAwesome name='qrcode' size={100} color="gray" />
                        <View style={styles.membership_details}>
                            <Text style={styles.sgid}>SG ID : 1234-4567-8965-3214</Text>
                            <View style={styles.flex_container}>
                                <FontAwesome name='star' color="gray" size={15} />
                                <Text style={styles.body_text}>{translations[language].home_premium_tag}</Text>
                            </View>
                            <View style={styles.flex_container}>
                                <FontAwesome name='calendar' color="gray" size={15} />
                                <Text style={styles.body_text}>{translations[language].home_sub_date}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.connectivity_view}>
                    <Text style={styles.connectivity_text}>{translations[language].home_connectivity}</Text>
                    <Text style={styles.connectivity_desc}>{translations[language].home_conn_desc}</Text>
                    <View style={styles.location_view}>
                        <Text style={styles.location_title}>{translations[language].home_site_title}</Text>
                        <Text style={styles.location_desc}>{translations[language].home_site_info}</Text>
                    </View>
                    <View style={styles.flex_container}>
                        <GradientButtonOne colors={["#8D9092", "#626365"]} style={{ borderRadius: 10, width: "28%", marginBottom: 10 }} onPress={() => navigation.navigate("Services")}>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.textSubmit}>{translations[language].home_skip} </Text>
                                <FontAwesome name="arrow-right" size={20} color="white" />
                            </View>
                        </GradientButtonOne>
                        <GradientButtonOne colors={["#4EFBE6", "#5AE7A6"]} style={{ borderRadius: 10, width: "69%", marginBottom: 10 }} onPress={() => navigation.navigate("Services")}>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.textSubmit}>{translations[language].home_submit}</Text>
                                <FontAwesome name="arrow-right" size={20} color="white" />
                            </View>
                        </GradientButtonOne>
                    </View>
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
        marginTop: 60,
        alignItems: "center"
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 50
    },
    membership_card: {
        backgroundColor: "white",
        borderRadius: 30,
    },
    title_view: {
        padding: 15,
        borderBottomColor: "gray",
        borderBottomWidth: 1,
        width: "100%"
    },
    title_text: {
        textAlign: "center",
        fontSize: 16,
        color: "gray"
    },
    card_body: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    membership_details: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingVertical: 8
    },
    sgid: {
        color: "gray",
        fontSize: 16,
        fontWeight: "700"
    },
    body_text: {
        color: "gray",
        fontSize: 14,
        fontWeight: "500"
    },
    flex_container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    connectivity_view: {
        borderColor: "white",
        borderWidth: 2,
        marginTop: 20,
        borderRadius: 22,
        paddingVertical: 22,
        paddingHorizontal: 20,
    },
    connectivity_text: {
        color: "white",
        fontSize: 24,
        fontWeight: "500"
    },
    connectivity_desc: {
        color: "white",
        fontSize: 13
    },
    location_view: {
        backgroundColor: "white",
        padding: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginVertical: 15
    },
    location_title: {
        color: "gray",
        fontSize: 16,
        textAlign: "center"
    },
    location_desc: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "500"
    },
    textSubmit: {
        color: "white",
        fontWeight: "700",
        fontSize: 18,
    }
})

export default HomeScreen;
