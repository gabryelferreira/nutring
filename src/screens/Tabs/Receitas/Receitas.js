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

export default class Receitas extends Network {

    static navigationOptions = {
        title: 'Receitas'
    };

    constructor(props){
        super(props);
        this.state = {
            carregandoInicial: true,
            receitas: [],
            semMaisDados: false,
            refreshing: false
        }
    }

    componentDidMount(){
        let receitas = this.props.navigation.getParam("receitas", []);
        this.setState({
            receitas
        })
        // let id_usuario_perfil = this.props.navigation.getParam("id_usuario_perfil", null);
    }

    renderReceita(receita, index){
        return (
            <View style={{flex: 1}}>
                <Receita receita={receita} onPress={() => console.log("opa")}/>
            </View>
        );
    }

    getReceitas(){
        
    }

    render(){
        return (
            <FlatList
            data={this.state.receitas}
            keyExtractor={(item, index) => item.id_receita.toString()}
            // numColumns={1}
            renderItem={({item, index}) => this.renderReceita(item, index)}
            refreshing={this.state.refreshing}
            onRefresh={() => this.getReceitas()}
            // onEndReached={() => this.pegarDados()}
            // onEndReachedThreshold={0.5}
            // ListHeaderComponent={() => this.returnHeaderComponent()}
            // ListFooterComponent={() => this.returnFooterComponent()}
            />
        );
    }

}