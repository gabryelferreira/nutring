import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, ActivityIndicator, Modal } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import Post from '../../../components/Post/Post';
import UsuarioCard from '../../../components/UsuarioCard/UsuarioCard';
import { ScrollView } from 'react-native-gesture-handler';
import Novidades from '../../../components/Novidades/Novidades';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const InicioHeader = () => {
    return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20}}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 1, borderColor: '#eee', height: 30, width: 30, borderRadius: 30/2}}>
                <Image style={{height: 30, width: 30, borderRadius: 30/2, borderWidth: 1, borderColor: '#eee'}} source={require('../../../assets/imgs/eu.jpg')}/>
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

    state = {
        carregando: false,
        carregandoInicial: false,
        usuarios: [],
        dados: [],
        offset: 0,
        semMaisDados: false,
        semMaisUsuarios: false,
        modalComentarios: {
            visible: false
        }
    }


    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.carregarDados();
    }

    carregarDadosIniciais() {
        this.setState({
            offset: 0,
            semMaisDados: false,
            carregandoInicial: true,
            usuarios: []
        }, this.carregarDados)
    }

    async carregarDados() {
        if (!this.state.semMaisDados){
            let result = await this.callMethod("getFeed", { offset: this.state.offset, limit: 10 })
            if (result.success){
                if (result.result.length == 0 && this.state.offset == 0){
                    await this.setState({
                        semMaisDados: true,
                        offset: 0,
                        carregandoInicial: false,
                        dados: []
                    })
                    this.carregarUsuarios();
                } else if (result.result.length == 0 && this.state.dados.length != 0){
                    await this.setState({
                        semMaisDados: true,
                        carregandoInicial: false
                    })
                        
                } else {
                    let dados = [];
                    if (!this.state.carregandoInicial){
                        dados = this.state.dados;
                    }
                    for (var i = 0; i < result.result.length; i++){
                        result.result[i].conteudo = result.result[i].conteudo[0].url_conteudo;
                        dados.push(result.result[i]);
                    }
                    if (result.result.length < 10){
                        await this.setState({
                            semMaisDados: true,
                            carregandoInicial: false
                        })
                    }
                    await this.setState({
                        dados: dados,
                        carregandoInicial: false
                    });
                }
            }
        }
        
    }

    async pegarDados(){
        if (!this.state.carregando){
            await this.setState({
                offset: this.state.offset + 10
            });
            await this.carregarDados();
        }
    }


    async carregarUsuarios(){
        let result = await this.callMethod("getTopUsers");
        if (result.success){
            await this.setState({
                usuarios: result.result
            })
        }
    }

    returnFooterComponent(){
        if (!this.state.semMaisDados){
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 20, marginBottom: 40 }}/>
        } else return <View style={{marginBottom: 20}}></View>
    }

    returnLoader(index, campo){
        if (campo == 'dados'){
            if (index == this.state.dados.length-1 && !this.state.semMaisDados)
                return <ActivityIndicator color="#27ae60" size="large" style={{  marginTop: 0, marginBottom: 85 }}/>
        }
        if (campo == 'usuarios')
            if (index == this.state.usuarios.length-1 && !this.state.semMaisUsuarios)
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

    returnUsuarios(){
        if (this.state.usuarios.length > 0){
            return (
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View style={{alignItems: 'center', paddingTop: 15, paddingBottom: 30, paddingHorizontal: 50}}>
                        <Text style={{fontSize: 60, fontWeight: 'bold', color: '#000', textAlign: 'center'}}>Ei!</Text>
                        <Text style={{fontSize: 17, color: '#000', textAlign: 'center'}}>O seu Feed está vazio :(</Text>
                        <Text style={{fontSize: 17, color: '#000', textAlign: 'center'}}>Aqui vão algumas sugestões de quem seguir!</Text>
                    </View>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20}}>
                        {this.renderUsuarios()}
                    </View>
                </ScrollView>
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
                        
                        <Post data={item} index={index} navigation={this.props.navigation}/>
                        {this.returnLoader(index, 'dados')}
                    </View>

                )}
                refreshing={this.state.carregandoInicial}
                onRefresh={async () => await this.carregarDadosIniciais()}
                onEndReached={async () => await this.pegarDados()}
                onEndReachedThreshold={0.5}
                legacyImplementation={true}
                enableEmptySections={true}
                />
        );
    }

    render(){
        if (this.state.semMaisDados && this.state.dados.length == 0){
            return (
                <View style={{flex: 1, flexDirection: 'column'}}>
                    
                    {this.returnUsuarios()}
                </View>
            );
        }
        return (
            
            <View>
                {this.returnNovidades()}
                {this.renderFeed()}
            </View>
                
        );
    }
}