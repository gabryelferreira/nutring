import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Image, PermissionsAndroid, CameraRoll } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';
import Input from '../../../../components/Input/Input'
import Sugestoes from '../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Galeria from '../../../../components/Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class EnviarNotificacao extends Network {

    static navigationOptions = {
        title: 'Enviar notificação',
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            notificacaoEnviada: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            loading: false,
            titulo: "",
            mensagem: "",
            promocaoRelampago: false,
            seguidores: 0,
            disabled: true,
            foto: "",
            permissaoGaleria: false,
            fotosGaleria: [],
            galeriaAberta: false
        }
    }

    componentDidMount(){
        this.getNomeUsuarioById();
    }

    async getNomeUsuarioById(){
        let result = await this.callMethod("getNomeUsuarioESeguidores");
        if (result.success){
            this.setState({
                titulo: result.result.nome,
                seguidores: result.result.seguidores,
                disabled: false
            })
        }
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.notificacaoEnviada){
            this.props.navigation.goBack();
        }
        if (key == "ENVIAR"){
            this.enviarNotificacao();
        }
    }

    async enviarNotificacao(){
        this.setState({
            loading: true
        })
        RNFetchBlob.fs.readFile(this.state.foto, 'base64')
        .then(async (data) => {
            let url = `data:image/jpg;base64,${data}`;
            let result = await this.callMethod("enviarNotificacao", { titulo: this.state.titulo, mensagem: this.state.mensagem, is_promocao_relampago: this.state.promocaoRelampago, foto: url });
            if (result.success){
                if (result.result == "NOTIFICACAO_ENVIADA"){
                    this.setState({
                        notificacaoEnviada: true
                    })
                    this.showModal("Notificação enviada", "Sua notificação foi enviada com sucesso para seus seguidores.");
                } else if (result.result == "NOTIFICACAO_ENVIADA"){
                    this.showModal("Notificação falhou", "A notificação não foi enviada. Tente novamente mais tarde.");
                }
                
            } else {
                this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
            }
            this.setState({
                loading: false
            })
        })
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
        if (!this.state.foto){
            this.showModal("Foto obrigatória", "Para publicar uma promoção, é necessário colocar uma foto na publicação.");
        } else if (!this.state.mensagem){
            this.showModal("Descrição obrigatória", "Para enviar uma notificação e publicar a promoção, é necessário colocar uma descrição.");
        } else {
            this.showModal("Confirmação de envio", "Deseja enviar essa notificação para seus " + this.state.seguidores + " seguidores?", this.criarBotoesExclusao());
        }
    }

    criarBotoesExclusao(){
        let botoes = [
            {chave: "ENVIAR", texto: "Enviar notificação", color: '#28b657', fontWeight: 'bold'},
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
            return <Image style={{width: undefined, height: undefined, flex: 1}} source={{uri: foto}}/>
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
                        <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 2, backgroundColor: 'rgba(0, 0, 0, .1)', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
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
                        <Opcao icone={"bolt"} texto={"Promoção Relâmpago"} toggle={true} toggleChange={() => this.setState({promocaoRelampago: !this.state.promocaoRelampago})} toggleValue={this.state.promocaoRelampago}/>
                    <View style={styles.container}>
                        <Input label={"Título"}
                                    icone={"comment"}
                                onChangeText={(titulo) => this.setState({titulo})}
                                value={this.state.titulo}
                                onSubmitEditing={() => this.segundoInput.focus()}
                                autoCapitalize={"sentences"}
                                small={true}
                                maxLength={255}
                                returnKeyType={"none"}
                                disabled={true}
                            />
                        <Input label={"Descrição"}
                                icone={"comment"}
                                inputRef={(input) => this.segundoInput = input}
                            onChangeText={(mensagem) => this.setState({mensagem})}
                            value={this.state.mensagem}
                            onSubmitEditing={() => this.confirmarEnvio()}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={255}
                            returnKeyType={"send"}
                        />
                        <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>A notificação será enviada para todos seus seguidores.</Text>
                            {/* <Text style={{fontSize: 11, color: '#000'}}>Pode ficar tranquilo ;)</Text> */}
                        </View>
                        <View style={{marginVertical: 10}}>
                            <BotaoPequeno disabled={this.state.disabled} texto={"Confirmar"} onPress={() => this.confirmarEnvio()} loading={this.state.loading}/>
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