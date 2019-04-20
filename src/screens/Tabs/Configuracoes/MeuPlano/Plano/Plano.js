import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, WebView } from 'react-native';
import Network from '../../../../../network';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Plano extends Network {

    static navigationOptions = {
        title: 'Plano',
    };

    constructor(props){
        super(props);
        this.state = {
            pagSeguroUrl: "https://pagseguro.uol.com.br/v2/checkout/payment.html?code=",
            carregandoInicial: true,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            plano: {},
            assinando: false,
        }
    }

    componentDidMount(){
        let plano = this.props.navigation.getParam("plano", {});
        this.getPlano(plano.id_plano);
    }

    async getPlano(id_plano){
        let result = await this.callMethod("getPlano", { id_plano });
        if (result.success){
            this.setState({
                plano: result.result,
                carregandoInicial: false
            })
        }
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (key == "ENVIAR"){
        }
    }

    async enviarNotificacao(){
        
    }

    showModal(titulo, subTitulo, botoes){
        this.setState({
            modal: {
                visible: true,
                titulo: titulo,
                subTitulo: subTitulo,
                botoes: botoes
            }
        })
    }

    criarBotoes(){
        let botoes = [
            {chave: "ENVIAR", texto: "Confirmar", color: '#28b657', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }


    render(){
        let { id_plano, nome, descricao, dt_expira, is_plano_atual } = this.state.plano;
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color="#777" />
                </View>
            );
        }
        return (
            <View style={{flex: 1, backgroundColor: '#000'}}>
                
            </View>
        );
    }

}

const styles = {
    
}