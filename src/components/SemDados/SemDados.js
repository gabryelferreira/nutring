import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SemDados = ({ icone, titulo, texto, seta, onClickBotao, textoBotao }) => {

    renderBotao = () => {
        if (textoBotao){
            return (
                <TouchableOpacity onPress={onClickBotao} style={styles.botao}>
                    <Text style={styles.textoBotao}>{textoBotao}</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    return (
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {/* <Icon name={icone ? icone : 'sad-tear'} size={26} color="#000"/> */}
            <Text style={{fontSize: 20, color: '#000', fontWeight: 'bold', textAlign: 'center', marginTop: 15, marginBottom: 4}}>{titulo}</Text>
            <Text style={{fontSize: 12, color: '#000', textAlign: 'center'}}>{texto}</Text>
            {renderBotao()}
        </View>
    );
}

export default SemDados;

const styles = {

    botao: {
        borderWidth: .5,
        borderColor: '#28b657',
        elevation: 5,
        shadowOffset:{  width: 5,  height: 5,  },
        shadowColor: 'black',
        shadowOpacity: .2,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    textoBotao: {
        fontSize: 12,
        color: '#28b657'
    }

}