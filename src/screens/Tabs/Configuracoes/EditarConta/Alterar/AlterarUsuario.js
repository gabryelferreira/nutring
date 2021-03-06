import React, { Component } from 'react';
import { View, Text, TouchableOpacity, NativeModules, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
const { StatusBarManager } = NativeModules;
import Network from '../../../../../network';
import Opcao from '../../../../../components/Opcao/Opcao';
import Input from '../../../../../components/Input/Input'
import Sugestoes from '../../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../../components/Modal/Modal';
import { validarCNPJ, validarData, validarCampo } from '../../../../../validacoes';


const HEADER_HEIGHT = 50;

export default class AlterarUsuario extends Network {

    static navigationOptions = {
        title: 'Alterar usuário'
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            usuarioAtual: "",
            usuarioNovo: "",
            usuarioAlterado: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: ""
            },
            loading: false,
            statusBarHeight: 20
        }
    }

    componentDidMount(){
        if (Platform.OS === 'ios'){
            StatusBarManager.getHeight(statusBar => {
                this.setState({
                    statusBarHeight: statusBar.height
                });
            });
        }
    }

    getModalClick(){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.usuarioAlterado){
            this.props.navigation.goBack(null);
        }
    }

    validarDados(){
        this.campoErro = "";
        let campos = [
            {campo: "usuarioAtual", texto: "Usuário atual", obrigatorio: true, validador: "usuario"},
            {campo: "usuarioNovo", texto: "Novo usuário", obrigatorio: true, validador: "usuario"},
        ];
        for (var i = 0; i < campos.length; i++){
            if (campos[i].obrigatorio){
                if (this.state[campos[i].campo].length == 0){
                    this.campoErro = "O campo " + campos[i].texto + " é obrigatório.";
                    return false;
                }
                if (campos[i].validador){
                    if (!validarCampo(campos[i].validador, this.state[campos[i].campo])){
                        this.campoErro = "O usuário é inválido. Ele precisa ter no mínimo 6 caracteres e são válidos letras, números e os caracteres .-_";
                        return false;
                    }
                }
            }
        }
        return true;
    }

    async alterarUsuario(){
        console.log("validar dados = ", this.validarDados());
        if (this.validarDados()){
            this.setState({
                loading: true
            })
            let result = await this.callMethod("alterarUsuario", { usuarioAtual: this.state.usuarioAtual, usuarioNovo: this.state.usuarioNovo });
            if (result.success){
                if (result.result == "INVALIDO"){
                    this.showModal("Campos inválidos", "Preencha os campos corretamente para poder alterar seu usuário.");
                } else if (result.result == "USUARIO_ALTERADO"){
                    this.setState({
                        usuarioAlterado: true
                    })
                    this.showModal("Usuário alterado", "Seu nome de usuário foi alterado com sucesso.");
                } else if (result.result == "USUARIO_INCORRETO"){
                    this.showModal("Usuário incorreto", "Coloque o seu nome de usuário atual correto para poder alterá-lo.");
                } else if (result.result == "USUARIO_IGUAL"){
                    this.showModal("Usuário inválido", "O nome de usuário solicitado é o mesmo do seu usuário atual.");
                } else if (result.result == "USUARIO_EXISTE"){
                    this.showModal("Usuário existe", "O nome de usuário solicitado já se encontra cadastrado em nosso sistema.");
                }
            } else {
                this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
            }
            this.setState({
                loading: false
            })
        } else {
            this.showModal("Verifique os campos", this.campoErro);
        }
    }

    showModal(titulo, subTitulo){
        this.setState({
            modal: {
                visible: true,
                titulo: titulo,
                subTitulo: subTitulo
            }
        })
    }


    render(){
        return (
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={() => this.getModalClick()}
                    onClose={() => this.getModalClick()}
                />
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled={Platform.OS === 'ios' ? true : false}   keyboardVerticalOffset={this.state.statusBarHeight + HEADER_HEIGHT}>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                        <View style={styles.container}>
                            <Input label={"Usuário atual"} icone={"user-circle"}
                                onChangeText={(usuarioAtual) => this.setState({usuarioAtual})}
                                value={this.state.usuarioAtual}
                                returnKeyType={'next'}
                                onSubmitEditing={() => this.segundoInput.focus()}
                                blurOnSubmit={false}
                                autoCapitalize={"none"}
                                small={true}
                                maxLength={30}
                            />
                            <Input label={"Novo usuário"} 
                                    inputRef={(input) => {this.segundoInput = input}}
                                    icone={"user-circle"}
                                onChangeText={(usuarioNovo) => this.setState({usuarioNovo})}
                                value={this.state.usuarioNovo}
                                onSubmitEditing={() => this.alterarUsuario()}
                                autoCapitalize={"none"}
                                small={true}
                                maxLength={30}
                            />
                            <View style={{marginVertical: 5, flex: .7}}>
                                <Text style={{fontSize: 11, color: '#000'}}>O usuário é usado para ser marcado em publicações.</Text>
                            </View>
                            <View style={{marginVertical: 10, flexDirection: 'column', alignItems: 'flex-start'}}>
                                <BotaoPequeno texto={"Alterar"} textoLoading={"Alterando"} onPress={() => this.alterarUsuario()} loading={this.state.loading}/>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

}

const styles = {
    container: {
        paddingVertical: 10,
        paddingHorizontal: 15
    }
}