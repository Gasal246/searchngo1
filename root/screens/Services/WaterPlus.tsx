import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TouchableHighlight,
} from 'react-native';

import RootLayout from '../../layouts/RootLayout';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButtonOne from '../../../components/shared/GradientButtonOne';

const WaterPlus = () => {
    const [customPlanCount, setCustomPlanCount] = useState(1);

    const waterPlans = [
        { id: '1', title: 'ZERO Sodium', description: '5 Gallon (18.9 L)', bottles: '15 Bottle', price: '100 AED' },
        { id: '2', title: 'ZERO Sodium', description: '5 Gallon (18.9 L)', bottles: '35 Bottle', price: '200 AED' },
        { id: '3', title: 'ZERO Sodium', description: '5 Gallon (18.9 L)', bottles: '45 Bottle', price: '300 AED' },
        { id: '4', title: 'ZERO Sodium', description: '5 Gallon (18.9 L)', bottles: '55 Bottle', price: '400 AED' },
    ];

    const handleIncrement = () => setCustomPlanCount(customPlanCount + 1);
    const handleDecrement = () => {
        if (customPlanCount > 1) setCustomPlanCount(customPlanCount - 1);
    };

    return (
        <RootLayout>
            <View style={styles.container}>
                {/* Wallet Balance */}
                <LinearGradient
                    colors={["#006e7d", "#00c8a4"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.walletBalanceContainer}>
                    <Text style={styles.walletBalanceText}>Wallet Balance</Text>
                    <Text style={styles.walletBalanceValue}>500 AED</Text>
                </LinearGradient>

                {/* Title */}
                <Text style={styles.sectionTitle}>Water Plus</Text>

                {/* Water Plans Slider */}
                <FlatList
                    horizontal
                    data={waterPlans}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={require('../../../assets/images/png/bottle.png')} // Replace Local Url With Server Url
                                style={styles.cardImage}
                            />
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDescription}>{item.description}</Text>
                            <View style={{ backgroundColor: 'gray', height: 2, width: '100%' }}></View>
                            <View style={{ display: 'flex', width: '100%', gap: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.cardBottles}>{item.bottles}</Text>
                                <Text style={styles.cardPrice}>{item.price}</Text>
                            </View>
                            <View style={styles.orderButtonContainer}>
                                <GradientButtonOne
                                    colors={["#006e7d", "#00c8a4"]}
                                    style={styles.orderButton}
                                ><Text style={styles.orderButtonText}>ORDER</Text></GradientButtonOne>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.slider}
                    showsHorizontalScrollIndicator={true}
                />

                {/* Custom Plan Selector */}
                <View style={styles.customPlanContainer}>
                    <Image
                        source={require('../../../assets/images/png/bottle.png')} // Replace local Url With Server Url
                        style={styles.cardImage}
                    />
                    <View style={styles.customPlanDetails}>
                        <Text style={styles.cardTitle}>ZERO Sodium</Text>
                        <Text style={styles.cardDescription}>5 Gallon (18.9 L)</Text>
                        <Text style={styles.itemPrice}>7 AED</Text>
                    </View>
                    <View style={{ backgroundColor: 'gray', width: 2, height: '100%', marginRight: 10 }}></View>
                    <View style={styles.counterContainer}>
                        <Text style={styles.totalPrice}>{7 * customPlanCount} AED</Text>
                        <View style={styles.counter}>
                            <TouchableHighlight underlayColor={'#00C7A6'} onPress={handleDecrement} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableHighlight>
                            <Text style={styles.counterValue}>{customPlanCount}</Text>
                            <TouchableHighlight underlayColor={'#00C7A6'} onPress={handleIncrement} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableHighlight>
                        </View>
                        <Text style={styles.bottleCount}>{customPlanCount} Bottles</Text>
                    </View>
                    <View style={styles.customOrderButtonContainer}>
                        <GradientButtonOne
                            colors={["#006e7d", "#00c8a4"]}
                            style={styles.customOrderButton}
                        ><Text style={styles.orderButtonText}>ORDER</Text></GradientButtonOne>
                    </View>
                </View>
            </View>
        </RootLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    walletBalanceContainer: {
        backgroundColor: '#14a37f',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    walletBalanceText: {
        color: '#fff',
        fontSize: 16,
    },
    walletBalanceValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionTitle: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    slider: {},
    card: {
        backgroundColor: '#ffff',
        borderRadius: 10,
        padding: 15,
        marginRight: 8,
        alignItems: 'center',
        width: 180,
        position: 'relative',
        marginBottom: 40
    },
    cardImage: {
        width: 80,
        height: 'auto',
        aspectRatio: 3 / 5,
        marginBottom: 10,
        // backgroundColor: 'red'
    },
    cardTitle: {
        color: '#005F78',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDescription: {
        color: '#005F78',
        fontSize: 12,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    cardBottles: {
        color: '#00C7A6',
        fontSize: 14,
        fontWeight: 'bold'
    },
    cardPrice: {
        color: '#005F78',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    orderButtonContainer: {
        position: 'absolute',
        width: '100%',
        bottom: -20
    },
    orderButton: {
        padding: 10,
        borderRadius: 10,
        width: '100%',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    customOrderButtonContainer: {
        position: 'absolute',
        width: '30%',
        bottom: -20,
        right: 10
    },
    customOrderButton: {
        padding: 10,
        borderRadius: 10,
        width: '100%',
    },
    customPlanContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        paddingBottom: 10,
        alignItems: 'center',
        position: 'relative',
    },
    customPlanDetails: {
        flex: 1,
        marginLeft: 5,
    },
    counterContainer: {
        alignItems: 'center',
    },
    totalPrice: {
        color: '#00C7A6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        color: '#00C7A6',
        fontSize: 20,
        fontWeight: 'bold',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 5
    },
    counterButton: {
        backgroundColor: '#005F78',
        borderRadius: 5,
        padding: 5,
        width: 30,
        alignItems: 'center',
    },
    counterButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    counterValue: {
        color: '#005F78',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    bottleCount: {
        color: '#005F78',
        fontSize: 12,
        fontWeight: 'bold'
    },
});

export default WaterPlus;
