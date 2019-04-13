import React from 'react';
import { TouchableOpacity, Image, Dimensions, View } from 'react-native';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const FotoGrandeEsquerda = ({chave, onPress, foto}) => {
    return (
        <TouchableOpacity key={chave} onPress={onPress} style={{width: imageWidth/1.5, height: imageWidth/1.5, paddingBottom: 2}}>
            <View style={{flex: 1, backgroundColor: '#eee'}}>
                <Image resizeMethod="resize" source={{uri: foto}} style={{flex: 1, width: undefined, height: undefined}}/>
            </View>
        </TouchableOpacity>
    );
}

export default FotoGrandeEsquerda;