import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SemDadosPerfil = ({ icone, titulo, texto, seta }) => {

    function returnSeta(){
        if (seta){
            return (
                <Icon name={'chevron-down'} color="#aaa" size={22} style={{marginTop: 35}}/>
            );
        }
        return <View style={{marginBottom: 25}}></View>;
    }

    return (
        <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 35, marginBottom: 10}}>
            <Icon name={icone} color="#000" size={30}/>
            <Text style={{fontSize: 18, color: '#000', textAlign: 'center', fontWeight: 'bold', marginTop: 12, marginBottom: 4}}>{titulo}</Text>
            <Text style={{fontSize: 13, color: '#000', textAlign: 'center', fontWeight: 'bold'}}>{texto}</Text>
            {returnSeta()}
        </View>
    );
}

export default SemDadosPerfil;