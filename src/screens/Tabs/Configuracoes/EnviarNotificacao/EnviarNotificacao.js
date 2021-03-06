import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Image, PermissionsAndroid, CameraRoll, Platform, KeyboardAvoidingView, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;
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

const HEADER_HEIGHT = 50;

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
            planoNotificacao: false,
            seguidores: 0,
            disabled: true,
            carregandoInicial: true,
            semConexao: false,
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
        this.getNomeUsuarioById();
    }

    async getNomeUsuarioById(){
        let result = await this.callMethod("getNomeUsuarioESeguidores");
        if (result.success){
            this.setState({
                tituloNotificacao: result.result.nome,
                planoNotificacao: result.result.plano_notificacao,
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
                    <ActivityIndicator size="small" color="#777" />
                </View>
            );
        }
        if (this.state.semConexao){
            return <SemDados titulo={"Sem conexão"} texto={"Você está sem internet."}/>
        }
        if (!this.state.planoNotificacao){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30}}>
                    <Text style={{fontWeight: 'bold', color: '#000', fontSize: 20, textAlign: 'center'}}>
                        Notificação não permitida
                    </Text>
                    <Text style={{fontSize: 14, color: '#000', marginTop: 5, marginBottom: 20, textAlign: 'center'}}>
                        Você não possui permissão para enviar notificações. Para saber como enviar notificações, clique no botão abaixo.
                    </Text>
                    <BotaoPequeno texto={"Ver mais"} onPress={() => this.props.navigation.navigate("MeuPlano")}/>
                </View>
            );
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
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled={Platform.OS === 'ios' ? true : false}   keyboardVerticalOffset={this.state.statusBarHeight + HEADER_HEIGHT}>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                        <View style={styles.container}>
                            <Input label={"Título da notificação"}
                                icone={"comment"}
                                onChangeText={(tituloNotificacao) => this.setState({tituloNotificacao})}
                                value={this.state.tituloNotificacao}
                                autoCapitalize={"sentences"}
                                small={true}
                                maxLength={30}
                                returnKeyType={"default"}
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
                                numberOfLines={5}
                                maxLength={100}
                                returnKeyType={"send"}
                            />
                            <View style={{marginVertical: 5, flex: .7}}>
                                <Text style={{fontSize: 11, color: '#000'}}>A notificação será enviada para todos seus seguidores, portanto, tome <Text style={{color: 'red'}}>cuidado com o número de notificações enviadas.</Text></Text>
                            </View>
                            <View style={{marginVertical: 10, flexDirection: 'column', alignItems: 'flex-start'}}>
                                <BotaoPequeno disabled={this.state.disabled} texto={"Enviar"} textoLoading={"Enviando"} onPress={() => this.confirmarEnvio()} loading={this.state.loading}/>
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