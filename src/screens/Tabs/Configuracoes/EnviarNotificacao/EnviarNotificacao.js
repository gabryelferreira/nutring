import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';
import Input from '../../../../components/Input/Input'
import Sugestoes from '../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';


export default class EnviarNotificacao extends Network {

    static navigationOptions = {
        title: 'Enviar notificação'
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            notificacaoEnviada: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: ""
            },
            loading: false,
            titulo: "",
            mensagem: ""
        }
    }

    componentDidMount(){
    }

    getModalClick(){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.notificacaoEnviada){
            this.props.navigation.goBack();
        }
    }

    async enviarNotificacao(){
        this.setState({
            loading: true
        })
        let result = await this.callMethod("enviarNotificacao", { titulo: this.state.titulo, mensagem: this.state.mensagem });
        if (result.success){
            if (result.result == "NOTIFICACAO_ENVIADA"){
                this.setState({
                    notificacaoEnviada: true
                })
                this.showModal("Notificação enviada", "Sua notificação foi enviada com sucesso para seus seguidores.");
            } else if (result.result == "NOTIFICACAO_ENVIADA"){
                this.showModal("Notificação falhou", "A notificação não foi enviada. Tente novamente mais tarde.");
            }
            
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
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
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.container}>
                    <Input label={"Título"}
                                icone={"comment"}
                            onChangeText={(titulo) => this.setState({titulo})}
                            value={this.state.titulo}
                            onSubmitEditing={() => this.segundoInput.focus()}
                            autoCapitalize={"sentences"}
                            small={true}
                            maxLength={255}
                            returnKeyType={"none"}
                        />
                        <Input label={"Descrição"}
                                icone={"comment"}
                                inputRef={(input) => this.segundoInput = input}
                            onChangeText={(mensagem) => this.setState({mensagem})}
                            value={this.state.mensagem}
                            onSubmitEditing={() => this.enviarNotificacao()}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={255}
                            returnKeyType={"none"}
                        />
                        <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>A notificação será enviada para todos seus seguidores.</Text>
                            {/* <Text style={{fontSize: 11, color: '#000'}}>Pode ficar tranquilo ;)</Text> */}
                        </View>
                        <View style={{marginVertical: 10}}>
                            <BotaoPequeno texto={"Confirmar"} onPress={() => this.enviarNotificacao()} loading={this.state.loading}/>
                        </View>
                    </View>
                </ScrollView>
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