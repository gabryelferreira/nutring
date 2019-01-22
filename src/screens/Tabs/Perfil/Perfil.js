import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FotoPerfil from '../../../components/FotoPerfil/FotoPerfil';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Perfil extends Network {

    static navigationOptions = ({navigation}) => ({
        title: 'Perfil',
        headerRight: (
            <TouchableOpacity onPress={() => {
                AsyncStorage.removeItem("userData").then(() => {
                    // const resetAction = StackActions.reset({
                        // index: 0,
                        // actions: [NavigationActions.navigate({ routeName: 'Feed' })],
                    // });
                    // navigation.dispatch(resetAction);
                    navigation.navigate("Feed");
                    navigation.navigate("Principal");
                }).catch((error) => {
                    console.error(error);
                })
            }} style={{paddingRight: 10, flexDirection: 'row'}}>
                <Icon name="power-off" size={22} color="#000" style={[navigation.getParam('id_usuario_perfil', null) ? {height: 0} : {}]}/>
            </TouchableOpacity>
        )
    });

    constructor(props){
        super(props);
        this.state = {
            tabSelecionada: 0,
            carregando: true,
            user: {
                descricao: null,
                dt_nasc: "",
                email: "",
                foto: null,
                id_usuario: 0,
                idade: 0,
                is_seguindo: false,
                is_seguindo_voce: false,
                nome: "",
                posts: "",
                seguidores: "",
                seguindo: "",
                sexo: "",
                sou_eu: "",
            },
            offset: 0,
            dados: [],
            semMaisDados: false,
            seguindo: false,
            parandoDeSeguir: false
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
        let id_usuario = await this.getIdUsuarioLogado();
        let id_usuario_perfil = this.props.navigation.getParam('id_usuario_perfil', id_usuario);
        let result = await this.callMethod("getPerfilV2", { id_usuario, id_usuario_perfil });
        if (result.success){
            this.setState({
                user: result.result,
            }, this.carregarFotosIniciais)
        }
    }

    async carregarFotosIniciais() {
        console.log("carregando seus dados iniciais bb")
        await this.setState({
            offset: 0,
            dados: [],
            semMaisDados: false
        })
        this.carregarDados();
    }

    async carregarDados() {
        if (!this.state.semMaisDados){
            let _id_usuario = await this.getIdUsuarioLogado();
            let id_usuario = this.props.navigation.getParam('id_usuario_perfil', _id_usuario);
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
                    await this.setState({
                        dados: dados,
                        offset: this.state.offset + 18
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
        this.carregarDados();        
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

    async deslogar(){
        try {
            await AsyncStorage.removeItem("userData");
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Feed' })],
            });
            this.props.navigation.dispatch(resetAction);
            this.props.navigation.navigate('Principal');
        } catch (error) {
            console.error(error);
        }
    }

    editarPerfil(){

    }

    async seguir(){
        let id_usuario = await this.getIdUsuarioLogado();
        let id_seguido = this.props.navigation.getParam('id_usuario_perfil', -1);
        await this.setState({
            seguindo: true
        })
        let result = await this.callMethod("follow", { id_usuario, id_seguido });
        if (result.success){
            let user = this.state.user;
            user.is_seguindo = true;
            user.seguidores = user.seguidores + 1;
            await this.setState({
                user: user
            })
        }
        await this.setState({
            seguindo: false
        })
    }

    async pararDeSeguir(){
        let id_usuario = await this.getIdUsuarioLogado();
        let id_seguido = this.props.navigation.getParam('id_usuario_perfil', -1);
        await this.setState({
            parandoDeSeguir: true
        })
        let result = await this.callMethod("unfollow", { id_usuario, id_seguido });
        if (result.success){
            let user = this.state.user;
            user.is_seguindo = false;
            user.seguidores = user.seguidores - 1;
            await this.setState({
                user: user
            })
        }
        await this.setState({
            parandoDeSeguir: false
        })
    }

    renderBotaoSeguir(){
        if (this.state.parandoDeSeguir || this.state.seguindo)
            return this.renderBotaoCarregandoSeguindo();
        if (this.state.user.sou_eu){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.editarPerfil()}>
                    <Text style={styles.textoBotaoEditar}>Editar Perfil</Text>
                </TouchableOpacity>
            );
        }
        if (this.state.user.is_seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={styles.textoBotaoEditar}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="check" color="#28b657" size={13} />
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={styles.botaoEditar} onPress={() => this.seguir()}>
                <Text style={styles.textoBotaoEditar}>Seguir</Text>
            </TouchableOpacity>
        );
    }

    renderBotaoCarregandoSeguindo(){
        if (this.state.seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={styles.textoBotaoEditar}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
        if (this.state.parandoDeSeguir){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={styles.textoBotaoEditar}>Seguir</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderDescricao(){
        if (this.state.user.descricao){
            return <Text style={styles.descricao}>{descricao}</Text>;
        }
        return null;
    }

    renderInfoPerfil(){
        let { nome, descricao, seguidores, seguindo, sou_eu, is_seguindo_voce, is_seguindo, idade, id_usuario, posts } = this.state.user;
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
                    {this.renderDescricao()}
                    {this.renderBotaoSeguir()}
                    <View style={styles.tabs}>
                        <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="utensils" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>PRATOS</Text>
                            </View>
                            <Text style={styles.tabTexto}>{posts}</Text>
                        </View>
                        <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="chart-line" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUIDORES</Text>
                            </View>
                            <Text style={styles.tabTexto}>{seguidores}</Text>
                        </View>
                        <View style={styles.tab}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="running" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUINDO</Text>
                            </View>
                            <Text style={styles.tabTexto}>{seguindo}</Text>
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

    returnFotos(){
        if (!this.state.carregando){
            return (
                <FlatList
                data={this.state.dados}
                keyExtractor={(item, index) => item.id_post.toString()}
                numColumns={3}
                renderItem={({item, index}) => (
                    <FotoPerfil data={item} index={index}/>
                )}
                refreshing={false}
                onRefresh={() => this.getPerfil()}
                onEndReached={() => this.pegarDados()}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={() => this.returnHeaderComponent()}
                ListFooterComponent={() => this.returnFooterComponent()}
                />
            );
        } else return null;
    }

    render(){
        let { nome, foto } = this.state.user;
        return (      
            <View style={{flex: 1}}>
                {/* <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}> */}
                    {this.returnLoaderInicial()}
                    {this.returnFotos()}


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
        marginTop: 15
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
        width: 175,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        flexDirection: 'row'
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
        width: 100,
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