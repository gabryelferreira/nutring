import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SemDados = ({ icone, titulo, texto, seta }) => {

    return (
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name={icone ? icone : 'sad-tear'} size={26} color="#000"/>
            <Text style={{fontSize: 20, color: '#000', fontWeight: 'bold', textAlign: 'center', marginTop: 15, marginBottom: 4}}>{titulo}</Text>
            <Text style={{fontSize: 12, color: '#000', textAlign: 'center'}}>{texto}</Text>
        </View>
    );
}

export default SemDados;