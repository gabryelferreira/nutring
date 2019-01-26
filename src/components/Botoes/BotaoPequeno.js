import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const BotaoPequeno = ({texto, onPress}) => {
    return (
        <TouchableOpacity style={styles.botao} onPress={onPress}>
            <Text style={styles.textoBotao}>{texto}</Text>
        </TouchableOpacity>
    );
}

export default BotaoPequeno;

const styles = {
    botao: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#28b657',
        borderRadius: 20,
        elevation: 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start'
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14
    }
}