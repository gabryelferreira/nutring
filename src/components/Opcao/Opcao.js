import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Opcao = ({toggle, icone, texto, tela, seta, onPress, toggleChange, toggleValue}) => {

    renderSeta = () => {
        if (seta)
            return <Icon name="angle-right" size={18} color="#000"/>;
        if (toggle)
            return <Switch trackColor={{true: "#27ae60", false: null}} onValueChange={toggleChange} value={toggleValue}/>
        return null;
    }

    renderIcone = () => {
        if (icone)
            return <Icon name={icone} solid size={18} color="#000"/>
        return <Icon name="sign-out-alt" solid size={18} color="#fff"/>
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={toggle ? 1 : 0.2}>
            <View style={styles.flexRow}>
                {renderIcone()}
                <Text style={styles.texto}>{texto}</Text>
                {renderSeta()}
            </View>
        </TouchableOpacity>
    );
}

export default Opcao;

const styles = {
    container: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    texto: {
        fontSize: 16,
        color: '#000',
        flex: 1,
        marginLeft: 20
    }
}