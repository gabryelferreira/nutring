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

    renderRecente = () => {
        if (props.receita.recente)
            return (
                <View style={{marginTop: 5, paddingHorizontal: 8, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', borderRadius: 4, borderColor: '#ddd', borderWidth: 0.7}}>
                    <Text style={{color: '#28b657', fontSize: 10}}>RECENTE</Text>
                </View>
            )
        return null;
    }

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
                            {renderRecente()}
                        </View>
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
        height: 48,
        width: 48,
        borderRadius: 48/2
    },
    textos: {
        marginLeft: 15,
        flex: 1
    },
    titulo: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 3
    },
    descricao: {
        color: '#777',
        fontSize: 14,
    },
    backgroundGray: {
        backgroundColor: '#eee'
    },
}