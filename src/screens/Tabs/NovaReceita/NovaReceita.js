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
import Input from '../../../components/Input/Input';
import BotaoPequeno from '../../../components/Botoes/BotaoPequeno';
import DraggableFlatList from 'react-native-draggable-flatlist'

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;
export default class NovaReceita extends Network {

    static navigationOptions = {
        title: 'Postar Receita',
    };

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
            permissaoGaleria: false,
            fotosGaleria: [],
            galeriaAberta: false,
        }
    }

    componentDidMount(){
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.promocaoFinalizada){
            this.props.navigation.goBack();
        }
    }

    async salvarReceita(){
        
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

    confirmarEnvio(){
        let dados = {
            foto: this.state.foto,
            titulo: this.state.titulo,
            descricao: this.state.descricao
        }
        if (!dados.foto){
            this.showModal("Foto obrigatória", "Clique em alterar foto para selecionar uma foto da sua galeria.");
        } else if (!dados.titulo.trim()){
            this.showModal("Título obrigatório", "Escreva no campo título para poder avançar.");
        } else if (!dados.descricao.trim()){
            this.showModal("Descrição obrigatória", "Escreva no campo descrição para poder avançar.");
        } else {
            this.props.navigation.navigate("EditarReceita", { dados });
        }
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
        CameraRoll.getPhotos({
            first: 100
        })
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

    render(){        
        if (this.state.galeriaAberta){
            return <Galeria fotos={this.state.fotosGaleria} onPress={(foto) => this.setState({foto, galeriaAberta: false})} onClose={() => this.setState({galeriaAberta: false})}/>
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
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.imagem}>
                        {this.returnImagemPublicacao(this.state.foto)}
                        <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, .1)', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                            <TouchableOpacity onPress={() => {
                                    this.requisitarPermissaoGaleria()
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
                                placeholder={"Escolha um título para sua receita"}
                                icone={"comment"}
                                onChangeText={(titulo) => this.setState({titulo})}
                                value={this.state.titulo}
                                onSubmitEditing={() => this.segundoInput.focus()}
                                autoCapitalize={"sentences"}
                                blurOnSubmit={false}
                                small={true}
                                maxLength={255}
                                returnKeyType={"next"}
                            />
                        <Input label={"Descrição"}
                                placeholder={"Uma breve descrição sobre a receita"}
                                icone={"comment"}
                                inputRef={(input) => this.segundoInput = input}
                            onChangeText={(descricao) => this.setState({descricao})}
                            value={this.state.descricao}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={5}
                            maxLength={255}
                            returnKeyType={"none"}
                        />
                    </View>
                    <View style={styles.container}>
                        <View style={{marginVertical: 10, flexDirection: 'column', alignItems: 'flex-start'}}>
                            <BotaoPequeno disabled={this.state.disabled} texto={"Avançar"} onPress={() => this.confirmarEnvio()} loading={this.state.loading}/>
                        </View>
                    </View>
                </ScrollView>
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