import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const BotaoPequeno = ({texto, textoLoading, onPress, loading, disabled}) => {

    botao = () => {
        if (loading){
            return (
                <View style={[styles.botao, {opacity: .2}]}>
                    <Text style={styles.textoBotao}>{textoLoading}</Text>
                    <ActivityIndicator animating color="#000" size="small"/>
                </View>
            );
        }
        return (
            <TouchableOpacity style={styles.botao} onPress={this.handleOnPress}>
                <Text style={styles.textoBotao}>{texto}</Text>
                <Icon name="chevron-right" solid color="#000" size={13}/>
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

export default BotaoPequeno;

const styles = {
    botao: {
        paddingVertical: 7,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20
    },
    textoBotao: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 6
    }
}