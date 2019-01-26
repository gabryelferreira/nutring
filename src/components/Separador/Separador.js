import React from 'react';
import { View, Dimensions } from 'react-native';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Separador = () => {
    return (
        <View style={{width: imageWidth, height: 1, backgroundColor: '#e4e4e4'}}/>
    );
}

export default Separador;