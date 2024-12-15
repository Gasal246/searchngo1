import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.page} >
            <View>
                <Image source={require("../../assets/images/png/sngcolor.png")} style={{
                    width: 187,
                    height: 200,
                    objectFit: 'contain'
                }} />
            </View>
            <View>
                <Image source={require("../../assets/images/gif/loopanimation.gif")} style={{
                    width: 187,
                    height: 60,
                    objectFit: 'contain'
                }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        display: "flex",
        backgroundColor: "#222831",
        width: "100%",
        height: "100%",
    }
})

export default SplashScreen;
