import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import RootLayout from '../layouts/RootLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { AppDispatch, RootState } from '../../redux/store';
import { loadChangeBaseCampModal, loadLoadingModal, loadQRModal } from '../../redux/slices/remoteModalSlice';
import { useGetWalletInfo, useGetWalletTransactions } from '../../query/wallet/query';
import { extractBracketPairs, formatDateString } from '../../lib/utilities';
import { translations } from '../../lib/translations';
import { fetchUserWallet } from '../../redux/slices/appAuthenticationSlice';
import Toast from 'react-native-toast-message';

const WalletScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const language = useSelector((state: RootState) => state.language.language);
    const { token, user_data } = useSelector((state: RootState) => state.authentication);
    const { isGuest } = useSelector((state: RootState) => state.guest);
    const dispatch = useDispatch<AppDispatch>();
    const [walletInfo, setWalletInfo] = useState<any>();
    const [transactions, setTransactions] = useState<any[]>([]);

    const { isPending: fetchingWalletInfo } = useGetWalletInfo();
    const { mutateAsync: getTransactions, isPending: fetchingTransactions } = useGetWalletTransactions();

    const slideAnim = new Animated.Value(300);
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if(isGuest) return;
        if(user_data){
            if(!user_data.baseCampAvailable) {
                dispatch(loadChangeBaseCampModal(true));
            }
        }
    }, [user_data])

    const handleFetchWallet = async (token: string) => {
        try {
            dispatch(loadLoadingModal(true))
            const data = await dispatch(fetchUserWallet(token));
            setWalletInfo(data.payload);
            if (!data.payload) {
                navigation.replace('Services');
                return Toast.show({
                    type: 'info',
                    text1: 'Cannot Load Wallet!'
                })
            }
            await handleFetchTransactions(token, data.payload._id.toString())
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(loadLoadingModal(false))
        }
    }

    const handleFetchTransactions = async (token: string, walletId: string) => {
        await getTransactions({ token: token, walletId: walletId }).then((data: any) => {
            if (data?.status !== 200) {
                throw new Error("Transaction Fetching Error: ", data?.message)
            }
            setTransactions(data?.data)
        });
    }

    useEffect(() => {
        if (token) {
            handleFetchWallet(token)
        }
    }, [token])

    const handleQrClick = () => {
        dispatch(loadQRModal(true))
    }

    const renderTransaction = ({ item }: any) => (
        <View style={styles.transaction}>
            <Ionicons
                name={item.type === 'credit' ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={24}
                color={item.type === 'credit' ? '#4AF4CF' : '#f0b208'}
            // style={{ backgroundColor: , borderRadius: 100, padding: 0}}
            />
            <View style={styles.transactionDetails}>
                {extractBracketPairs(item?.title)?.map((text: string, index: number) => (
                    <Text
                        key={index}
                        style={[
                            styles.transactionTitle,
                            index >= 1 && styles.bracketPair
                        ]}
                    >
                        {text}
                    </Text>
                ))}
                <Text style={styles.transactionDate}>{formatDateString(item.createdAt)}</Text>
            </View>
            <View style={styles.transactionAmountContainer}>
                {/* <Text style={styles.transactionAmount}>{item.amount}</Text> */}
                <Text style={[styles.transactionTx, { color: item.type === 'credit' ? '#4AF4CF' : '#f0b208' }]}>{item.type === 'credit' ? '+ ' : '- '}{item.amount} {item.currencyType}</Text>
            </View>
        </View>
    );

    return (
        <RootLayout>
            <View style={styles.container}>
                {isGuest && <Text style={{ color: 'gray', textAlign: 'center', marginBottom: 5 }}>! Wallet Is Inactive For Guest Users.</Text>}
                {/* Wallet Card */}
                <LinearGradient
                    colors={['#4AF4CF', '#00C9A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.walletCard}>
                    <View style={styles.walletCardTopCircle}></View>
                    <View style={styles.walletCardBottomCircle}></View>
                    <Text style={styles.walletHeading}>{walletInfo?.status == 1 ? 'ACTIVE WALLET' : 'NOT ACTIVE'}</Text>
                    <View style={styles.balanceView}>
                        <Text style={styles.walletBalanceText}>{translations[language].balance}</Text>
                        <Text style={styles.walletBalance}>{walletInfo?.wallet_amount} AED</Text>
                    </View>
                    <Text style={styles.walletSubtitle}>{walletInfo?.camp_name}</Text>
                    <TouchableOpacity style={styles.walletQrContainer} onPress={handleQrClick}>
                        <Ionicons name="qr-code" size={60} color="black" style={styles.qrIcon} />
                        <Text style={styles.uuidText}>UUID</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Transactions Section */}
                <View style={styles.transactionsContainer}>
                    <Text style={styles.transactionsHeading}><AntDesign name="retweet" size={20} color="white" />{"  "} {translations[language].transactions}</Text>
                    <Animated.View style={[styles.transactionsList, { transform: [{ translateY: slideAnim }] }]}>
                        {transactions?.length > 0 ?
                            <FlatList
                                data={transactions}
                                renderItem={renderTransaction}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                            /> :
                            <Text style={{ color: 'white', fontSize: 12, paddingHorizontal: 10 }}>{(fetchingWalletInfo || fetchingTransactions) ? 'Loading..' : 'No Transaction Data'}</Text>
                        }
                    </Animated.View>
                </View>
            </View>
        </RootLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    walletCard: {
        backgroundColor: '#1de9b6',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden'
    },
    walletCardTopCircle: {
        position: 'absolute',
        width: '90%',
        height: '60%',
        backgroundColor: '#59E8AA',
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 100,
        top: 0,
        left: -20,
        opacity: 0.4
    },
    walletCardBottomCircle: {
        position: 'absolute',
        width: '70%',
        height: '50%',
        backgroundColor: '#59E8AA',
        // borderTopRightRadius: 100,
        borderTopLeftRadius: 100,
        bottom: 0,
        right: -20,
        opacity: 0.6
    },
    walletHeading: {
        fontSize: 18,
        color: '#005F78',
        fontWeight: 'bold',
    },
    walletBalance: {
        fontSize: 28,
        color: '#005F78',
        fontWeight: 'bold',
    },
    balanceView: {
        marginVertical: 8
    },
    walletBalanceText: {
        fontSize: 14,
        color: '#005F78',
        fontWeight: 'bold',
        textAlign: "left"
    },
    walletSubtitle: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 15
    },
    walletQrContainer: {
        position: 'absolute',
        top: 15,
        right: 20,
        alignContent: 'center',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    qrIcon: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 10
    },
    uuidText: {
        color: '#32373D',
        fontSize: 16,
        fontWeight: 'bold',
        opacity: 0.5
    },
    transactionsContainer: {
        flex: 1,
        backgroundColor: '#32373D',
        borderRadius: 16,
        padding: 16,
    },
    transactionsHeading: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
    transactionsList: {
        flex: 1,
    },
    transaction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingBottom: 10
    },
    transactionDetails: {
        flex: 1,
        marginLeft: 10,
    },
    transactionTitle: {
        fontSize: 16,
        color: 'white',
    },
    bracketPair: {
        fontSize: 14,
        color: '#b7b7b7',
    },
    transactionDate: {
        fontSize: 12,
        color: 'gray',
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 14,
        color: 'white',
    },
    transactionTx: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WalletScreen;
