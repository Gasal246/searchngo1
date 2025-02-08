import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LogScreen = () => {
    const [logs, setLogs] = useState<any>();

    const getAsyncLog = async () => {
        const res = await AsyncStorage.getItem('logs');
        // const jslog = await JSON.parse(res ?? '{ "error": true }');
        setLogs(res)
    }

    useEffect(() => {
        getAsyncLog();
    }, [])

    return (
        <View style={{ backgroundColor: 'white', width: '100%', flex: 1}}>
            <Text style={{ color: 'black' }}>
                {logs}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({})

export default LogScreen;
