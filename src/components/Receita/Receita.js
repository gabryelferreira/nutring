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
        <View style={styles.container}>
            <TouchableOpacity style={{flex: 1}} onPress={props.onPress}>
                <Image resizeMethod="resize" style={styles.fotoReceita} source={{uri: props.receita.foto}}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.tituloReceita}>{props.receita.nome}</Text>
            </TouchableOpacity>
            {/* <Text style={styles.avaliacaoReceita}></Text> */}
        </View>
    );
}

export default Receita;



const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
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
    }
}