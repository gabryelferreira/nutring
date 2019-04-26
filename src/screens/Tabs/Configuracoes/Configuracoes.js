import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FotoPerfil from '../../../components/FotoPerfil/FotoPerfil';
import Opcao from '../../../components/Opcao/Opcao';
import Separador from '../../../components/Separador/Separador';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Configuracoes extends Network {

    static navigationOptions = {
        title: 'Configurações'
    };

    constructor(props){
        super(props);
        this.state = {
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: this.criarBotoes()
            },
            navigation: this.props.navigation,
            isRestaurante: false,
            loading: true
        }
    }

    criarBotoes(){
        let botoes = [
            {chave: "SAIR", texto: "Sair", color: '#27ae60', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    getModalClick(key){
        this.setModalState(false);
        if (key == "SAIR"){
            this.deslogar();
        }
    }

    setModalState(visible){
        this.setState({
            modal: {
                visible: visible
            }
        })
    }

    componentDidMount(){
        this.isRestaurante();
    }

    async isRestaurante(){
        let result = await this.callMethod("isRestaurante");
        if (result.success){
            this.setState({
                isRestaurante: result.result,
                loading: false
            })
        } else {
            this.setState({
                loading: false
            })
        }
        
    }

    abrirConfirmacaoSair(){
        this.setState({
            modal: {
                visible: true,
                titulo: "Confirmar saída",
                subTitulo: "Tem certeza que deseja fazer logout do Nutring?",
                botoes: this.criarBotoes()
            }
        })
    }

    deslogar(){
        this.logoutUser();
    }

    renderNovaPromocao(){
        if (this.state.isRestaurante){
            return (
                <View>
                    <Opcao icone={"cart-plus"} texto={"Cadastrar promoção"} seta={true} onPress={() => this.props.navigation.navigate("NovaPromocao")}/>
                    <Opcao icone={"paper-plane"} texto={"Enviar notificação"} seta={true} onPress={() => this.props.navigation.navigate("EnviarNotificacao")}/>
                    <Opcao icone={"hand-holding-usd"} texto={"Meu plano"} seta={true} onPress={() => this.props.navigation.navigate("MeuPlano")}/>
                </View>
            );
        }
        return null;
    }

    render(){
        // if (this.state.loading){
        //     return (
        //         <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        //             <ActivityIndicator color="#777" size="small"/>
        //         </View>
        //     );
        // }
        return (
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.setState({modal: {visible: false}})}
                    botoes={this.state.modal.botoes}
                />
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    {this.renderNovaPromocao()}
                    {/* <Opcao icone={"user-circle"} texto={"Editar conta"} seta={true} onPress={() => this.props.navigation.navigate("EditarConta")}/> */}
                    <Opcao icone={"user-circle"} texto={"Alterar usuário"} onPress={() => this.props.navigation.navigate("AlterarUsuario")}/>
                    {/* <Opcao icone={"envelope"} texto={"Alterar email"} onPress={() => this.props.navigation.navigate("AlterarEmail")}/> */}
                    <Opcao icone={"lock"} texto={"Alterar senha"} onPress={() => this.props.navigation.navigate("AlterarSenha")}/>
                    {/* <Opcao icone={"question-circle"} texto={"Ajuda"} seta={true} onPress={() => this.props.navigation.navigate("Ajuda")}/> */}
                    {/* <Opcao icone={"key"} texto={"Privacidade"} seta={true} onPress={() => this.props.navigation.navigate("Privacidade")}/> */}
                    <Separador/>
                    {/* <Opcao icone={"external-link-alt"} texto={"Nutring Calorias"}/> */}
                    <Opcao icone={"sign-out-alt"} texto={"Sair"} onPress={() => this.abrirConfirmacaoSair()}/>
                        

                </ScrollView>
            </View>
        );
    }
}

const styles = {

}