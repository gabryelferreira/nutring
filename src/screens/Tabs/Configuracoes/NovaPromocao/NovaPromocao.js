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

export default class NovaPromocao extends Network {

    static navigationOptions = {
        title: 'Cadastrar promoção',
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
            tituloNotificacao: "",
            descricaoNotificacao: "",
            permissaoNotificacao: false,
            promocaoRelampago: false,
            seguidores: 0,
            disabled: true,
            foto: "",
            permissaoGaleria: false,
            fotosGaleria: [],
            galeriaAberta: false,
            enviarNotificacao: false,
        }
    }

    componentDidMount(){
        this.getNomeUsuarioById();
    }

    async getNomeUsuarioById(){
        let result = await this.callMethod("getNomeUsuarioESeguidores");
        if (result.success){
            this.setState({
                tituloNotificacao: result.result.nome,
                seguidores: result.result.seguidores,
                permissaoNotificacao: result.result.permissao_notificacao,
                planoNotificacao: result.result.plano_notificacao,
                disabled: false,
                carregandoInicial: false
            })
        } else {
            this.setState({
                carregandoInicial: false
            })
        }
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
        if (key == "ENVIAR"){
            this.salvarPromocao();
        }
    }

    async salvarPromocao(){
        this.setState({
            loading: true
        })
        RNFetchBlob.fs.readFile(this.state.foto, 'base64')
        .then(async (data) => {
            let url = `data:image/jpg;base64,${data}`;
            let result = await this.callMethod("salvarPromocao", { titulo: this.state.titulo, descricao: this.state.descricao, is_promocao_relampago: this.state.promocaoRelampago, foto: url });
            if (result.success){
                if (result.result == "DEU_BOM"){
                    if (!this.state.enviarNotificacao){
                        this.setState({
                            promocaoFinalizada: true,
                            loading: false
                        })
                        this.showModal("Promoção cadastrada", "Sua promoção foi cadastrada com sucesso e já está disponível para seus seguidores.");
                    } else {
                        this.enviarNotificacao();
                    }
                } else {
                    this.showModal("Dados inválidos", result.result);
                }
                
            } else {
                this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
                this.setState({
                    loading: false
                })
            }
        })
    }

    async enviarNotificacao(){
        let result = await this.callMethod("enviarNotificacao", { mensagem: this.state.descricaoNotificacao, promocao: true });
        if (result.success){
            if (result.result == "NOTIFICACAO_ENVIADA"){
                this.showModal("Promoção cadastrada", "Sua promoção foi cadastrada com sucesso e seus seguidores já foram notificados sobre ela.");
            } else if (result.result == "NOTIFICACAO_FALHOU"){
                this.showModal("Sua notificação falhou", "Não foi possível enviar sua notificação para seus seguidores. Entre em contato com o suporte para mais informações.");
            }
            this.setState({
                promocaoFinalizada: true,
                loading: false
            })
        } else {
            this.showModal("Ocorreu um erro", "Sua notificação falhou ao ser enviada. Entre em contato com o suporte para mais informações.");
            this.setState({
                loading: false
            })
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

    confirmarEnvio(){
        if (!this.state.foto){
            this.showModal("Foto obrigatória", "Para publicar uma promoção, é necessário colocar uma foto na publicação.");
        } else if (!this.state.titulo){
            this.showModal("Título obrigatório", "Para publicar uma promoção, é necessário colocar um título.");
        } else if (!this.state.descricao){
            this.showModal("Descrição obrigatória", "Para publicar uma promoção, é necessário colocar uma descrição.");
        } else if (this.state.enviarNotificacao && !this.state.descricaoNotificacao){
            this.showModal("Descrição da notificação obrigatória", "Para enviar uma notificação, é necessário colocar uma descrição.");
        } else if (this.state.enviarNotificacao){
            this.showModal("Confirmação de envio", "Deseja cadastrar a promoção e notificar seus " + this.state.seguidores + " seguidores?", this.criarBotoesExclusao());
        }
        else {
            this.salvarPromocao();
        }
    }

    criarBotoesExclusao(){
        let botoes = [
            {chave: "ENVIAR", texto: "Confirmar", color: '#28b657', fontWeight: 'bold'},
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
            return <Image resizeMethod="resize" style={{width: undefined, height: undefined, flex: 1}} source={{uri: foto}}/>
        } else {
            return null;
        }
    }

    renderEnviarNotificacao(){
        if (this.state.enviarNotificacao){
            return (
                <View>

                    <Input label={"Título da notificação"}
                        icone={"comment"}
                        onChangeText={(tituloNotificacao) => this.setState({tituloNotificacao})}
                        value={this.state.tituloNotificacao}
                        autoCapitalize={"sentences"}
                        small={true}
                        maxLength={30}
                        returnKeyType={"default"}
                        disabled={true}
                        />
                    <Input label={"Descrição da notificação"}
                        icone={"comment"}
                        onChangeText={(descricaoNotificacao) => this.setState({descricaoNotificacao})}
                        value={this.state.descricaoNotificacao}
                        onSubmitEditing={() => this.confirmarEnvio()}
                        autoCapitalize={"sentences"}
                        small={true}
                        multiline={true}
                        numberOfLines={5}
                        maxLength={100}
                        returnKeyType={"send"}
                    />
                </View>
            )
        }
    }

    renderPermissaoNotificacao(){
        if (this.state.carregandoInicial)
            return null;
        if (!this.state.planoNotificacao)
            return <Text style={{fontSize: 11, color: 'red'}}>Seu plano atual não permite o envio de notificações.</Text>
        if (!this.state.permissaoNotificacao){
            return <Text style={{fontSize: 11, color: 'red'}}>Você já enviou suas notificações diárias.</Text>
        }
        return <Text style={{fontSize: 11, color: '#000'}}>A notificação será enviada para todos seus seguidores.</Text>
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
                    <Opcao icone={"bolt"} texto={"Promoção Relâmpago"} toggle={true} toggleChange={() => this.setState({promocaoRelampago: !this.state.promocaoRelampago})} toggleValue={this.state.promocaoRelampago}/>
                    <View style={styles.container}>
                        <Input label={"Título"}
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
                                icone={"comment"}
                                inputRef={(input) => this.segundoInput = input}
                            onChangeText={(descricao) => this.setState({descricao})}
                            value={this.state.descricao}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={5}
                            maxLength={255}
                            returnKeyType={"default"}
                        />
                    </View>
                    <Opcao icone={"rocketchat"} texto={"Enviar notificação?"} switchDisabled={!this.state.permissaoNotificacao || !this.state.planoNotificacao} toggle={true} toggleChange={() => this.setState({enviarNotificacao: !this.state.enviarNotificacao})} toggleValue={this.state.enviarNotificacao}/>
                    <View style={styles.container}>
                        {this.renderPermissaoNotificacao()}
                        <View style={{marginVertical: 5, flex: .7}}>
                            {this.renderEnviarNotificacao()}
                            
                        </View>
                        <View style={{marginVertical: 10, flexDirection: 'column', alignItems: 'flex-start'}}>
                            <BotaoPequeno disabled={this.state.disabled} texto={"Cadastrar"} textoLoading={"Cadastrando"} onPress={() => this.confirmarEnvio()} loading={this.state.loading}/>
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