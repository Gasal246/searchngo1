import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const LogScreen = () => {

    const { logger: logs } = useSelector((state: RootState) => state.logs);

    const renderItem = ({ item }: { item: { [key: string]: any } }) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        return (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold', color: 'blue' }}>{key}:</Text>
            <Text style={{ color: 'black'}}>{JSON.stringify(value)}</Text>
          </View>
        );
      };

    return (
        <View style={{ backgroundColor: 'white', width: '100%', flex: 1}}>
            <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={(item, index) => index?.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default LogScreen;
