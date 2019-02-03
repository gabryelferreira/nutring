import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FotoPerfil from '../../../components/FotoPerfil/FotoPerfil';
import SemDadosPerfil from '../../../components/SemDadosPerfil/SemDadosPerfil';
import Galeria from '../../../components/Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Perfil extends Network {

    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('nome', ''),
        headerRight: (
            <TouchableOpacity onPress={() => {
                navigation.navigate("Configuracoes");
            }} style={{paddingRight: 10, flexDirection: 'row'}}>
                <Icon name="cog" size={22} color={navigation.getParam('cor_texto', '#000')} style={[!navigation.getParam('sou_eu', "") ? {height: 0} : {}]}/>
            </TouchableOpacity>
        ),
        headerTintColor: navigation.getParam('cor_texto', '#000'),
        headerStyle: {
            backgroundColor: navigation.getParam('cor_fundo', '#fff'),
            borderBottom: 1,
            borderColor: '#ddd',
            elevation: 1,
            shadowOpacity: 0,
            height: 50,
        }
    });

    constructor(props){
        super(props);
        this.state = {
            tabSelecionada: 0,
            refreshing: true,
            carregandoPrimeiraVez: true,
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
                sou_eu: false,
                cnpj: ""
            },
            offset: 0,
            dados: [],
            semMaisDados: false,
            seguindo: false,
            parandoDeSeguir: false,
            cor_fundo: '#fff',
            cor_texto: '#000',

            //GALERIA E MODAL DA GALERIA
            fotosGaleria: [],
            modal: {
                visible: false,
                titulo: "Alteração de foto",
                subTitulo: "Deseja alterar sua foto de perfil?",
                botoes: this.criarBotoes()
            }
        }
    }

    componentDidMount(){
        console.log("to no didmount bb")
        this.getPerfil();
        this.props.navigation.setParams({
            cor_fundo: '#fff',
            sou_eu: this.state.sou_eu
        })
    }

    async getPerfil(){
        if (!this.state.refreshing){
            await this.setState({
                refreshing: true,
            })
        }
        let id_usuario_perfil = this.props.navigation.getParam('id_usuario_perfil', "");
        let result = await this.callMethod("getPerfilV2", { id_usuario_perfil });
        if (result.success){
            this.props.navigation.setParams({
                nome: result.result.nome,
                sou_eu: result.result.sou_eu
            })
            if (result.result.cor_fundo)
                this.props.navigation.setParams({
                    cor_fundo: '#' + result.result.cor_fundo
                })
            if (result.result.cor_texto)
                this.props.navigation.setParams({
                    cor_texto: '#' + result.result.cor_texto
                })
            else
                this.props.navigation.setParams({
                    cor_texto: "#000"
                })
            this.setState({
                user: result.result,
                refreshing: false
            }, this.carregarFotosIniciais)
        }
        this.setState({
            carregandoPrimeiraVez: false
        })
    }

    async carregarFotosIniciais() {
        console.log("carregando seus dados iniciais bb")
        await this.setState({
            offset: 0,
            semMaisDados: false,
            dados: []
        })
        this.carregarDados();
    }

    async carregarDados() {
        if (!this.state.semMaisDados){
            let id_usuario_perfil = this.props.navigation.getParam('id_usuario_perfil', "");
            let result = await this.callMethod("getFotosByIdUsuario", { id_usuario_perfil, offset: this.state.offset, limit: 18 })
            if (result.success){
                if (result.result.length == 0){
                    this.setState({
                        semMaisDados: true
                    })
                } else {
                    let dados = [];
                    if (!this.state.refreshing){
                        dados = this.state.dados;
                    }
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
            refreshing: false
        })
    }

    pegarDados(){
        this.carregarDados();        
    }

    returnHeaderComponent(){
        if (this.state.user.cnpj)
            return this.renderInfoPerfilRestaurante();
        if (this.state.user.nome)
            return this.renderInfoPerfil();
        return null;
    }

    getTextoSemFotos(){
        if (this.state.user.sou_eu)
            return "Que tal publicar um hoje? ;)";
        return "Esse usuário não possui publicações"
    }

    returnFooterComponent(){
        if (!this.state.semMaisDados && !this.state.refreshing){
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginVertical: 20 }}/>
        } else if (!this.state.refreshing && this.state.semMaisDados && this.state.dados.length == 0){
            return (
                <SemDadosPerfil icone={"utensils"} titulo={"Ainda não há pratos"} texto={this.getTextoSemFotos()} seta={false}/>
            );
        } return null;
    }

    returnLoaderInicial(){
        if (this.state.refreshing)
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 30 }}/>
        return;
    }

    editarPerfil(){
        this.props.navigation.navigate("EditarPerfil", {
            onGoBack: () => this.getPerfil(),
            user: this.state.user
          });
    }

    async seguir(){
        let id_seguido = this.props.navigation.getParam('id_usuario_perfil', "");
        await this.setState({
            seguindo: true
        })
        let result = await this.callMethod("follow", { id_seguido });
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
        let id_seguido = this.props.navigation.getParam('id_usuario_perfil', "");
        await this.setState({
            parandoDeSeguir: true
        })
        let result = await this.callMethod("unfollow", { id_seguido });
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

    renderBotaoSeguir(color = "#000"){
        if (this.state.parandoDeSeguir || this.state.seguindo)
            return this.renderBotaoCarregandoSeguindo(color);
        if (this.state.user.sou_eu){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.editarPerfil()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Editar Perfil</Text>
                </TouchableOpacity>
            );
        }
        if (this.state.user.is_seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="check" color="#28b657" size={13} />
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={styles.botaoEditar} onPress={() => this.seguir()}>
                <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguir</Text>
            </TouchableOpacity>
        );
    }

    renderBotaoCarregandoSeguindo(color = "#000"){
        if (this.state.seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
        if (this.state.parandoDeSeguir){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguir</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderLocalizacao(){
        if (this.state.user.cidade && this.state.user.estado){
            return (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Icon name="map-marker-alt" color="#fff" size={14} style={{marginRight: 5}}/>
                    <Text style={styles.localizacao}>{this.state.user.cidade} - {this.state.user.estado}</Text>
                </View>
            );
        }
        return null;
    }

    renderDescricao(){
        if (this.state.user.descricao){
            return <Text style={styles.descricao}>{this.state.user.descricao}</Text>;
        }
        return null;
    }

    renderInfoPerfil(){
        let { nome, descricao, seguidores, seguindo, sou_eu, is_seguindo_voce, is_seguindo, idade, id_usuario, posts, foto } = this.state.user;
        return (
            <View style={styles.viewPerfil}>
                <View style={styles.viewInfo}>
                    <TouchableOpacity style={styles.viewFoto} onPress={() => this.validarAlteracaoFoto()}>
                        <Image resizeMethod="resize" style={{height: 80, width: 80, borderRadius: 80/2}} source={{uri: foto}}/>
                    </TouchableOpacity>
                    <Text style={styles.nome}>{nome}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 30}}>
                        {this.renderDescricao()}
                    </View>
                    {this.renderBotaoSeguir()}
                    <View style={styles.tabs}>
                        <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="utensils" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>PRATOS</Text>
                            </View>
                            <Text style={styles.tabTexto}>{posts}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.push("Seguidores", { id_usuario_perfil: id_usuario})} style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="chart-line" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUIDORES</Text>
                            </View>
                            <Text style={styles.tabTexto}>{seguidores}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.push("Seguindo", { id_usuario_perfil: id_usuario})} style={styles.tab}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="running" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUINDO</Text>
                            </View>
                            <Text style={styles.tabTexto}>{seguindo}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <View style={styles.viewReceitas}>
                    <View style={styles.viewInfoReceitas}>
                        <Text style={styles.tituloReceitas}>Receitas</Text>
                        <Text style={styles.subTituloReceitas}>Compartilhe suas receitas favoritas</Text>
                    </View>
                    <View style={styles.receitas}>
                        <View style={styles.receita}>
                            <TouchableOpacity style={styles.bolaReceita}>
                                <Icon name="plus" size={18} color="#000"/>
                            </TouchableOpacity>
                            <Text style={styles.textoReceita}>Nova receita</Text>
                        </View>
                    </View>
                </View> */}

                <View style={styles.fotos}>
                    <View style={styles.tabsFotos}>
                        <TouchableOpacity style={styles.tabFotos} activeOpacity={1}>
                            <Icon name="grip-horizontal" solid size={22} style={[this.state.tabSelecionada == 0 ? {color: '#000'} : {color: '#000'}]}/>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 1})}>
                            <Icon name="star" solid size={22} style={[this.state.tabSelecionada == 1 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 2})}>
                            <Icon name="user" solid size={22} style={[this.state.tabSelecionada == 2 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        );
    }

    renderDescricaoRestaurante(color = '#000'){
        if (this.state.user.descricao){
            return <Text style={[styles.descricaoRestaurante, {color: color}]}>{this.state.user.descricao}</Text>;
        }
        return <Text style={[styles.descricaoRestaurante, {color: color}]}>Conheça o {this.state.user.nome}!</Text>;
    }

    renderBotaoAlterarCapa(sou_eu){
        if (sou_eu){
            return (
                <TouchableOpacity onPress={() => {
                    this.tipoFoto = "capaPerfil"
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
                    marginTop: 10,
                    borderRadius: 20
                }}>
                    <Text style={{fontSize: 10, color: '#eee', fontWeight: 'bold'}}>Alterar capa</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderInfoPerfilRestaurante(){
        let { nome, descricao, seguidores, seguindo, sou_eu, is_seguindo_voce, is_seguindo, id_usuario, posts, foto, cor_texto, cor_fundo, capa } = this.state.user;
        let background = cor_fundo ? '#' + cor_fundo : '#fff';
        let color = cor_texto ? '#' + cor_texto : '#000';
        return (
            <View style={styles.viewPerfilRestaurante}>
                {/* <StatusBar backgroundColor={background} /> */}
                <View style={styles.capa}>
                    <View style={[styles.capa, {backgroundColor: 'rgba(0, 0, 0, .4)',  zIndex: 2, alignItems: 'flex-end'}]}>
                        {this.renderBotaoAlterarCapa(sou_eu)}
                    </View>
                    <Image resizeMethod="resize" source={{uri: capa}} style={{flex: 1, zIndex: 1, height: undefined, width: undefined}}/>
                </View>

                {/*começo do perfil*/}
                <View style={styles.viewInfoRestaurante}>
                
                    <View style={styles.viewInfoContato}>
                        <View style={styles.infoContato}><Icon name="comment" size={18} solid color="#fff"/></View>
                        <TouchableOpacity style={{height: 105, width: 105, borderRadius: 105/2}} onPress={() => this.validarAlteracaoFoto()}>
                            <Image resizeMethod="resize" style={{height: 105, width: 105, borderRadius: 105/2}} source={{uri: foto}}/>
                            <View style={{position: 'absolute', left: 0, right: 0, bottom: -12, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'}}>
                                <AutoHeightImage source={require('../../../assets/imgs/folhinha_da_macunha.png')}  width={30}/>
                            
                            </View>
                        </TouchableOpacity>
                        <View style={styles.infoContato}><Icon name="phone" size={18} solid color="#fff"/></View>
                    </View>

                    <Text style={styles.tituloRestaurante}>{nome}</Text>
                    {this.renderLocalizacao()}

                    <View style={[styles.modalInfoRestaurante, {backgroundColor: background}, [background ? {borderColor: background} : {}]]}>
                        <View style={[styles.barraDescricaoRestaurante, [background ? {borderBottomColor: background} : {}]]}>
                            {this.renderDescricaoRestaurante(color)}
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            {this.renderBotaoSeguir(color)}
                        </View>
                        <View style={styles.tabs}>
                            <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                                <View style={styles.infoTab}>
                                    {/* <Icon name="utensils" size={15} color="#aaa"/> */}
                                    <Text style={[styles.tabTitulo, {color: color}]}>PRATOS</Text>
                                </View>
                                <Text style={[styles.tabTexto, {color: color}]}>{posts}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.push("Seguidores", { id_usuario_perfil: id_usuario})} style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                                <View style={styles.infoTab}>
                                    {/* <Icon name="chart-line" size={15} color="#aaa"/> */}
                                    <Text style={[styles.tabTitulo, {color: color}]}>SEGUIDORES</Text>
                                </View>
                                <Text style={[styles.tabTexto, {color: color}]}>{seguidores}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.push("Seguindo", { id_usuario_perfil: id_usuario})} style={styles.tab}>
                                <View style={styles.infoTab}>
                                    {/* <Icon name="running" size={15} color="#aaa"/> */}
                                    <Text style={[styles.tabTitulo, {color: color}]}>SEGUINDO</Text>
                                </View>
                                <Text style={[styles.tabTexto, {color: color}]}>{seguindo}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                
                </View>


                <View style={styles.fotos}>
                    <View style={styles.tabsFotos}>
                        <TouchableOpacity style={styles.tabFotos} activeOpacity={1}>
                            <Icon name="grip-horizontal" solid size={22} style={[this.state.tabSelecionada == 0 ? {color: '#000'} : {color: '#000'}]}/>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 1})}>
                            <Icon name="star" solid size={22} style={[this.state.tabSelecionada == 1 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 2})}>
                            <Icon name="user" solid size={22} style={[this.state.tabSelecionada == 2 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        );
    }

    returnFotos(){
        return (
            <FlatList
            data={this.state.dados}
            keyExtractor={(item, index) => item.id_post.toString()}
            numColumns={3}
            renderItem={({item, index}) => (
                <FotoPerfil data={item} index={index} onPress={() => this.props.navigation.push("Postagem", { id_post: item.id_post, onGoBack: () => this.getPerfil(), } )}/>
            )}
            refreshing={this.state.refreshing}
            onRefresh={() => this.getPerfil()}
            onEndReached={() => this.pegarDados()}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={() => this.returnHeaderComponent()}
            ListFooterComponent={() => this.returnFooterComponent()}
            />
        );
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

    criarBotoes(){
        let botoes = [
            {chave: "ALTERAR", texto: "Abrir galeria", color: '#27ae60', fontWeight: 'bold'},
            {chave: "TENTAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    setModalState(visible){
        this.setState({
            modal: {
                visible: visible
            }
        })
    }

    getModalClick(key){
        this.setModalState(false);
        console.log("clicando no " + key)
        if (key == "ALTERAR"){
            this.requisitarPermissaoGaleria();
        }
    }

    tipoFoto;

    async alterarFotoPerfil(foto){
        this.setState({
            refreshing: true,
            galeriaAberta: false,
        })
        RNFetchBlob.fs.readFile(foto, 'base64')
        .then(async (data) => {
            let url = `data:image/jpg;base64,${data}`;
            let result;
            if (this.tipoFoto == "capaPerfil"){
                result = await this.callMethod("alterarCapaPerfil", { foto: url });
            } else {
                result = await this.callMethod("alterarFotoPerfil", { foto: url });
            }
            if (result.success){
                this.getPerfil();
            } else {
                this.showModal("Ocorreu um erro", "Parece que você está sem internet. Verifique-a e tente novamente.");
                this.setState({
                    refreshing: false
                })
            }
        }).catch((error) => {
            console.warn(error)
        })
    }

    showModal(titulo, subTitulo){
        this.setState({
            modal: {
                visible: true,
                titulo,
                subTitulo
            }
        })
    }

    validarAlteracaoFoto(){
        if (this.state.user.sou_eu){
            this.setState({
                modal: {
                    visible: true,
                    titulo: "Alteração de foto",
                    subTitulo: "Deseja alterar sua foto de perfil?",
                    botoes: this.criarBotoes()
                }
            })
        }
    }

    render(){
        let { nome, foto } = this.state.user;
        if (this.state.carregandoPrimeiraVez){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        if (this.state.galeriaAberta){
            return <Galeria fotos={this.state.fotosGaleria} onPress={(foto) => this.alterarFotoPerfil(foto)} onClose={() => this.setState({galeriaAberta: false})}/>
        }
        return (      
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.setState({modal: {visible: false}})}
                    botoes={this.state.modal.botoes}
                />
                {/* <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}> */}
                    {this.returnFotos()}


                        {/*fotos aqui*/}
                        

                {/* </ScrollView> */}
            </View>
        );
    }
}

const styles = {
    viewPerfil: {
        marginTop: 20
    },
    viewInfo: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    viewFoto: {
        height: 80,
        width: 80,
        borderRadius: 80/2,
        elevation: 30,
        backgroundColor: '#000'
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10
    },
    descricao: {
        marginTop: 5,
        color: '#000',
        fontSize: 13,
        textAlign: 'center'
    },
    botaoEditar: {
        marginTop: 10,
        width: 140,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        flexDirection: 'row'
    },
    textoBotaoEditar: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold'
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 10,
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
        fontSize: 9,
        color: '#aaa',
        marginLeft: 5,
        letterSpacing: 1.1
    },
    tabTexto: {
        fontSize: 16,
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
        marginTop: 10,
        flexDirection: 'row'
    },
    receita: {
        flexDirection: 'column',
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bolaReceita: {
        height: 50,
        width: 50,
        borderRadius: 50/2,
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
        marginTop: 10,
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
    },










    //RESTAURANTE

    viewPerfilRestaurante: {
        paddingTop: 30
    },
    capa: {
        position: 'absolute',
        height: 250,
        left: 0,
        top: 0,
        right: 0,
        backgroundColor: '#000'
    },
    viewInfoRestaurante: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    viewInfoContato: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoContato: {
        width: 35,
        height: 35,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, .4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    tituloRestaurante: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 15
    },
    localizacao: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    modalInfoRestaurante: {
        flexDirection: 'column',
        marginVertical: 10,
        paddingBottom: 10,
        width: imageWidth/10 * 9,
        borderWidth: 1,
        elevation: 5
        
    },
    barraDescricaoRestaurante: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderBottomWidth: 1,
        elevation: 5,
    },
    descricaoRestaurante: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    }


}