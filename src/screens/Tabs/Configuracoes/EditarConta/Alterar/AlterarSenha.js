import React, { Component } from 'react';
import { View, Text, TouchableOpacity, NativeModules, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
const { StatusBarManager } = NativeModules;
import Network from '../../../../../network';
import Opcao from '../../../../../components/Opcao/Opcao';
import Input from '../../../../../components/Input/Input'
import Sugestoes from '../../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../../components/Modal/Modal';

const HEADER_HEIGHT = 50;

export default class AlterarSenha extends Network {

    static navigationOptions = {
        title: 'Alterar senha'
    };

    segundoInput;
    terceiroInput;

    constructor(props){
        super(props);
        this.state = {
            senhaAtual: "",
            novaSenha: "",
            repetirSenha: "",
            senhaAlterada: false,
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
        if (this.state.senhaAlterada){
            this.props.navigation.goBack(null);
        }
    }

    validarDados(){
        if (!this.state.senhaAtual.trim() || !this.state.novaSenha.trim() || !this.state.repetirSenha.trim()){
            this.showModal("Campos inválidos", "Preencha todos os campos corretamente para alterar sua senha.");
            return false;
        }
        return true;
    }

    async alterarSenha(){
        if (this.validarDados()){
            this.setState({
                loading: true
            })
            let result = await this.callMethod("alterarSenha", { senhaAtual: this.state.senhaAtual, novaSenha: this.state.novaSenha, repetirSenha: this.state.repetirSenha });
            if (result.success){
                if (result.result == "INVALIDO"){
                    this.showModal("Campos inválidos", "Preencha os campos corretamente para poder alterar sua senha.");
                } else if (result.result == "SENHA_ALTERADA"){
                    this.setState({
                        senhaAlterada: true
                    })
                    this.showModal("Senha alterada", "Sua senha foi alterada com sucesso.");
                } else if (result.result == "SENHA_INCORRETA"){
                    this.showModal("Senha incorreta", "Coloque a sua senha atual correta para poder alterá-la.");
                } else if (result.result == "SENHA_DIFERENTE"){
                    this.showModal("Senhas não coincidem", "O campo de confirmar a senha não.");
                } else if (result.result == "SENHA_IGUAL"){
                    this.showModal("Senha inválida", "A senha solicitada é a mesma da sua senha atual.");
                }
            } else {
                this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
            }
            this.setState({
                loading: false
            })
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
                    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}  keyboardShouldPersistTaps={"handled"}>
                        <View style={styles.container}>
                            <Input label={"Senha atual"} icone={"lock"}
                                onChangeText={(senhaAtual) => this.setState({senhaAtual})}
                                value={this.state.senhaAtual}
                                returnKeyType={'next'}
                                onSubmitEditing={() => this.segundoInput.focus()}
                                blurOnSubmit={false}
                                autoCapitalize={"none"}
                                secureTextEntry={true}
                                small={true}
                            />
                            <Input label={"Nova senha"} 
                                    inputRef={(input) => {this.segundoInput = input}}
                                    icone={"lock"}
                                onChangeText={(novaSenha) => this.setState({novaSenha})}
                                value={this.state.novaSenha}
                                onSubmitEditing={() => this.terceiroInput.focus()}
                                autoCapitalize={"none"}
                                blurOnSubmit={false}
                                secureTextEntry={true}
                                small={true}
                            />
                            <Input label={"Confirme a nova senha"} 
                                    inputRef={(input) => {this.terceiroInput = input}}
                                    icone={"lock"}
                                onChangeText={(repetirSenha) => this.setState({repetirSenha})}
                                value={this.state.repetirSenha}
                                onSubmitEditing={() => this.alterarSenha()}
                                autoCapitalize={"none"}
                                secureTextEntry={true}
                                small={true}
                            />
                            <View style={{marginVertical: 10, flexDirection: 'column', alignItems: 'flex-start'}}>
                                <BotaoPequeno texto={"Alterar"} textoLoading={"Alterando"} onPress={() => this.alterarSenha()} loading={this.state.loading}/>
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