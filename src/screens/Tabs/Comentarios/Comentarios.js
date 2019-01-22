import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Comentario from '../../../components/Comentario/Comentario';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Comentarios extends Network {


    static navigationOptions = {
        title: 'Comentários',
        tabBarVisible: false
    };

    constructor(props){
        super(props);
    }

    state = {
        carregando: false,
        dados: [],
        offset: 0,
        semMaisDados: false,
        modalComentarios: {
            visible: false
        },
        id_post: this.props.navigation.getParam('id_post', '-1'),
        comentario: "",
        comentando: false
    }

    componentDidMount(){
        console.log("to no didmount bb")
        this.carregarDadosIniciais();
    }

    carregarDadosIniciais() {
        this.setState({
            offset: 0,
            dados: [],
            semMaisDados: false
        }, this.carregarDados)
    }

    async carregarDados() {
        console.log("to aquiii")
        if (!this.state.semMaisDados){
            let id_usuario = await this.getIdUsuarioLogado();
            let result = await this.callMethod("getCommentsByIdPost", { id_post: this.state.id_post, id_usuario, limit: 10, offset: this.state.offset });
            if (result.success){
                if (result.result.length == 0){
                    this.setState({
                        semMaisDados: true
                    })
                } else {
                    if (result.result.length < 10){
                        await this.setState({
                            semMaisDados: true
                        })
                    }
                    let dados = this.state.dados;
                    for (var i = 0; i < result.result.length; i++){
                        dados.push(result.result[i]);
                    }
                    this.setState({
                        dados: dados
                    }, function() {
                        console.log("TODOS OS DADOS = ", this.state.dados)
                    });
                }
            }
        } else {
            console.log("bbbbbbbbbbbb")
        }
        console.log("aaaaaaaaaaaaaa")
    }

    pegarDados(){
        this.setState({
            offset: this.state.offset + 10
        }, this.carregarDados);        
    }

    returnFooterComponent(){
        if (!this.state.semMaisDados){
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 20, marginBottom: 40 }}/>
        } else return <View style={{marginBottom: 20}}></View>
    }

    returnLoader(index){
        if (index == this.state.dados.length-1 && !this.state.semMaisDados)
            return <ActivityIndicator color="#27ae60" size="large" style={{  marginTop: 15, marginBottom: 15 }}/>
        return;
    }

    returnLoaderInicial(){
        if (this.state.dados.length == 0 && !this.state.semMaisDados)
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 30 }}/>
        return;
    }

    returnBotaoEnviar(){
        if (!this.state.comentando)
            return (
                <View style={styles.botaoEnviar}>
                    <Icon name="rocket" size={16} color="#F8F8F8" onPress={() => this.comentarPost()}/>
                </View>
            );
        return <ActivityIndicator color="#27ae60"/>
    }

    async comentarPost(){
        await this.setState({
            comentando: true
        })
        let id_usuario = await this.getIdUsuarioLogado();
        let result = await this.callMethod("commentPost", { id_post: this.state.id_post, id_usuario, comentario: this.state.comentario });
        if (result.success){
            let dados = this.state.dados;
            await dados.unshift(result.result);
            console.log("dados = ", dados)
            await this.setState({
                dados: []
            })
            await this.setState({
                dados: dados
            })
            console.log("dados agora = ", this.state.dados)
        }
        await this.setState({
            comentando: false,
            comentario: ""
        })
    }

    render(){
        return (      
            <View style={{flex: 1}}>
                {this.returnLoaderInicial()}
                <FlatList
                    data={this.state.dados}
                    keyExtractor={(item, index) => item.id_post.toString()}
                    renderItem={({item, index}) => (
                        
                        <View>
                            <Comentario data={item}/>
                            {this.returnLoader(index)}
                        </View>

                    )}
                    refreshing={this.state.carregando}
                    onRefresh={() => this.carregarDadosIniciais()}
                    onEndReached={() => this.pegarDados()}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => this.returnFooterComponent()}
                    legacyImplementation={true}
                    enableEmptySections={true}
                />
                <View style={styles.caixaTexto}>
                        <TextInput
                            placeholder="Escreva um comentário"
                            placeholderTextColor="rgb(153, 153, 153)"
                            value={this.state.comentario}
                            onChangeText={(comentario) => this.setState({comentario})}
                            style={styles.caixaTextoComentario}
                            onSubmitEditing={() => this.comentarPost()}
                        />
                        <View style={styles.botaoEnviarGenerico}>
                            {this.returnBotaoEnviar()}
                        </View>
                </View>
            </View>
        );
    }
}

const styles = {
    caixaTexto: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 10,
        alignItems: 'center',
        background: '#fff',
    },
    caixaTextoComentario: {
        height: 40,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
    },
    botaoEnviar: {
        backgroundColor: '#27ae60',
        height: 40,
        width: 40,
        borderRadius: 40/2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoEnviarGenerico: {
        height: 40,
        width: 40,
        borderRadius: 40/2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    }
}