import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const CompanionPackages = () => {
    const selectedCompanion = useSelector((state: RootState) => state.userapp.selectedCompanion);
    return (
        <View>
            {/* Selected Companion Package History */}
        </View>
    );
}

const styles = StyleSheet.create({})

export default CompanionPackages;

