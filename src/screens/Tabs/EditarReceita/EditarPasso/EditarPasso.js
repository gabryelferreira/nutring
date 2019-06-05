import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, NativeModules, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Linking, Modal, Platform, KeyboardAvoidingView } from 'react-native';
const { StatusBarManager } = NativeModules;
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../../components/Loader/Loader';
import Modalzin from '../../../../components/Modal/Modal';
import Network from '../../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FotoPerfil from '../../../../components/FotoPerfil/FotoPerfil';
import SemDadosPerfil from '../../../../components/SemDadosPerfil/SemDadosPerfil';
import Galeria from '../../../../components/Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';
import Input from '../../../../components/Input/Input';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import DraggableFlatList from 'react-native-draggable-flatlist'

const HEADER_HEIGHT = 50;

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;
export default class EditarPasso extends Network {

    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam("dados", null) ? (navigation.getParam("tipo", null) == 'EDITAR_DADOS' ? 'Editar Receita' : 'Editar Passo') : 'Novo Passo',
        headerRight: (
            navigation.getParam("tipo", null) == 'EDITAR_PASSO' ? (
                <TouchableOpacity onPress={navigation.getParam("onTrashClick")} style={{paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: 20}}>
                    <Icon name="trash-alt" solid color="#000" size={18}/>
                </TouchableOpacity>
            ) : (
                <View></View>
            )
        )
    });

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            promocaoFinalizada: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            loading: false,
            carregandoInicial: true,
            titulo: "",
            descricao: "",
            foto: "",
            key: "",
            fotoNoServidor: false,
            permissaoGaleria: false,
            fotosGaleria: [],
            galeriaAberta: false,
            dados: {
                foto: "",
                titulo: "",
                descricao: "",
                key: "",
                fotoNoServidor: false,
                id_receita: null
            },
            id_receita: null,
            statusBarHeight: 20
        }
    }

    componentDidMount(){
        if (Platform.OS === 'ios'){
            StatusBarManager.getHeight(statusBar => {
                this.setState({
                    statusBarHeight: statusBar.height
                });
            });
        }
        this.props.navigation.setParams({
            onTrashClick: this.abrirModalDeletar.bind(this)
        })
        let dados = this.props.navigation.getParam("dados", {
            foto: "",
            titulo: "",
            descricao: "",
            key: "",
            fotoNoServidor: false,
            id_receita: null
        });
        this.setState({
            foto: dados.foto,
            titulo: dados.titulo,
            descricao: dados.descricao,
            key: dados.key,
            fotoNoServidor: dados.fotoNoServidor,
            id_receita: dados.id_receita
        })
    }

    componentWillUnmount() {
        this.props.navigation.setParams({
            onTrashClick: null,
        })
    }

    abrirModalDeletar(){
        this.showModal("Excluir passo", "Tem certeza que deseja excluir o passo?", this.criarBotoesExclusao())
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (key == "EXCLUIR"){
            let dados = {
                foto: this.state.foto,
                titulo: this.state.titulo,
                descricao: this.state.descricao,
                key: this.state.key,
                fotoNoServidor: this.state.fotoNoServidor
            }
            this.props.navigation.state.params.onDeletePasso(dados);
            this.props.navigation.goBack();
        }
    }

    showModal(titulo, subTitulo, botoes){
        this.setState({
            modal: {
                visible: true,
                titulo: titulo,
                subTitulo: subTitulo,
                botoes: botoes
            }
        })
    }

    confirmar(){
        let dados = {
            foto: this.state.foto,
            titulo: this.state.titulo,
            descricao: this.state.descricao,
            key: this.state.key,
            fotoNoServidor: this.state.fotoNoServidor,
            id_receita: this.state.id_receita
        }
        if (!dados.foto){
            this.showModal("Foto obrigatória", "Clique em alterar foto para selecionar uma foto da sua galeria.");
        } else if (!dados.titulo.trim()){
            this.showModal("Título obrigatório", "Escreva no campo título para poder avançar.");
        } else if (!dados.descricao.trim()){
            this.showModal("Descrição obrigatória", "Escreva no campo descrição para poder avançar.");
        } else {
            this.props.navigation.state.params.onGoBack(dados, this.props.navigation.getParam("tipo", null));
            this.props.navigation.goBack();
        }
    }

    criarBotoesExclusao(){
        let botoes = [
            {chave: "EXCLUIR", texto: "Excluir", color: '#DC143C', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    async requisitarPermissaoGaleria() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permissão da galeria',
              message:
                'Precisamos da sua permissão para acessar a galeria',
              buttonNeutral: 'Perguntar depois',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            this.setState({
                permissaoGaleria: true
            })
            this.abrirGaleria();
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
    }

    abrirGaleria(){
        let obj = {};
        if (Platform.OS === 'ios'){
            obj = {
                first: 100,
                assetType: "Photos",
                groupTypes: "All"
            }
        } else {
            obj = {
                first: 100,
                assetType: "Photos"
            }
        }
        CameraRoll.getPhotos(obj)
        // .then(r => this.setState({ photos: r.edges }))
        .then(r => {
            let fotos = [];
            for (var i = 0; i < r.edges.length; i++){
                fotos.push(r.edges[i].node.image.uri)
            }
            this.setState({
                galeriaAberta: true,
                fotosGaleria: fotos
            })
        })
    }

    returnImagemPublicacao(foto){
        if (foto){
            return <Image resizeMethod="resize" style={{width: undefined, height: undefined, flex: 1}} source={{uri: foto}}/>
        } else {
            return null;
        }
    }

    alterarFoto(foto){
        this.setState({foto, galeriaAberta: false, fotoNoServidor: false})
    }

    render(){        
        if (this.state.galeriaAberta){
            return <Galeria fotos={this.state.fotosGaleria} onPress={(foto) => this.alterarFoto(foto)} onClose={() => this.setState({galeriaAberta: false})}/>
        }
        return (
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.getModalClick()}
                    botoes={this.state.modal.botoes}
                />
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled={Platform.OS === 'ios' ? true : false}   keyboardVerticalOffset={this.state.statusBarHeight + HEADER_HEIGHT}>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                        <View style={styles.imagem}>
                            {this.returnImagemPublicacao(this.state.foto)}
                            <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, .1)', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                <TouchableOpacity onPress={() => {
                                        Platform.OS === 'ios' ? this.abrirGaleria() : this.requisitarPermissaoGaleria()
                                    }}
                                        style={{
                                        paddingHorizontal: 10, 
                                        paddingVertical: 3, 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        borderWidth: 1, 
                                        borderColor: '#eee',
                                        backgroundColor: 'rgba(0, 0, 0, .3)',
                                        marginRight: 10,
                                        marginBottom: 10,
                                        borderRadius: 20
                                    }}>
                                        <Text style={{fontSize: 10, color: '#eee', fontWeight: 'bold'}}>Alterar foto</Text>
                                    </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.container}>
                            <Input label={"Título"}
                                    placeholder={this.props.navigation.getParam("dados", null) ? (this.props.navigation.getParam("tipo", null) == 'EDITAR_DADOS' ? 'Escolha um título para sua receita' : 'Escolha um título para o passo') : 'Escolha um título para o passo'}
                                    icone={"comment"}
                                    onChangeText={(titulo) => this.setState({titulo})}
                                    value={this.state.titulo}
                                    onSubmitEditing={() => this.segundoInput.focus()}
                                    autoCapitalize={"sentences"}
                                    blurOnSubmit={false}
                                    small={true}
                                    maxLength={30}
                                    returnKeyType={"next"}
                                />
                            <Input label={"Descrição"}
                                    placeholder={this.props.navigation.getParam("dados", null) ? (this.props.navigation.getParam("tipo", null) == 'EDITAR_DADOS' ? 'Uma breve descrição sobre a receita' : 'Escreva uma breve descrição desse passo') : 'Escreva uma breve descrição desse passo'}
                                    icone={"comment"}
                                    inputRef={(input) => this.segundoInput = input}
                                onChangeText={(descricao) => this.setState({descricao})}
                                value={this.state.descricao}
                                autoCapitalize={"sentences"}
                                small={true}
                                multiline={true}
                                numberOfLines={5}
                                maxLength={120}
                                returnKeyType={"default"}
                            />
                        </View>
                        <View style={styles.container}>
                            <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                <BotaoPequeno disabled={this.state.disabled} texto={"Confirmar"} onPress={() => this.confirmar()} loading={this.state.loading}/>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

}

const styles = {
    container: {
        paddingBottom: 10,
        paddingHorizontal: 15
    },
    imagem: {
        width: imageWidth,
        maxHeight: 300,
        minHeight: 250,
        backgroundColor: '#eee'
    }
}