import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import Network from '../../../../../network';
import Opcao from '../../../../../components/Opcao/Opcao';
import Input from '../../../../../components/Input/Input'
import Sugestoes from '../../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../../components/Modal/Modal';


export default class AlterarEmail extends Network {

    static navigationOptions = {
        title: 'Alterar email'
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            emailAtual: "",
            emailNovo: "",
            emailAlterado: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: ""
            },
            loading: false
        }
    }

    getModalClick(){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.emailAlterado){
            this.props.navigation.goBack(null);
        }
    }

    validarDados(){
        if (!this.state.emailAtual.trim() || !this.state.emailNovo.trim()){
            this.showModal("Campos inválidos", "Preencha todos os campos corretamente para alterar seu email.");
            return false;
        }
        return true;
    }

    async alterarEmail(){
        if (this.validarDados()){
            this.setState({
                loading: true
            })
            let result = await this.callMethod("alterarEmail", { emailAtual: this.state.emailAtual, emailNovo: this.state.emailNovo });
            if (result.success){
                if (result.result == "INVALIDO"){
                    this.showModal("Campos inválidos", "Preencha os campos corretamente para poder alterar seu email.");
                } else if (result.result == "EMAIL_ALTERADO"){
                    this.setState({
                        emailAlterado: true
                    })
                    this.showModal("Email alterado", "Seu email foi alterado com sucesso.");
                } else if (result.result == "EMAIL_INCORRETO"){
                    this.showModal("Email incorreto", "Coloque o seu email atual correto para poder alterá-lo.");
                } else if (result.result == "EMAIL_IGUAL"){
                    this.showModal("Email inválido", "O email solicitado é o mesmo do seu usário atual.");
                } else if (result.result == "EMAIL_EXISTE"){
                    this.showModal("Email existe", "O email solicitado já se encontra cadastrado em nosso sistema.");
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
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={64}>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                        <View style={styles.container}>
                            <Input label={"Email atual"} icone={"envelope"}
                                onChangeText={(emailAtual) => this.setState({emailAtual})}
                                value={this.state.emailAtual}
                                returnKeyType={'next'}
                                onSubmitEditing={() => this.segundoInput.focus()}
                                blurOnSubmit={false}
                                autoCapitalize={"none"}
                                small={true}
                                maxLength={100}
                            />
                            <Input label={"Novo email"} 
                                    inputRef={(input) => {this.segundoInput = input}}
                                    icone={"envelope"}
                                onChangeText={(emailNovo) => this.setState({emailNovo})}
                                value={this.state.emailNovo}
                                onSubmitEditing={() => this.alterarEmail()}
                                autoCapitalize={"none"}
                                small={true}
                                maxLength={100}
                            />
                            <View style={{marginVertical: 5, flex: .7}}>
                                <Text style={{fontSize: 11, color: '#000'}}>Seu email não será mostrado em seu perfil do Nutring.</Text>
                                <Text style={{fontSize: 11, color: '#000'}}>Pode ficar tranquilo ;)</Text>
                            </View>
                            <View style={{marginVertical: 10, flexDirection: 'column', alignItems: 'flex-start'}}>
                                <BotaoPequeno texto={"Confirmar"} textoLoading={"Alterando"} onPress={() => this.alterarEmail()} loading={this.state.loading}/>
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