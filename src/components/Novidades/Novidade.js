import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import { ScrollView } from 'react-native-gesture-handler';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Novidade extends Network {

    constructor(props){
        super(props);
        this.state = {
            novidade: this.props.novidade,
            navigation: this.props.navigation,
            novidades: []
        }
    }

    async getNovidades(){
        let result = await this.callMethod("getNovidades");
        if (result.success){
            this.setState({
                novidades: result.result
            })
        }
    }

    setSelecionado(){
        this.setState({
            novidade: {
                titulo: this.state.novidade.titulo,
                filtro: this.state.novidade.filtro,
                selecionado: !this.state.novidade.selecionado
            }
        })
    }

    render(){
        let { titulo, filtro } = this.state.novidade;
        return (
            <TouchableOpacity style={[!this.state.novidade.selecionado ? styles.botao : [styles.botao, styles.botaoVerde]]} onPress={() => this.setSelecionado()}>
                <Text style={[!this.state.novidade.selecionado ? styles.textoBotao : styles.textoBotaoBranco]}>{titulo}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = {
    botao: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000',
        marginRight: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botaoVerde: {
        backgroundColor: '#28b657',
        borderColor: '#28b657'
    },
    textoBotao: {
        color: '#000'
    },
    textoBotaoBranco: {
        color: '#fff'
    }
}