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

export default class NovaReceita extends Network {

    static navigationOptions = {
        title: 'Postar Receita',
    };

    constructor(props){
        super(props);
        this.state = {
            carregando: false
        }
    }

    render(){
        return (
            <View>
                <Text>oi</Text>
            </View>
        );
    }

}