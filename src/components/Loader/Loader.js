import React, { Component } from 'react';
import { View, Text, Animated, Easing, Image } from 'react-native';

const Loader = (props) => {

    spinValue = new Animated.Value(0);
    loaderImg = "https://cashier.rationalcdn.com/clb/ps-all-web_2.23.370/shared/assets/images/pre-loader.png";
    animate();
    console.log("passando por aqui")

    function animate(){
        this.spinValue.setValue(0);
        console.log("im here")
        Animated.timing(
            this.spinValue,
        {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true
        }
        ).start(() => {
            animate();
        });
    }

    const spin = this.spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    if (!props.relative){
        return (
            <View style={styles.container} pointerEvents="none">
                <Animated.Image source={{uri: loaderImg}}
                 style={[styles.loader,
                    {transform: [
                        {rotate: spin}
                    ]}
                ]}>
    
                </Animated.Image>
            </View>
        );
    } else {
        return (
            <Animated.Image source={{uri: loaderImg}}
                style={[styles.loader,
                {transform: [
                    {rotate: spin}
                ]}
            ]}>

            </Animated.Image>
        );
    }
}

const styles = {
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
    },
    loader: {
        height: 45,
        width: 45,
        alignSelf: 'center'
    }
};

export default Loader;