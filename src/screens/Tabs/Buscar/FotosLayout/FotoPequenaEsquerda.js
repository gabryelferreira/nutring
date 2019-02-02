import React from 'react';
import { TouchableOpacity, Image, Dimensions } from 'react-native';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const FotoPequenaEsquerda = ({chave, onPress, foto}) => {
    return (
        <TouchableOpacity key={chave} onPress={onPress} style={{width: imageWidth/3, height: imageWidth/3, paddingBottom: 2}}>
            <Image resizeMethod="resize" source={{uri: foto}} style={{flex: 1, width: undefined, height: undefined}}/>
        </TouchableOpacity>
    );
}

export default FotoPequenaEsquerda;