import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import MenuBar from '../../components/settings/MenuBar';

const ServicesScreen = () => {
    const navigation = useNavigation<NavigationProp>()
    return (
        <View>
            <View style={styles.topbar_flex_container}>
                <MenuBar />
                <View style={styles.center_logo}>
                    <Image source={require("../../assets/images/png/sngcolor.png")} style={{ width: 60, height: 70, objectFit: "contain" }} />
                </View>
                <FontAwesome name='user' color="gray" size={35} onPress={() => navigation.navigate("Profile")} />
            </View>
            <ScrollView style={styles.grid_scroll_view}>
                <View style={styles.grid_service_view}>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Food Mate</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Groccery</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Water Plus</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Laundry</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Restaurant</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Well Clean</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Find Devices</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Jobs In</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Big Win</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>EX Rate</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>My Files</Text>
                    </View>
                    <View style={styles.service_column}>
                        <View style={styles.service_view}><FontAwesome name='image' size={60} color="grey" /></View>
                        <Text style={styles.service_title}>Weather</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
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
    grid_scroll_view: {
        width: "100%",
        height: "90%",
    },
    grid_service_view: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30
    },
    service_column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "30%",
        height: 120,
        padding: 10,
        marginBottom: 10
    },
    service_view: {
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 15,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    service_title: {
        fontSize: 16,
        color: "white",
        fontWeight: "600"
    }
})

export default ServicesScreen;
