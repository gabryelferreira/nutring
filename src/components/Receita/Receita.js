import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Linking, Modal } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../ImagemNutring/ImagemNutring';
import Loader from '../Loader/Loader';
import Modalzin from '../Modal/Modal';
import Network from '../../network'
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FotoPerfil from '../FotoPerfil/FotoPerfil';
import SemDadosPerfil from '../SemDadosPerfil/SemDadosPerfil';
import Galeria from '../Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';
import ModalPostagemViewer from '../ModalPostagemViewer/ModalPostagemViewer';

const Receita = (props) => {
    return (
        <View style={styles.flex}>
            <View style={styles.borderBottom}>
                <TouchableOpacity 
                    onPress={props.onPress}
                    style={[styles.dado, styles.flexRow, styles.justifySpaceBetween, styles.alignCenter]}>
                    <View style={[styles.flexRow, styles.alignCenter, styles.dadosPrincipais]}>
                        <View style={[styles.fotoReceita, styles.backgroundGray]}>
                            <Image resizeMethod="resize" style={styles.fotoReceita} source={{uri: props.receita.foto}}/>
                        </View>
                        <View style={styles.textos}>
                            <Text style={styles.titulo} numberOfLines={1}>{props.receita.titulo}</Text>
                            <Text style={styles.descricao} numberOfLines={3}>{props.receita.descricao}</Text>
                        </View>
                    </View>
                    <View style={{flex: .2, flexDirection: 'row',  justifyContent: 'flex-end'}}>
                        <Icon name="chevron-right" solid size={16} color="#aaa"/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Receita;



const styles = {
    fotoReceita: {
        width: 80,
        height: 80,
        borderRadius: 15
    },
    tituloReceita: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#000',
        fontSize: 14
    },
    flex: {
        flex: 1
    },
    dado: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flex: 1,
        backgroundColor: '#fff',
    },
    borderBottom: {
        borderBottomColor: '#ddd',
        borderBottomWidth: .6,
    },
    dadosPrincipais: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row'
    },
    alignCenter: {
        alignItems: 'center'
    },
    justifySpaceBetween: {
        justifyContent: 'space-between'
    },
    fotoReceita: {
        height: 60,
        width: 60,
        borderRadius: 60/2
    },
    textos: {
        marginLeft: 15,
        flex: 1
    },
    titulo: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 3
    },
    descricao: {
        color: '#000',
        fontSize: 14,
    },
    backgroundGray: {
        backgroundColor: '#eee'
    },
}