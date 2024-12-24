import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import GradientButtonOne from '../../components/shared/GradientButtonOne';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { translations } from '../../lib/translations';
import RootLayout from '../layouts/RootLayout';

const WalletScreen = () => {
    const navigation = useNavigation<NavigationProp>()
    const language = useSelector((state: any) => state.language.language);

    return (
        <RootLayout>
            <View style={styles.cover_view}>
                <View style={styles.absolute_view}>
                    <Text style={styles.absolute_title}>{translations[language].pf_wallet}</Text>
                    <Text style={styles.wallet_balance}>100 AED</Text>
                    <Text style={styles.absolute_title}>{translations[language].pf_yourid}</Text>
                    <Text style={styles.userid}>1986 2568 9569 5263</Text>
                </View>
                {/* This is build by @Muhammed_Gasal */}
                <View style={styles.body_view}>
                    <Text style={styles.wallet_history}>{translations[language].wallet_history_title}</Text>
                    <Text style={styles.history_text}>{translations[language].wallet_history}</Text>
                    <ScrollView style={styles.history_scroll_view}>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-up' color="#51F6D6" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_add}</Text>
                                    <Text style={styles.expence_date}>12/11/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 12.3</Text>
                            </View>
                        </View>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-down' color="#F7931E" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_used}</Text>
                                    <Text style={styles.expence_date}>12/10/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 21.5</Text>
                            </View>
                        </View>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-down' color="#F7931E" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_used}</Text>
                                    <Text style={styles.expence_date}>12/10/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 21.5</Text>
                            </View>
                        </View>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-down' color="#F7931E" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_used}</Text>
                                    <Text style={styles.expence_date}>12/10/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 21.5</Text>
                            </View>
                        </View>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-up' color="#51F6D6" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_add}</Text>
                                    <Text style={styles.expence_date}>12/08/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 50.3</Text>
                            </View>
                        </View>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-down' color="#F7931E" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_used}</Text>
                                    <Text style={styles.expence_date}>12/10/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 21.5</Text>
                            </View>
                        </View>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-down' color="#F7931E" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_used}</Text>
                                    <Text style={styles.expence_date}>12/10/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 21.5</Text>
                            </View>
                        </View>
                        <View style={styles.expence_row}>
                            <View style={styles.expence_icon}><FontAwesome name='chevron-up' color="#51F6D6" size={20} /></View>
                            <View style={styles.expence_data}>
                                <View>
                                    <Text style={styles.expence_title}>{translations[language].wallet_fund_add}</Text>
                                    <Text style={styles.expence_date}>12/08/2024</Text>
                                </View>
                                <Text style={styles.expence_amount}>AED 50.3</Text>
                            </View>
                        </View>
                    </ScrollView>
                    <GradientButtonOne colors={["#4EFBE6", "#5AE7A6"]} style={{ marginTop: 20, borderRadius: 10 }} onPress={() => navigation.navigate("Home")}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <Text style={styles.add_fund_text}>{translations[language].wallet_add_fund}</Text>
                            <FontAwesome name="arrow-right" size={20} color="white" />
                        </View>
                    </GradientButtonOne>
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
        marginTop: 20,
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
    body_view: {
        padding: 10,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 20,
        width: "100%",
        marginTop: -38,
        paddingTop: 50,
    },
    absolute_title: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    },
    wallet_balance: {
        color: "#51F6D6",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 30
    },
    userid: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "700"
    },
    wallet_history: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600"
    },
    history_text: {
        color: "white",
        fontSize: 20,
        fontWeight: "700",
        marginVertical: 15
    },
    expence_row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingRight: 10,
        borderBottomColor: "#51F6D6",
        borderBottomWidth: 2,
        paddingBottom: 8,
        marginBottom: 8
    },
    expence_data: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        paddingRight: 35,
        justifyContent: "space-between"
    },
    expence_icon: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 10,
    },
    expence_title: {
        color: "white",
        fontSize: 18,
        fontWeight: '600'
    },
    expence_date: {
        color: "#C3C3C2",
        fontSize: 12
    },
    expence_amount: {
        color: "white",
        fontWeight: "700",
        fontSize: 20
    },
    add_fund_text: {
        color: "white",
        fontWeight: "800",
        fontSize: 20,
    },
    history_scroll_view: {
        width: "100%",
        height: "36%",
    }
})

export default WalletScreen;
