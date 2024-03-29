import React, { Component } from 'react';
import { View, Text, Image, Dimensions, NativeModules, Platform, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, KeyboardAvoidingView, SafeAreaView, Keyboard } from 'react-native';
const { StatusBarManager } = NativeModules;
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Comentario from '../../../components/Comentario/Comentario';
import SemDados from '../../../components/SemDados/SemDados';


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
        carregandoInicial: true,
        refreshing: false,
        dados: [],
        offset: 0,
        semMaisDados: false,
        modalComentarios: {
            visible: false
        },
        id_post: this.props.navigation.getParam('id_post', '-1'),
        comentario: "",
        comentando: false,
        statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
        btnLocation: 0
    }

    componentWillMount(){
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
    }

    keyboardWillShow(e) {
        this.setState({btnLocation: e.endCoordinates.height})
      }
    
      keyboardWillHide(e) {
        this.setState({btnLocation: 0})
      }

    componentDidMount(){
        if (Platform.OS === 'ios'){
            StatusBarManager.getHeight(statusBar => {
                this.setState({
                    statusBarHeight: statusBar.height
                })
            })    
        }
        this.carregarDadosIniciais();
    }

    carregarDadosIniciais() {
        this.setState({
            offset: 0,
            semMaisDados: false,
            refreshing: true
        }, this.carregarDados)
    }

    async carregarDados() {
        console.log("to aquiii")
        if (!this.state.semMaisDados){
            let result = await this.callMethod("getCommentsByIdPost", { id_post: this.state.id_post, limit: 10, offset: this.state.offset });
            if (result.success){
                
                if (this.state.refreshing){
                    await this.setState({
                        dados: []
                    })
                }
                if (result.result.length == 0){
                    this.setState({
                        semMaisDados: true,
                    })
                } else {
                    if (result.result.length < 10){
                        await this.setState({
                            semMaisDados: true,
                        })
                    }
                    let dados = this.state.dados;
                    for (var i = 0; i < result.result.length; i++){
                        dados.push(result.result[i]);
                    }
                    this.setState({
                        dados: dados,
                    });
                }
            } else {
            }
            this.setState({
                carregandoInicial: false,
                refreshing: false
            })
        }
    }

    pegarDados(){
        this.setState({
            offset: this.state.offset + 10
        }, this.carregarDados);        
    }

    returnFooterComponent(){
        if (!this.state.semMaisDados){
            return <ActivityIndicator color="#777" size="small" style={{ marginTop: 20, marginBottom: 40 }}/>
        } else return <View style={{marginBottom: 20}}></View>
    }

    returnLoader(index){
        if (index == this.state.dados.length-1 && !this.state.semMaisDados && !this.state.refreshing)
            return <ActivityIndicator color="#777" size="small" style={{  marginTop: 15, marginBottom: 15 }}/>
        return;
    }

    returnLoaderInicial(){
        if (this.state.dados.length == 0 && !this.state.semMaisDados)
            return <ActivityIndicator color="#777" size="small" style={{ marginTop: 30 }}/>
        return;
    }

    returnBotaoEnviar(){
        if (!this.state.comentando)
            return (
                <TouchableOpacity style={styles.botaoEnviar}  onPress={() => this.comentarPost()}>
                    <Icon name="rocket" size={16} color="#F8F8F8"/>
                </TouchableOpacity>
            );
        return <ActivityIndicator color="#27ae60"/>
    }

    async comentarPost(){
        if (this.state.comentario.length > 0){
            await this.setState({
                comentando: true
            })
            let result = await this.callMethod("commentPost", { id_post: this.state.id_post, comentario: this.state.comentario });
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
    }

    renderCaixaTexto(){
        return (
            <KeyboardAvoidingView style={[styles.caixaTexto, {bottom: this.state.btnLocation}]}>
                <TextInput
                    placeholder="Escreva um comentário"
                    placeholderTextColor="rgb(153, 153, 153)"
                    value={this.state.comentario}
                    onChangeText={(comentario) => this.setState({comentario})}
                    style={styles.caixaTextoComentario}
                    returnKeyType="send"
                    onSubmitEditing={() => this.comentarPost()}
                />
                <View style={styles.botaoEnviarGenerico}>
                    {this.returnBotaoEnviar()}
                </View>
            </KeyboardAvoidingView>
        );
    }

    renderView(){
        if (this.state.dados.length == 0 && !this.state.refreshing){
            return <SemDados titulo={"Nenhum comentário"} texto={"Esse post ainda não tem comentários."}/>
        }
        return (
            <FlatList
                data={this.state.dados}
                keyExtractor={(item, index) => item.id_comentario.toString()}
                renderItem={({item, index}) => (
                    
                    <View>
                        <Comentario data={item} navigation={this.props.navigation} onDelete={() => this.carregarDadosIniciais()}/>
                        {this.returnLoader(index)}
                    </View>

                )}
                refreshing={this.state.refreshing}
                onRefresh={() => this.carregarDadosIniciais()}
                onEndReached={() => this.pegarDados()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => this.returnFooterComponent()}
                legacyImplementation={true}
                enableEmptySections={true}
            />
        );
    }

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="small" color="#777" />
                    </View>
                    {this.renderCaixaTexto()}
                </View>
            );
        }
        return (      
            <View style={{flex: 1}}>
                {this.renderView()}
                {this.renderCaixaTexto()}
            </View>
        );
    }
}

const styles = {
    caixaTexto: {
        position: 'absolute',
        left: 0, right: 0,
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
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
    botaoBloqueado: {
        opacity: .4
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