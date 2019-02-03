import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const BotaoMedio = ({texto, onPress, loading, disabled}) => {

    botao = () => {
        if (loading){
            return (
                <TouchableOpacity style={styles.botao}>
                    <ActivityIndicator animating color="#fff"/>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={styles.botao} onPress={this.handleOnPress}>
                <Text style={styles.textoBotao}>{texto}</Text>
            </TouchableOpacity>
        );
    }

    handleOnPress = () => {
        if (!disabled){
            onPress();
        }
    }

    return botao();
}

export default BotaoMedio;

const styles = {
    botao: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#28b657',
        borderRadius: 22,
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