import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const BotaoPequeno = ({texto, onPress, loading}) => {

    botao = () => {
        if (loading){
            return (
                <TouchableOpacity style={styles.botao}>
                    <ActivityIndicator animating color="#fff"/>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={styles.botao} onPress={onPress}>
                <Text style={styles.textoBotao}>{texto}</Text>
            </TouchableOpacity>
        );
    }

    return botao();
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