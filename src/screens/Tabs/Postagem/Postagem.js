import React, { Component } from 'react';
import { View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import Network from '../../../network';
import Post from '../../../components/Post/Post';
import { ScrollView } from 'react-native-gesture-handler';
import ModalPostagemViewer from '../../../components/ModalPostagemViewer/ModalPostagemViewer';
import SemDados from '../../../components/SemDados/SemDados';

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
            itemSelecionado: {},
            naoEncontrado: false,
            semInternet: false
        }
    }

    componentDidMount(){
        this.getPostById();
    }

    async getPostById(){
        this.setState({
            refreshing: true
        })
        let id_post = this.props.navigation.getParam("id_post", "0");
        let result = await this.callMethod("getPostById", { id_post });
        if (result.success){
            if (result.result == "NAO_ENCONTRADO"){
                this.setState({
                    naoEncontrado: true,
                    loading: false,
                    refreshing: false
                })
            } else {
                this.setState({
                    post: result.result,
                    loading: false,
                    refreshing: false
                })
            }
        } else {
            this.setState({
                loading: false,
                semInternet: false,
                refreshing: false
            })
        }
    }

    voltarParaPerfil(){
        if (this.props.navigation.state.params.onGoBack){
            this.props.navigation.state.params.onGoBack();
        }
        this.props.navigation.goBack();
    }

    render(){
        if (this.state.loading){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color="#777" size="small" />
                </View>
            );
        }
        if (this.state.naoEncontrado)
            return <SemDados titulo={"Postagem não encontrada"} texto={"A postagem pode ter sido excluída."}/>
        if (this.state.semInternet)
            return <SemDados titulo={"Sem internet"} texto={"Verifique sua internet e tente novamente."}/>
        return (
            <View style={{flex: 1}}>
                <ModalPostagemViewer visible={this.state.modalFotoVisible}
                                    foto={this.state.itemSelecionado.foto}
                                    titulo={this.state.itemSelecionado.nome}
                                    imagens={this.state.itemSelecionado.conteudo}
                                    onSwipeDown={() => this.setState({modalFotoVisible: false})}
                                    onClose={() => this.setState({modalFotoVisible: false})}/>
                <ScrollView contentContainerStyle={{flexGrow: 1}}
                            style={{flex: 1}}
                            keyboardShouldPersistTaps={"handled"}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this.getPostById()}
                                />
                            }
                >
                    <Post onClickFoto={() => this.abrirFotos(this.state.post)}
                            data={this.state.post}
                            navigation={this.props.navigation}
                            onDelete={() => this.voltarParaPerfil()}
                            thumbnail={this.state.post.conteudo_qualidade_baixa}
                    />
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