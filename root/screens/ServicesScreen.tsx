import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RootLayout from '../layouts/RootLayout';
import { useNavigation } from '@react-navigation/native';
import FetchEssentials from '../../components/shared/Connection/FetchEssentials';

const ServicesScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <RootLayout>
            <FetchEssentials />
            <View style={styles.grid_view_fixed}>
                <View style={styles.title_area}>
                    <Text style={styles.title_text}>Sevices at your finger tips</Text>
                </View>
                <View style={styles.grid_service_view}>
                    <TouchableOpacity style={styles.service_column} onPress={() => navigation.navigate('UpdateProfile')}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/Wallet.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.service_column} onPress={() => navigation.navigate('WaterPlus')}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/WaterPlus.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Water Plus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.service_column}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/MessMate.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Mess Mate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.service_column}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/SmartWash.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Smart Wash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.service_column}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/Ex-rate.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Ex-Rate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.service_column}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/BestOffers.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Best Offers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.service_column}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/BigWin.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Big Win</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.service_column}>
                        <View style={styles.service_view}>
                            <Image source={require('../../assets/images/png/HelpDesk.png')} style={styles.service_icon} />
                        </View>
                        <Text style={styles.service_title}>Help Desk</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.title_area}>
                <Text style={styles.title_text}>Deals for you</Text>
            </View>
            <View style={{ width: '100%', paddingHorizontal: 10, flex: 1 }}>
                <View style={styles.scrollViewWrapper}>
                    <ScrollView style={styles.grid_scroll_view}>
                        <TouchableOpacity style={styles.deal_view}>
                            <Image source={require('../../assets/images/png/Offers01.png')} style={styles.deal_image} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deal_view}>
                            <Image source={require('../../assets/images/png/Offers02.png')} style={styles.deal_image} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deal_view}>
                            <Image source={require('../../assets/images/png/Offers03.png')} style={styles.deal_image} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deal_view}>
                            <Image source={require('../../assets/images/png/Offers04.png')} style={styles.deal_image} />
                        </TouchableOpacity>
                        <View style={{ paddingVertical: 20 }}></View>
                    </ScrollView>
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
    scrollViewWrapper: {
        width: '100%',
        flex: 1,
        marginTop: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        overflow: 'hidden',
    },
    grid_scroll_view: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 0,
    },
    grid_view_fixed: {
        width: "100%",
        height: '35%',
        marginBottom: 25,
        marginTop: 15
    },
    grid_service_view: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        gap: 1,
    },
    service_column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "24%",
        height: "40%",
        padding: 5,
        marginBottom: 20
    },
    service_view: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    service_title: {
        fontSize: 12,
        color: "white",
        fontWeight: "700"
    },
    service_icon: {
        width: '70%',
        height: 'auto',
        aspectRatio: 1 / 1
    },
    title_area: {
        width: "95%",
        backgroundColor: "white",
        marginHorizontal: 'auto',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    title_text: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700'
    },
    deal_view: {
        width: "100%",
        marginBottom: 10,
    },
    deal_image: {
        width: "100%",
        height: 'auto',
        aspectRatio: 7 / 2,
        borderRadius: 20,
    }
})

export default ServicesScreen;
