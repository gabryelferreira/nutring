import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StatusBar, Image, Animated, Dimensions, TouchableHighlight, CameraRoll, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import Input from '../Input/Input';
import BotaoPequeno from '../Botoes/BotaoPequeno';
import Modalzin from '../Modal/Modal';
import Opcao from '../Opcao/Opcao';
import RNFetchBlob from 'react-native-fetch-blob';
import Galeria from '../Galeria/Galeria';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Header = ({onCloseClick, onPress, loading}) => {

    renderLoading = () => {
        if (loading)
            return (
                <View style={{paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', opacity: .3}}>
                    <Text style={{fontSize: 16, color: '#28b657', fontWeight: 'bold', marginRight: 5}}>Publicando</Text>
                    <ActivityIndicator animating color="#28b657" size={12}/>
                </View>
            );
        return (
            <TouchableOpacity onPress={onPress} style={{paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: '#28b657', fontWeight: 'bold'}}>Publicar</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={{
            elevation: 1,
            shadowOpacity: 0,
            height: 40,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            left: 0, right: 0, top: 0,
            zIndex: 9999,
            backgroundColor: '#fff'
        }}>
            <View style={{position: 'relative', flex:1, zIndex: 9999, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', flex: .3, alignItems: 'center'}}>
                    <Icon onPress={onCloseClick} name="arrow-left" color="#000" size={20}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: .4}}>
                    <Text style={{color: '#000', fontWeight: 'bold', fontSize: 18}}>Postar Foto</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: .3}}>
                    {renderLoading()}
                </View>
            </View>
        </View>
    );
}

export default class Camera extends Network {
    state = {
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        ratios: [],
        photoId: 1,
        showGallery: false,
        photos: [],
        faces: [],
        recordOptions: {
        mute: false,
        maxDuration: 5,
        quality: RNCamera.Constants.VideoQuality["288p"],
        },
        isRecording: false,
        foto: "",
        fotoTirada: "",
        uploading: false,
        contador: 4,
        lastTap: null,
        descricao: "",
        modal: {
            visible: false,
            titulo: "",
            subTitulo: "",
        },
        loading: false,
        fotoPublica: true,
        fotoPostada: false,

        //ABRIR GALERIA DE FOTOS DO USUÁRIO
        galeriaAberta: false,
        fotosGaleria: [],
        permissaoGaleria: false,
        ultimaFotoGaleria: "https://cdn0.iconfinder.com/data/icons/Android-R2-png/512/Gallery-Android-R.png"
    };

    constructor(props){
        super(props);
        // this.animated = new Animated.Value(0);
        this.requisitarPermissaoCamera();
    }

    async getUltimaFotoGaleria(){
        CameraRoll.getPhotos({
            first: 1,
            assetType: 'All'
        })
        // .then(r => this.setState({ photos: r.edges }))
        .then(r => {
            if (r.edges.length > 0){
                console.log("ultima foto = ", r.edges[0].node.image.uri)
                if (r.edges)
                this.setState({
                    ultimaFotoGaleria: r.edges[0].node.image.uri
                })
            } else {
                console.log("nao tem fotos")
            }
        })
    }

    async requisitarPermissaoCamera() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permissão da câmera',
              message:
                'Precisamos da sua permissão para acessar a câmera',
              buttonNeutral: 'Perguntar depois',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            this.requisitarPermissaoGaleria();
          } else {
            console.log('Camera permission denied');
            this.props.onClose();
          }
        } catch (err) {
          console.warn(err);
          this.props.onClose();
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
            this.getUltimaFotoGaleria();
          } else {
            console.log('Camera permission denied');
            this.props.onClose();
          }
        } catch (err) {
          console.warn(err);
          this.props.onClose();
        }
    }

    async handleDoubleTap() {
        console.log("aquiiii")
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (this.state.lastTap && (now - this.state.lastTap) < DOUBLE_PRESS_DELAY) {
          this.toggleFacing();
        } else {
          this.setState({lastTap: now});
        }
    }

    async takePicture() {
        console.log("tnc");
        this.setState({uploading: true});
        if (this.camera) {
            const options = { quality: 0.28, forceUpOrientation: true, fixOrientation: true };
            const data = await this.camera.takePictureAsync(options);
            console.log("data = ", data);
            this.setState({
                fotoTirada: data.uri,
                uploading: false
            });
        } else {
            this.setState({
                fotoTirada: "",
                uploading: false
            });
            console.log("opaaa");
        }
    };

    virarCamera(){
        let type;
        if (this.state.type == "front"){
            type = "back";
        } else {
            type = "front";
        }
        this.setState({type});
    }

    async salvarPublicacao(){
        this.setState({
            loading: true
        })
        
        
        let visibilidade;
        if (this.state.fotoPublica)
            visibilidade = "PB"
        else
            visibilidade = "PR"
        RNFetchBlob.fs.readFile(this.state.fotoTirada, 'base64')
        .then(async (data) => {
            let url = `data:image/jpg;base64,${data}`;
            let conteudo = {data: [url]};
            conteudo = JSON.stringify(conteudo);
            let result = await this.callMethod("createPost", { conteudo, tipo_conteudo: "IMG", descricao: this.state.descricao, visibilidade });
            if (result.success){
                this.setState({
                    fotoPostada: true
                })
                this.showModal("Foto postada com sucesso", "Sua foto foi postada e já está disponível para seus seguidores.");
            } else {
                this.showModal("Ocorreu um erro", "Parece que você está sem internet. Verifique-a e tente novamente.");
            }
            this.setState({
                loading: false
            })
        })
    }

    showModal(titulo, subTitulo){
        this.setState({
            modal: {
                titulo: titulo,
                subTitulo: subTitulo,
                visible: true
            }
        })
    }

    setFotoPublica(){
        this.setState({
            fotoPublica: !this.state.fotoPublica
        })
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.fotoPostada){
            this.props.onClose();
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

    mapFotosGaleria(){
        return this.state.fotosGaleria.map((foto) => {
            
        })
    }

    escolherFotoGaleria(fotoTirada){
        this.setState({
            fotoTirada
        })
    }

    renderGaleria(){
        return <Galeria fotos={this.state.fotosGaleria} onPress={(fotoTirada) => this.escolherFotoGaleria(fotoTirada)} 
        onClose={() => this.setState({
            galeriaAberta: false
        })}/>
    }

    render(){
        if (this.state.fotoTirada){
            return (
                <View style={{flex: 1}}>
                    <Modalzin 
                        titulo={this.state.modal.titulo} 
                        subTitulo={this.state.modal.subTitulo} 
                        visible={this.state.modal.visible} 
                        onClick={(key) => this.getModalClick(key)}
                        onClose={() => this.getModalClick()}
                    />
                    <Header onPress={() => this.salvarPublicacao()} loading={this.state.loading} onCloseClick={() => this.setState({fotoTirada: ""})}/>
                    <ScrollView  contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                        <TouchableHighlight>
                            <Image resizeMethod="resize" source={{uri: this.state.fotoTirada}} style={{height: 250, width: imageWidth}}/>
                        </TouchableHighlight>
                        {/* <TouchableHighlight>
                            <Opcao icone={"lock"} texto={"Foto pública"} toggle={true} toggleChange={() => this.setFotoPublica()} toggleValue={this.state.fotoPublica}/>
                        </TouchableHighlight> */}
                        <View style={{paddingVertical: 5, paddingHorizontal: 20}}>
                            <Input label={"Descrição"}
                                icone={"comment"}
                                onChangeText={(descricao) => this.setState({descricao})}
                                value={this.state.descricao}
                                autoCapitalize={"sentences"}
                                multiline={true}
                                small={true}
                                numberOfLines={5}
                                maxLength={500}
                                returnKeyType={"none"}
                            />
                            <TouchableHighlight style={{marginVertical: 5, flex: .7}}>
                                <Text style={{fontSize: 11, color: '#000'}}>A foto ficará disponível para todos os seus seguidores.</Text>
                            </TouchableHighlight>
                            {/* <TouchableHighlight style={{marginVertical: 10}}>
                                <BotaoPequeno texto={"Publicar"}  loading={this.state.loading}/>
                            </TouchableHighlight> */}
                        </View>
                    </ScrollView>
                </View>
            );
        }
        if (this.state.galeriaAberta){
            return this.renderGaleria();
        }
        return (
            <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'space-between'}}>
                <View style={{flex: .4,justifyContent: 'flex-start'}}>
                    <View style={styles.botoesCima}>
                        <View style={[styles.viewBotao, styles.alignEsquerda]}>
                            <TouchableOpacity disabled={this.state.uploading}
                            onPress={this.props.onClose}
                            >
                                <Icon name="angle-down" color="#fff" size={32}/>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={[styles.viewBotao, styles.alignDireita]}>
                            <TouchableOpacity disabled={this.state.uploading}
                            onPress={() => this.setState({flash: this.state.flash == "off" ? "on" : "off"})}
                            >
                                <Icon name="bolt" color="#fff" regular size={25}/>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
                <View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    
                }}>
                    <View style={{height: imageWidth/1.5, overflow: 'hidden'}}>
                        <RNCamera
                            ref={ref => {
                            this.camera = ref;
                            }}
                            style={{
                                flex: 1
                            }}
                            type={this.state.type}
                            flashMode={this.state.flash}
                            autoFocus={this.state.autoFocus}
                            permissionDialogTitle={'Permissão para usar a câmera'}
                            permissionDialogMessage={'Precisamos da sua permissão para utilizar sua câmera'}
                        >
                            
                        </RNCamera>
                    </View>
                
                </View>
                <View style={{flex: .4,justifyContent: 'flex-end', marginTop: 20}}>
                    <View style={styles.botoes}>
                        <View style={[styles.viewBotao, styles.alignEsquerda]}>
                            <TouchableOpacity disabled={this.state.uploading}
                                style={styles.botaoGaleria}
                                onPress={() => this.abrirGaleria()}
                            >
                                <Image resizeMethod="resize" source={{uri: this.state.ultimaFotoGaleria}} style={{flex: 1, height: undefined, width: undefined}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.viewBotao, styles.alignMeio]}>
                            <TouchableOpacity disabled={this.state.uploading}
                                style={styles.botaoFoto}
                                onPress={() => this.takePicture()}
                            >
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.viewBotao, styles.alignDireita]}>
                            <TouchableOpacity disabled={this.state.uploading}
                                onPress={() => this.virarCamera()}
                            >
                                <Icon name="sync-alt" color="#fff" size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    botoesCima: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    botoes: {
        paddingVertical: 30,
        paddingHorizontal: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewBotao: {
        flex: 1,
        justifyContent: 'center'
    },
    alignDireita: {
        alignItems: 'flex-end'
    },
    alignEsquerda: {
        alignItems: 'flex-start'
    },
    alignMeio: {
        alignItems: 'center'
    },
    botaoGaleria: {
        width: 37,
        height: 37,
        borderRadius: 2,
        overflow: 'hidden'
    },
    botaoFoto: {
        height: 55,
        width: 55,
        borderRadius: 55/2,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: '#fff',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
    

}