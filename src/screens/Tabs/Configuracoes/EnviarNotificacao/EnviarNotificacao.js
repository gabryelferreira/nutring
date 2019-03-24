import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Image, PermissionsAndroid, CameraRoll } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';
import Input from '../../../../components/Input/Input'
import Sugestoes from '../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Galeria from '../../../../components/Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';
import SemDados from '../../../../components/SemDados/SemDados';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class EnviarNotificacao extends Network {

    static navigationOptions = {
        title: 'Enviar notificação',
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            notificacaoEnviada: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            loading: false,
            tituloNotificacao: "",
            descricaoNotificacao: "",
            permissaoNotificacao: false,
            seguidores: 0,
            disabled: true,
            carregandoInicial: true,
            semConexao: false
        }
    }

    componentDidMount(){
        this.getNomeUsuarioById();
    }

    async getNomeUsuarioById(){
        let result = await this.callMethod("getNomeUsuarioESeguidores");
        if (result.success){
            this.setState({
                tituloNotificacao: result.result.nome,
                permissaoNotificacao: result.result.permissao_notificacao,
                seguidores: result.result.seguidores,
                disabled: false,
                carregandoInicial: false
            })
        } else {
            this.setState({
                semConexao: true
            })
        }
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.notificacaoEnviada){
            this.props.navigation.goBack();
        }
        if (key == "ENVIAR"){
            this.setState({
                loading: true
            }, this.enviarNotificacao);
        }
    }

    async enviarNotificacao(){
        let result = await this.callMethod("enviarNotificacao", { mensagem: this.state.descricaoNotificacao });
        if (result.success){
            if (result.result == "NOTIFICACAO_ENVIADA"){
                this.setState({
                    notificacaoEnviada: true,
                    loading: false
                })
                this.showModal("Notificação enviada", "Sua notificação foi enviada com sucesso para seus seguidores.");
            } else if (result.result == "NOTIFICACAO_FALHOU"){
                this.showModal("Sua notificação falhou", "Não foi possível enviar sua notificação para seus seguidores. Entre em contato com o suporte para mais informações.");
            }
            this.setState({
                loading: false
            })
        } else {
            this.showModal("Ocorreu um erro", "Sua notificação falhou ao ser enviada. Entre em contato com o suporte para mais informações.");
            this.setState({
                loading: false
            })
        }
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

    confirmarEnvio(){
        if (!this.state.descricaoNotificacao){
            this.showModal("Descrição da notificação obrigatória", "Para enviar uma notificação, é necessário colocar uma descrição.");
        }
        this.showModal("Confirmação de envio", "Deseja enviar uma notificação para seus " + this.state.seguidores + " seguidores?", this.criarBotoesExclusao());
    }

    criarBotoesExclusao(){
        let botoes = [
            {chave: "ENVIAR", texto: "Confirmar", color: '#28b657', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        if (this.state.semConexao){
            return <SemDados titulo={"Sem conexão"} texto={"Você está sem internet."}/>
        }
        if (!this.state.permissaoNotificacao){
            return <SemDados titulo={"Notificação não permitida"} texto={"Parece que você já enviou suas notificações diárias."}/>
        }
        return (
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.getModalClick()}
                    botoes={this.state.modal.botoes}
                />
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.container}>
                        <Input label={"Título da notificação"}
                            icone={"comment"}
                            onChangeText={(tituloNotificacao) => this.setState({tituloNotificacao})}
                            value={this.state.tituloNotificacao}
                            autoCapitalize={"sentences"}
                            small={true}
                            maxLength={30}
                            returnKeyType={"none"}
                            disabled={true}
                            />
                        <Input label={"Descrição da notificação"}
                            icone={"comment"}
                            onChangeText={(descricaoNotificacao) => this.setState({descricaoNotificacao})}
                            value={this.state.descricaoNotificacao}
                            onSubmitEditing={() => this.confirmarEnvio()}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={100}
                            returnKeyType={"send"}
                        />
                        <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>A notificação será enviada para todos seus seguidores.</Text>
                        </View>
                        <View style={{marginVertical: 10}}>
                            <BotaoPequeno disabled={this.state.disabled} texto={"Confirmar"} onPress={() => this.confirmarEnvio()} loading={this.state.loading}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = {
    container: {
        paddingBottom: 10,
        paddingHorizontal: 15
    },
    imagem: {
        width: imageWidth,
        maxHeight: 300,
        minHeight: 250,
        backgroundColor: '#eee'
    }
}