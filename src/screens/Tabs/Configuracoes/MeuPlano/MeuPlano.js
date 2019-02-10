import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, WebView } from 'react-native';
import Network from '../../../../network';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class MeuPlano extends Network {

    static navigationOptions = {
        title: 'Meu Plano',
    };

    constructor(props){
        super(props);
        this.state = {
            carregandoInicial: true,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            planos: [],
        }
    }

    componentDidMount(){
        this.getPlanos();
    }

    async getPlanos(){
        let result = await this.callMethod("getPlanos");
        if (result.success){
            this.setState({
                planos: result.result,
                carregandoInicial: false,
                pagando: true
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
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Plano", { id_plano: plano.id_plano })} style={{backgroundColor: '#28b657'}}>
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

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    {this.returnPlanos()}
                </ScrollView>
            </View>
            // <WebView
            //     source={{uri: 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code=64636165BBBBC73EE4A37F9AD1B734D6'}}
            // />
        );
    }

}

const styles = {
    
}