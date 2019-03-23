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
            receitas: [
                {id_receita: 1, foto: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/09C2/production/_95189420_plate-1968011_1920.jpg', nome: 'Café da Manhã'},
                {id_receita: 2, foto: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/09C2/production/_95189420_plate-1968011_1920.jpg', nome: 'Salada Mista'},
                {id_receita: 3, foto: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/09C2/production/_95189420_plate-1968011_1920.jpg', nome: 'Torrada c/ Ovo'},
                {id_receita: 4, foto: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/09C2/production/_95189420_plate-1968011_1920.jpg', nome: 'Cereais Proteicos'},
                {id_receita: 5, foto: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/09C2/production/_95189420_plate-1968011_1920.jpg', nome: 'Suco de Açaí'},
                {id_receita: 6, foto: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/09C2/production/_95189420_plate-1968011_1920.jpg', nome: 'Massa Integral'},
            ],
            semMaisDados: false,
            refreshing: false
        }
    }

    renderReceita(receita, index){
        return (
            <View style={{flex: .33, marginVertical: 20}}>
                <Receita receita={receita} onPress={() => console.log("opa")}/>      
            </View>
        );
    }

    render(){
        return (
            <FlatList
            data={this.state.receitas}
            keyExtractor={(item, index) => item.id_receita.toString()}
            numColumns={3}
            renderItem={({item, index}) => this.renderReceita(item, index)}
            refreshing={this.state.refreshing}
            // onRefresh={() => this.getPerfil()}
            // onEndReached={() => this.pegarDados()}
            // onEndReachedThreshold={0.5}
            // ListHeaderComponent={() => this.returnHeaderComponent()}
            // ListFooterComponent={() => this.returnFooterComponent()}
            />
        );
    }

}