import React from 'react';
import { TouchableOpacity, Image, Dimensions, View } from 'react-native';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const FotoPequenaDireita = ({chave, onPress, foto}) => {
    return (
        <TouchableOpacity key={chave} onPress={onPress} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, paddingBottom: 2}}>
            <View style={{flex: 1, backgroundColor: '#eee'}}>
                <Image resizeMethod="resize" source={{uri: foto}} style={{flex: 1, width: undefined, height: undefined}}/>
            </View>
        </TouchableOpacity>
    );
}

export default FotoPequenaDireita;