import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';
import Input from '../../../../components/Input/Input'
import Sugestoes from '../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';


export default class EditarPerfil extends Network {

    static navigationOptions = {
        title: 'Editar perfil'
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            descricao: "",
            carregandoDados: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: ""
            },
            user: {},
            loading: false,
            cor_fundo: "",
            cor_texto: "",
            nome: "",
            sobre: ""
        }
    }

    componentDidMount(){
        this.setState({
            user: this.props.navigation.getParam("user", {})
        }, this.setDados)
    }

    setDados(){
        this.setState({
            nome: this.state.user.nome,
            descricao: this.state.user.descricao,
            cor_fundo: this.state.user.cor_fundo,
            cor_texto: this.state.user.cor_texto,
            sobre: this.state.user.sobre
        })
    }

    getModalClick(){
        this.setState({
            modal: {
                visible: false
            }
        })
    }

    async editarPerfilCliente(){
        let result = await this.callMethod("editarPerfil", { nome: this.state.nome, descricao: this.state.descricao, tipo_edicao: 'CLIENTE' });
        if (result.success){
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
    }

    async editarPerfilRestaurante(){
        let result = await this.callMethod("editarPerfil", { nome: this.state.nome, descricao: this.state.descricao, cor_fundo: this.state.cor_fundo, cor_texto: this.state.cor_texto, sobre: this.state.sobre, tipo_edicao: 'RESTAURANTE' });
        if (result.success){
            if (result.result == "PERFIL_ALTERADO"){
                this.props.navigation.state.params.onGoBack();
                this.props.navigation.goBack();
            } else {
                this.showModal("Ocorreu um erro", result.result);
            }
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
    }

    async editarPerfil(){
        this.setState({
            loading: true
        })
        if (this.state.user.is_restaurante){
            this.editarPerfilRestaurante();
        } else {
            this.editarPerfilCliente();
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

    renderCoresRestaurante(){
        if (this.state.user.is_restaurante){
            return (
                <View>
                    <Input label={"Cor de fundo"}
                        icone={"palette"}
                        onChangeText={(cor_fundo) => this.setState({cor_fundo})}
                        value={this.state.cor_fundo}
                        onSubmitEditing={() => this.terceiroInput.focus()}
                        autoCapitalize={"none"}
                        small={true}
                        blurOnSubmit={false}
                        maxLength={6}
                        returnKeyType={"next"}
                        hashtag={true}
                    />
                    <Input label={"Cor do texto"}
                        icone={"palette"}
                        inputRef={(input) => this.terceiroInput = input}
                        onChangeText={(cor_texto) => this.setState({cor_texto})}
                        value={this.state.cor_texto}
                        onSubmitEditing={() => this.quartoInput.focus()}
                        autoCapitalize={"none"}
                        small={true}
                        maxLength={6}
                        returnKeyType={"next"}
                        hashtag={true}
                    />
                </View>
            );
        }
        return null;
    }

    renderInformacoesRestaurante(){
        if (this.state.user.is_restaurante){
            return (
                <View style={[styles.container, styles.borderTop]}>
                    <View style={styles.infoRestaurante}>
                        <Icon name="info-circle" size={16} solid color="#000"/>
                        <Text style={styles.tituloInfoRestaurante}>Informações</Text>
                    </View>
                    <Input label={"Sobre"}
                            icone={"info-circle"}
                            inputRef={(input) => this.quartoInput = input}
                            onChangeText={(sobre) => this.setState({sobre})}
                            value={this.state.sobre}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={255}
                            returnKeyType={'none'}
                    />
                </View>
            );
        }
        return null;
    }

    render(){
        if (this.state.carregandoDados)
            return (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color="#27ae60" size="large"/>
                </View>
            );
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
                        <Input label={"Nome"}
                            icone={"user"}
                            onChangeText={(nome) => this.setState({nome})}
                            value={this.state.nome}
                            autoCapitalize={"words"}
                            onSubmitEditing={() => this.segundoInput.focus()}
                            small={true}
                            blurOnSubmit={false}
                            maxLength={60}
                            returnKeyType={'next'}
                        />
                        <Input label={"Descrição"}
                            icone={"comment"}
                            inputRef={(input) => this.segundoInput = input}
                            onChangeText={(descricao) => this.setState({descricao})}
                            value={this.state.descricao}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={255}
                            returnKeyType={'none'}
                        />
                        {this.renderCoresRestaurante()}
                        <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>A descrição ficará visível para quem acessar seu perfil.</Text>
                            {/* <Text style={{fontSize: 11, color: '#000'}}>Pode ficar tranquilo ;)</Text> */}
                        </View>
                        
                    </View>
                    {this.renderInformacoesRestaurante()}
                    <View style={styles.container}>
                        <View style={{marginBottom: 10}}>
                            <BotaoPequeno texto={"Confirmar"} onPress={() => this.editarPerfil()} loading={this.state.loading}/>
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
    },

    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    },

    infoRestaurante: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    tituloInfoRestaurante: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    }


}