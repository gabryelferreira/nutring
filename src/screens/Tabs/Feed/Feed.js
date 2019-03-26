import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, ActivityIndicator, Modal } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import Post from '../../../components/Post/Post';
import UsuarioCard from '../../../components/UsuarioCard/UsuarioCard';
import { ScrollView } from 'react-native-gesture-handler';
import Novidades from '../../../components/Novidades/Novidades';
import firebase from 'react-native-firebase';
import SemDados from '../../../components/SemDados/SemDados';
import ImageViewer from 'react-native-image-zoom-viewer';
import ModalPostagemViewer from '../../../components/ModalPostagemViewer/ModalPostagemViewer';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const InicioHeader = () => {
    return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20}}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 1, borderColor: '#eee', height: 30, width: 30, borderRadius: 30/2}}>
                <Image resizeMethod="resize" style={{height: 30, width: 30, borderRadius: 30/2, borderWidth: 1, borderColor: '#eee'}} source={require('../../../assets/imgs/eu.jpg')}/>
            </View> */}
            <AutoHeightImage style={{alignSelf: 'center'}} source={require('../../../assets/imgs/nutring-color.png')} width={100}/>
            {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Icon style={{marginRight: 20}}
                    name="search"
                    size={17}
                    color='#27ae60' />
                <Icon
                    name="ellipsis-v"
                    size={17}
                    color='#27ae60' />
            </View> */}
        </View>
    );
}

export default class Feed extends Network {

    static navigationOptions = {
        headerTitle: (
            <InicioHeader/>
        )
    };

    offset = 0;
    refreshing = false;

    state = {
        carregando: false,
        refreshing: true,
        carregandoPrimeiraVez: true,
        usuarios: [],
        dados: [],
        semMaisDados: false,
        semMaisUsuarios: false,
        avoidRender: true,
        modalComentarios: {
            visible: false
        },
        modalFotoVisible: false,
        semInternet: false,
        itemSelecionado: {}
    }


    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.carregarDadosIniciais();
        this.salvarToken();
    }

    carregarDadosIniciais() {
        console.log("to aqui nos dados iniciais!!")
        this.offset = 0;
        this.refreshing = true;
        this.setState({
            semMaisDados: false,
            refreshing: true,
            avoidRender: true,
        }, this.carregarDados);
    }

    async salvarToken(){
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            await this.callMethod("salvarToken", { token: fcmToken });
        }
    }

    async carregarDados() {
        if (!this.state.semMaisDados){
            let result = await this.callMethod("getFeed", { offset: this.offset, limit: 10 })
            this.refreshing = false;
            if (result.success){
                if (this.state.refreshing){
                    await this.setState({
                        dados: []
                    })
                }
                this.setState({
                    semInternet: false
                })
                if (result.result.length == 0 && this.offset == 0){
                    this.offset = 0;
                    await this.setState({
                        semMaisDados: true,
                        dados: []
                    }, await this.carregarUsuarios)
                    
                } else if (result.result.length == 0 && this.state.dados.length != 0){
                    await this.setState({
                        semMaisDados: true,
                        refreshing: false,
                        avoidRender: false
                    })
                        
                } else {
                    let dados = [];
                    if (!this.state.refreshing){
                        dados = this.state.dados;
                    }
                    for (var i = 0; i < result.result.length; i++){
                        // result.result[i].conteudo = result.result[i].conteudo[0].url_conteudo;
                        dados.push(result.result[i]);
                    }
                    if (result.result.length < 10){
                        await this.setState({
                            semMaisDados: true,
                            refreshing: false,
                        })
                    }
                    await this.setState({
                        dados: dados,
                        refreshing: false,
                        carregandoPrimeiraVez: false,
                        avoidRender: false
                    });
                }
            } else {
                this.setState({
                    semInternet: true
                })
            }
        }
        
    }

    async pegarDados(){
        console.log("to aqui no pegarDados()")
        if (!this.state.carregando && !this.state.refreshing){
            this.offset = this.offset + 10
            await this.carregarDados();
        }
    }


    async carregarUsuarios(){
        let result = await this.callMethod("getTopUsers");
        if (result.success){
            await this.setState({
                usuarios: result.result,
                carregandoPrimeiraVez: false,
                semInternet: false,
                refreshing: false
            })
        } else {
            this.setState({
                semInternet: true,
                refreshing: false
            })
        }
    }

    returnLoader(index, campo){
        if (campo == 'dados'){
            if (index == this.state.dados.length-1 && !this.state.semMaisDados && !this.refreshing)
                return <ActivityIndicator color="#27ae60" size="large" style={{  marginTop: 0, marginBottom: 35 }}/>
        }
        if (campo == 'usuarios')
            if (index == this.state.usuarios.length-1 && !this.state.semMaisUsuarios && !this.refreshing)
                return <ActivityIndicator color="#27ae60" size="large" style={{  marginTop: 15, marginBottom: 35 }}/>
        return;
    }

    returnLoaderInicial(){
        if (this.state.dados.length == 0 && !this.state.semMaisDados){
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 30 }}/>
        }
        return;
    }

    abrirComentarios(){
        this.setState({
            modalComentarios: {
                visible: true
            }
        })
    }

    returnModal(){
        if (this.state.modalComentarios.visible){
            return (
                <Modal>
                    <View></View>
                </Modal>
            )
        }
        return;
    }

    renderUsuarios(){
        return this.state.usuarios.map((usuario) => {
            return (
                <UsuarioCard key={usuario.id_usuario} usuario={usuario} navigation={this.props.navigation}/>
            );
        })
    }

    renderUsuarioCard(item, index){
        if (index % 2 == 0){
            return (
                <View style={[{flex: .5, marginVertical: 10, marginLeft: 30, marginRight: 10}, index == 0 ? {marginTop: 25} : {}]}>
                    <UsuarioCard key={item.id_usuario} usuario={item} navigation={this.props.navigation}/>
                </View>
            )
        }
        return (
            <View style={[{flex: .5, marginVertical: 10, marginRight: 30, marginLeft: 10}, index == 1 ? {marginTop: 25} : {}]}>
                <UsuarioCard key={item.id_usuario} usuario={item} navigation={this.props.navigation}/>
            </View>
        )
    }

    returnUsuarios(){
        if (this.state.usuarios.length > 0){
            return (
                // <ScrollView contentContainerStyle={{flexGrow: 1}}>
                
                //     <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20}}>
                //         {this.renderUsuarios()}
                //     </View>
                // </ScrollView>
                <View style={{flex: 1}}>
                    
                    <FlatList
                    data={this.state.usuarios}
                    keyExtractor={(item, index) => item.id_usuario.toString()}
                    numColumns={2}
                    renderItem={({item, index}) => this.renderUsuarioCard(item, index)}
                    refreshing={this.state.refreshing}
                    onRefresh={async () => await this.carregarDadosIniciais()}
                    />
                </View>
            );
        } return null;
    }

    returnNovidades(){
        if (this.state.dados.length > 0)
            return <Novidades navigation={this.props.navigation} />
        return null;
    }

    renderFeed(){
        return (
            <FlatList
                data={this.state.dados}
                keyExtractor={(item, index) => item.id_post.toString()}
                renderItem={({item, index}) => (
                    
                    <View>
                        
                        <Post onClickFoto={() => this.abrirFotos(item)} data={item} index={index} navigation={this.props.navigation} onDelete={(id_post) => this.carregarDadosIniciais()}/>
                        {this.returnLoader(index, 'dados')}
                    </View>

                )}
                refreshing={this.state.refreshing}
                onRefresh={async () => await this.carregarDadosIniciais()}
                onEndReached={async () => await this.pegarDados()}
                onEndReachedThreshold={0.5}
                legacyImplementation={true}
                enableEmptySections={true}
                />
        );
    }

    render(){
        if (this.state.semInternet){
            return <SemDados titulo={"Sem internet"} texto={"Parece que você está sem internet."}/>
        }
        if (this.state.carregandoPrimeiraVez){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657"/>
                </View>
            );
        }
        if ((this.state.semMaisDados || this.state.avoidRender) && this.state.dados.length == 0){
            return (
                <View style={{flex: 1, flexDirection: 'column'}}>
                    
                    {this.returnUsuarios()}
                </View>
            );
        }
        return (
            
            <View>
                {/* {this.returnNovidades()} */}
                <ModalPostagemViewer visible={this.state.modalFotoVisible}
                                    foto={this.state.itemSelecionado.foto}
                                    titulo={this.state.itemSelecionado.nome}
                                    imagens={this.state.itemSelecionado.conteudo}
                                    onSwipeDown={() => this.setState({modalFotoVisible: false})}
                                    onClose={() => this.setState({modalFotoVisible: false})}/>
                {this.renderFeed()}
            </View>
                
        );
    }

    abrirFotos(item){
        console.log("item = ", item)
        let newItem = {};
        newItem["nome"] = item.nome;
        newItem["foto"] = item.foto;
        newItem["conteudo"] = item.conteudo;
        newItem.conteudo = newItem.conteudo.map(foto => {
            return foto.url_conteudo
        })
        this.setState({
            modalFotoVisible: true,
            itemSelecionado: newItem
        })
    }
}