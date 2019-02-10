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
            pagando: false,
            abrindoWebView: false
        }
    }

    componentDidMount(){
        let id_plano = this.props.navigation.getParam("id_plano", "");
        this.getPlano(id_plano);
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

    returnBotaoUpgrade(plano){
        if (plano.is_plano_atual){
            return <Text style={{color: '#28b657'}}>Esse é seu plano</Text>
        } else if (plano.id_plano != 1){
            if (!plano.is_plano_atual){
                return (
                    <TouchableOpacity style={{backgroundColor: '#28b657'}}>
                        <Text style={{color: '#fff'}}>Upgradezin</Text>
                    </TouchableOpacity>
                );
            }
        }
        return null;
    }

    returnPlanos(){
        return this.state.planos.map((plano) => {
            return (
                <View key={plano.id_plano} style={{flexDirection: 'row'}}>
                    <Text>{plano.nome}</Text>
                    {this.returnBotaoUpgrade(plano)}
                </View>
            );
        })
    }

    async abrirUpgrade(){
        this.setState({
            abrindoWebView: true
        })
        let result = await this.callMethod("getTokenPlanoPagSeguro", { id_plano: this.state.plano.id_plano });
        if (result.success){
            this.setState({
                pagSeguroUrl: this.state.pagSeguroUrl + result.result.code,
                pagando: true
            })
        }
    }

    returnBotaoUpgrade(){
        if (this.state.plano.is_plano_atual){
            return <Text style={{color: '#28b657'}}>Esse é seu plano</Text>
        } else if (this.state.plano.id_plano != 1){
            return (
                <BotaoPequeno texto={"Upgrade"} onPress={() => this.abrirUpgrade()} loading={this.state.abrindoWebView}/>
            );
        }
        return null;
    }

    render(){
        let { id_plano, nome, descricao, dt_expira, is_plano_atual } = this.state.plano;
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        if (this.state.pagando){
            return <WebView
                source={{uri: this.state.pagSeguroUrl}}
            />
        }
        return (
            <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Plano {nome}</Text>
                <Text>{descricao}</Text>
                {this.returnBotaoUpgrade()}
            </View>
        );
    }

}

const styles = {
    
}