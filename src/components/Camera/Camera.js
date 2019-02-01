import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StatusBar, Image, Animated, Dimensions, TouchableHighlight } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import Input from '../Input/Input';
import BotaoPequeno from '../Botoes/BotaoPequeno';
import Modalzin from '../Modal/Modal';
import Opcao from '../Opcao/Opcao';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Header = ({onCloseClick}) => {
    return (
        <View style={{
            elevation: 1,
            shadowOpacity: 0,
            height: 50,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            left: 0, right: 0, top: 0,
            zIndex: 9999
        }}>
            <View style={{position: 'relative', zIndex: 9999, flexDirection: 'row', alignItems: 'center'}}>
                <Icon onPress={onCloseClick} name="times" color="#fff" size={24} style={{flex: 1}}/>
            </View>
        </View>
    );
}

export default class Camera extends Network {
    state = {
        flash: 'off',
        zoom: 0,
        autoFocus: 'off',
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
        fotoPostada: false
    };

    constructor(props){
        super(props);
        // this.animated = new Animated.Value(0);
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
            const options = { quality: 0.28, base64: true };
            const data = await this.camera.takePictureAsync(options);
            console.log("data = ", data);
            let base64 = "data:image/jpeg;base64," + data.base64;
            this.setState({
                fotoTirada: base64,
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
        let conteudo = {data: [this.state.fotoTirada]};
        conteudo = JSON.stringify(conteudo);
        let visibilidade;
        if (this.state.fotoPublica)
            visibilidade = "PB"
        else
            visibilidade = "PR"
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
        if (key == "close" || this.state.fotoPostada){
            this.props.onClose();
        }
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
                        onClose={() => this.getModalClick("close")}
                    />
                    <Header onCloseClick={() => this.setState({fotoTirada: ""})}/>
                    <ScrollView  contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                        <TouchableHighlight >
                            <Image source={{uri: this.state.fotoTirada}} style={{height: 250, width: imageWidth}}/>
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
                                numberOfLines={4}
                                maxLength={500}
                                returnKeyType={"none"}
                            />
                            <TouchableHighlight style={{marginVertical: 5, flex: .7}}>
                                <Text style={{fontSize: 11, color: '#000'}}>Use hashtags para impulsionar sua postagem.</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={{marginVertical: 10}}>
                                <BotaoPequeno texto={"Publicar"} onPress={() => this.salvarPublicacao()} loading={this.state.loading}/>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                </View>
            );
        }
        return (
            <View style={{flex: 1}}>
            
                <RNCamera
                    ref={ref => {
                    this.camera = ref;
                    }}
                    style={{
                    flex: 1
                    }}
                    type={this.state.type}
                    permissionDialogTitle={'Permissão para usar a camera'}
                    permissionDialogMessage={'Precisamos da sua permissão para utilizar sua camera'}
                >
                    <View style={{flex: .5, justifyContent: 'flex-start'}}>
                        <View style={styles.botoesCima}>
                                <View style={[styles.viewBotao, styles.alignEsquerda]}>
                                    <TouchableOpacity disabled={this.state.uploading}
                                    onPress={this.props.onClose}
                                    >
                                        <Icon name="angle-down" color="#fff" size={32}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.viewBotao, styles.alignDireita]}>
                                    <TouchableOpacity disabled={this.state.uploading}
                                    >
                                        <Icon name="bolt" color="#fff" size={25}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    <View style={{flex: .5, justifyContent: 'flex-end'}}>
                        <View style={styles.botoes}>
                            <View style={[styles.viewBotao, styles.alignEsquerda]}>
                                <TouchableOpacity disabled={this.state.uploading}
                                    style={styles.botaoGaleria}
                                >
                                    <Image source={require('../../assets/imgs/eu.jpg')} style={{flex: 1, height: undefined, width: undefined}}/>
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
                </RNCamera>
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