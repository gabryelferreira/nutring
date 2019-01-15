import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

const ImagemNutring = () => {
        return (
            // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <AutoHeightImage source={require('../../assets/imgs/nutring-color.png')} width={100} style={{alignSelf: 'center'}}/>
            // </View>
        );
}

export default ImagemNutring;