import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Linking, Modal } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FotoPerfil from '../../../components/FotoPerfil/FotoPerfil';
import SemDadosPerfil from '../../../components/SemDadosPerfil/SemDadosPerfil';
import Galeria from '../../../components/Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';
import ModalPostagemViewer from '../../../components/ModalPostagemViewer/ModalPostagemViewer';
import Receita from '../../../components/Receita/Receita';
import SemDados from '../../../components/SemDados/SemDados';

export default class Receitas extends Network {

    static navigationOptions = {
        title: 'Receitas'
    };

    id_usuario_perfil = 0;
    offset = 0;
    limit = 20;
    semMaisDados = false;
    carregando = false;

    constructor(props){
        super(props);
        this.state = {
            carregandoInicial: true,
            receitas: [],
            refreshing: false,
            loading: false
        }
    }

    componentDidMount(){
        this.id_usuario_perfil = this.props.navigation.getParam("id_usuario_perfil", 0);
        this.carregarDadosIniciais();
    }

    carregarDadosIniciais(){
        this.offset = 0;
        this.semMaisDados = false;
        this.setState({
            refreshing: true
        }, this.getReceitas)
    }

    deletarReceita(id_receita){
        let receitas = this.state.receitas.filter(receita => {
            return receita.id_receita != id_receita
        })
        this.setState({
            receitas
        })
    }

    renderReceita(receita, index){
        return (
            <View style={{flex: 1}}>
                <Receita receita={receita} onPress={() => this.props.navigation.navigate("VerReceita", {
                    id_receita: receita.id_receita,
                    onDelete: (id_receita) => this.deletarReceita(id_receita)
                })}/>
            </View>
        );
    }

    async getReceitas(){
        if (!this.carregando){
            this.carregando = true;
            this.setState({
                loading: true
            })
            console.log("id_usuario perfil aqui eh " + this.id_usuario_perfil)
            let result = await this.callMethod("getReceitas", { id_usuario_perfil: this.id_usuario_perfil, offset: this.offset, limit: this.limit });
            this.setState({
                carregandoInicial: false,
                refreshing: false
            })
            if (result.success){
                if (result.result.length < this.limit){
                    this.semMaisDados = true;
                }
                let receitas = [];
                if (this.offset > 0){
                    receitas = this.state.receitas;
                }
                for (var i = 0; i < result.result.length; i++){
                    receitas.push(result.result[i]);
                }
                this.setState({
                    receitas
                })
            }
            this.setState({
                loading: false
            })
            this.carregando = false;
        }
    }

    pegarDados(){
        if (!this.semMaisDados && !this.carregando){
            this.offset += this.limit;
            this.setState({
                loading: true
            }, this.getReceitas);
        }
    }

    returnFooterComponent(){
        if (this.state.receitas.length > 0 && this.state.loading){
            return <ActivityIndicator color="#27ae60" size="large" style={{  marginVertical: 10 }}/>
        }
        return null;
    }

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        if (this.state.receitas.length == 0){
            return <SemDados titulo={"Sem receitas"} texto={"O usuário não possui receitas."}/>
        }
        return (
            <FlatList
            data={this.state.receitas}
            keyExtractor={(item, index) => item.id_receita.toString()}
            // numColumns={1}
            renderItem={({item, index}) => this.renderReceita(item, index)}
            refreshing={this.state.refreshing && !this.state.carregandoInicial}
            onRefresh={() => this.getReceitas()}
            onEndReached={() => this.pegarDados()}
            onEndReachedThreshold={0.5}
            // ListHeaderComponent={() => this.returnHeaderComponent()}
            ListFooterComponent={() => this.returnFooterComponent()}
            />
        );
    }

}