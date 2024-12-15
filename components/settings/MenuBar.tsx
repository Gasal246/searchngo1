import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const MenuBar = () => {
    const [isShowing, setIsShowing] = useState(false);
    const { width, height } = Dimensions.get('window');

    const toggleMenuBar = () => {
        setIsShowing(!isShowing);
    };

    return (
        <View style={styles.main_container}>
            {<View>
                <FontAwesome name="bars" color="gray" size={28} onPress={toggleMenuBar} />
            </View>}
            {isShowing && (
                <View
                    style={{
                        ...styles.menu_container,
                        width: width / 2, height: height - 60
                    }}
                ></View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    main_container: {
        zIndex: 400,
    },
    menu_container: {
        position: 'absolute',
        backgroundColor: '#050000ee',
        shadowColor: "black",
        shadowOffset: {
            width: 250,
            height: 100
        },
        borderRadius: 10,
        padding: 20,
    },
});

export default MenuBar;
