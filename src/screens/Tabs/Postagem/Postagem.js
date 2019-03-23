import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Network from '../../../network';
import Post from '../../../components/Post/Post';
import { ScrollView } from 'react-native-gesture-handler';
import ModalPostagemViewer from '../../../components/ModalPostagemViewer/ModalPostagemViewer';

export default class Postagem extends Network {

    static navigationOptions = {
        title: 'Foto'
    };

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            post: {},
            modalFotoVisible: false,
            itemSelecionado: {}
        }
    }

    componentDidMount(){
        this.getPostById();
    }

    async getPostById(){
        let id_post = this.props.navigation.getParam("id_post", "0");
        let result = await this.callMethod("getPostById", { id_post });
        if (result.success){
            this.setState({
                post: result.result,
                loading: false
            })
        }
    }

    voltarParaPerfil(){
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

    render(){
        if (this.state.loading){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color="#28b657" size="large" />
                </View>
            );
        }
        return (
            <View style={{flex: 1}}>
                <ModalPostagemViewer visible={this.state.modalFotoVisible}
                                    foto={this.state.itemSelecionado.foto}
                                    titulo={this.state.itemSelecionado.nome}
                                    imagens={this.state.itemSelecionado.conteudo}
                                    onSwipeDown={() => this.setState({modalFotoVisible: false})}
                                    onClose={() => this.setState({modalFotoVisible: false})}/>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <Post onClickFoto={() => this.abrirFotos(this.state.post)} data={this.state.post} navigation={this.props.navigation} onDelete={() => this.voltarParaPerfil()}/>
                </ScrollView>
            </View>
        );
    }

    abrirFotos(item){
        console.log("item = ", item)
        let newItem = {};
        newItem["nome"] = item.nome;
        newItem["foto"] = item.foto;
        newItem["conteudo"] = item.conteudo;
        newItem.conteudo = newItem.conteudo.map(foto => {
            return foto.url_conteudo
        })
        this.setState({
            modalFotoVisible: true,
            itemSelecionado: newItem
        })
    }

}