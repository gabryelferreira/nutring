import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Perfil extends Network {

    static navigationOptions = {
        title: 'Perfil',
        headerRight: (
            <TouchableOpacity style={{paddingRight: 10, flexDirection: 'row'}}>
                <Icon name="cog" size={22} color="#000"/>
            </TouchableOpacity>
        )
    };

    constructor(props){
        super(props);
        this.state = {
            tabSelecionada: 0,
            carregando: true,
            user: {
                acessos: 0,
                altura_m: 0.0,
                cd_objetivo: "",
                ds_objetivo: "",
                dt_nasc: "",
                email: "",
                foto: null,
                id_usuario: 0,
                idade: 0,
                kcal_pratos: 0.0,
                nome: "",
                peso_kg: 0,
                pratos_feitos: 0,
                sexo: "",
                token: "",
                vl_objetivo_kg: 0,
            },
            offset: 0,
            dados: [],
            semMaisDados: false
        }
    }

    componentDidMount(){
        console.log("to no didmount bb")
        this.getPerfil();
    }

    async getPerfil(){
        await this.setState({
            carregando: true,
            carregandoInicial: true
        })
        let id_usuario = await this.getIdUsuarioLogado()
        let result = await this.callMethod("getPerfil", { id_usuario });
        if (result.success){
            this.setState({
                user: result.result,
            }, this.carregarFotosIniciais)
        }
    }

    carregarFotosIniciais() {
        console.log("carregando seus dados iniciais bb")
        this.setState({
            offset: 0,
            dados: [],
            semMaisDados: false
        }, this.carregarDados)
    }

    async carregarDados() {
        if (!this.state.semMaisDados){
            let id_usuario = await this.getIdUsuarioLogado();
            let result = await this.callMethod("getFotosByIdUsuario", { id_usuario: id_usuario, offset: this.state.offset, limit: 18 })
            if (result.success){
                if (result.result.length == 0){
                    this.setState({
                        semMaisDados: true
                    })
                } else {
                    let dados = this.state.dados;
                    for (var i = 0; i < result.result.length; i++){
                        dados.push(result.result[i]);
                    }
                    if (result.result.length < 18){
                        await this.setState({
                            semMaisDados: true
                        })
                    }
                    this.setState({
                        dados: dados
                    }, function() {
                        console.log("TODOS OS DADOS = ", this.state.dados)
                    });
                }
            }
        }
        await this.setState({
            carregando: false,
            carregandoInicial: false
        })
    }

    pegarDados(){
        this.setState({
            offset: this.state.offset + 18
        }, this.carregarDados);        
    }

    returnHeaderComponent(){
        if (!this.state.carregandoInicial){
            return this.renderInfoPerfil();
        }
        return null;
    }

    returnFooterComponent(){
        if (!this.state.semMaisDados && !this.state.carregandoInicial){
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginVertical: 20 }}/>
        } else return null;
    }

    returnLoaderInicial(){
        if (this.state.carregandoInicial)
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 30 }}/>
        return;
    }

    returnFoto(index){
        if (this.state.carregando){
            return null;
        }
        if (index % 3 == 0){
            return (
                <View style={{width: imageWidth / 3, height: imageWidth / 3, flexWrap: 'wrap', marginBottom: 2}}>
                    <Image source={{uri: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'}} style={{flex: 1, height: undefined, width: undefined}}/>
                </View>
            );
        }
        return (
            <View style={{width: imageWidth / 3, height: imageWidth / 3, flexWrap: 'wrap', paddingLeft: 2, marginBottom: 2}}>
                <Image source={{uri: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'}} style={{flex: 1, height: undefined, width: undefined}}/>
            </View>
        );
    }

    renderInfoPerfil(){
        let { nome } = this.state.user;
        return (
            <View style={styles.viewPerfil}>
                <View style={styles.viewInfo}>
                    <View style={styles.viewFoto}>
                        <Image style={{height: 110, width: 110, borderRadius: 110/2}} source={{uri: 'https://noticiasdetv.com/wp-content/uploads/2017/11/Marcela-Fetter-2.png'}}/>
                    </View>
                    <Text style={styles.nome}>{nome}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Icon name="map-marker-alt" color="#000" size={15} style={{marginRight: 5}}/>
                        <Text style={styles.localizacao}>Santos - SP</Text>
                    </View>
                    <Text style={styles.descricao}>Eu vo fica monstro p krl iboa</Text>
                    <TouchableOpacity style={styles.botaoEditar}>
                        <Text style={styles.textoBotaoEditar}>Seguir</Text>
                    </TouchableOpacity>
                    <View style={styles.tabs}>
                        <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="utensils" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>PRATOS</Text>
                            </View>
                            <Text style={styles.tabTexto}>11</Text>
                        </View>
                        <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="chart-line" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUIDORES</Text>
                            </View>
                            <Text style={styles.tabTexto}>255</Text>
                        </View>
                        <View style={styles.tab}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="running" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUINDO</Text>
                            </View>
                            <Text style={styles.tabTexto}>11</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.viewReceitas}>
                    <View style={styles.viewInfoReceitas}>
                        <Text style={styles.tituloReceitas}>Receitas</Text>
                        <Text style={styles.subTituloReceitas}>Compartilhe suas receitas favoritas</Text>
                    </View>
                    <View style={styles.receitas}>
                        <View style={styles.receita}>
                            <TouchableOpacity style={styles.bolaReceita}>
                                <Icon name="plus" size={22} color="#000"/>
                            </TouchableOpacity>
                            <Text style={styles.textoReceita}>Nova receita</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.fotos}>
                    <View style={styles.tabsFotos}>
                        <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 0})}>
                            <Icon name="grip-horizontal" solid size={22} style={[this.state.tabSelecionada == 0 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 1})}>
                            <Icon name="star" solid size={22} style={[this.state.tabSelecionada == 1 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 2})}>
                            <Icon name="user" solid size={22} style={[this.state.tabSelecionada == 2 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    render(){
        let { nome, foto } = this.state.user;
        return (      
            <View style={{flex: 1}}>
                {/* <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}> */}
                    {this.returnLoaderInicial()}
                <FlatList
                data={this.state.dados}
                keyExtractor={(item, index) => item.id_post.toString()}
                numColumns={3}
                renderItem={({item, index}) => (
                    <View>
                        {this.returnFoto(index)}
                    </View>
                )}
                refreshing={false}
                onRefresh={() => this.getPerfil()}
                onEndReached={() => this.pegarDados()}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={() => this.returnHeaderComponent()}
                ListFooterComponent={() => this.returnFooterComponent()}
                />


                        {/*fotos aqui*/}
                        

                {/* </ScrollView> */}
            </View>
        );
    }
}

const styles = {
    viewPerfil: {
        marginTop: 30
    },
    viewInfo: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    viewFoto: {
        height: 110,
        width: 110,
        borderRadius: 110/2,
        elevation: 30,
        backgroundColor: '#000'
    },
    nome: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 15,
        fontFamily: 'Coiny-Regular.ttf'
    },
    localizacao: {
        color: '#000',
        fontSize: 12
    },
    descricao: {
        marginTop: 10,
        color: '#000',
        fontSize: 14
    },
    botaoEditar: {
        marginTop: 15,
        paddingHorizontal: 60,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5
    },
    textoBotaoEditar: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold'
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tab: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    infoTab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3
    },
    tabTitulo: {
        fontSize: 10,
        color: '#aaa',
        marginLeft: 5,
        letterSpacing: 1.1
    },
    tabTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222'
    },
    viewReceitas: {
        marginTop: 10,
        paddingVertical: 10,
        flexDirection: 'column',
        borderTopColor: '#ddd',
        borderTopWidth: 1
    },
    viewInfoReceitas: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    tituloReceitas: {
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold'
    },
    subTituloReceitas: {
        fontSize: 13,
        color: '#333',
    },
    receitas: {
        paddingVertical: 10,
        flexDirection: 'row'
    },
    receita: {
        flexDirection: 'column',
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bolaReceita: {
        height: 60,
        width: 60,
        borderRadius: 60/2,
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoReceita: {
        fontSize: 12,
        color: '#000',
        marginTop: 5
    },
    fotos: {
        flexDirection: 'column',
    },
    tabsFotos: {
        flex: 1,
        flexDirection: 'row',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    tabFotos: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
}