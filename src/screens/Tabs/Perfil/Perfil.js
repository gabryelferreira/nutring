import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Linking, Modal } from 'react-native';
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
import ModalPostagemViewer from '../../../components/ModalPostagemViewer/ModalPostagemViewer';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Perfil extends Network {

    imagens = [
        'http://www.pacodasaguas.com.br/wp-content/uploads/2017/12/27-12-1080x630.jpg',
        'https://abrilmdemulher.files.wordpress.com/2017/01/receita-feijoada.jpg?quality=90&strip=info&w=620',
        'https://culinaria.culturamix.com/blog/wp-content/gallery/como-fazer-pratos-de-restaurante-2/Como-Fazer-Pratos-de-Restaurante-2.jpg',
        'https://img.elo7.com.br/product/zoom/22565B3/adesivo-parede-prato-comida-frango-salada-restaurante-lindo-adesivo-parede.jpg'
    ]

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
            modalFotoVisible: false,

            //GALERIA E MODAL DA GALERIA
            fotosGaleria: [],
            modal: {
                visible: false,
                titulo: "Foto de Perfil",
                subTitulo: "O que deseja fazer com sua foto de perfil?",
                botoes: this.criarBotoes()
            },
            infoRestauranteVisible: false
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
        let result = await this.callMethod("getPerfil", { id_usuario_perfil });
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
        if (this.state.user.is_restaurante)
            return this.renderInfoPerfilRestaurante();
        
        return this.renderInfoPerfil();
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
        let result = await this.callMethod("followUnfollow", { id_seguido });
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
        let result = await this.callMethod("followUnfollow", { id_seguido });
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

    renderCamerazinha(sou_eu){
        if (sou_eu){
            console.log("sou euuuu")
            return (
                <View style={styles.camerazinhaFoto}>
                    <Icon name="camera" size={15} color="#fff"/>
                </View>
            );
        }
        return null;
    }

    renderReceitas(){
        return this.imagens.map(imagem => {
            return (
                <View style={styles.receita}>
                        {/* <Icon name="plus" size={15} color="#000"/> */}
                    <Image resizeMethod="resize" source={{uri: imagem}} style={styles.fotoReceita}/>
                </View>
            );
        })
    }

    renderInfoPerfil(){
        let { nome, descricao, seguidores, seguindo, sou_eu, is_seguindo_voce, is_seguindo, idade, id_usuario, posts, foto, capa } = this.state.user;
        return (
            <View style={styles.viewPerfil}>
                <View style={styles.capaUsuario}>
                    <View style={[styles.capaUsuario, {backgroundColor: 'rgba(0, 0, 0, .4)',  zIndex: 2, alignItems: 'flex-end'}]}>
                        {this.renderBotaoAlterarCapa(sou_eu)}
                    </View>
                    <Image resizeMethod="resize" source={{uri: capa}} style={{flex: 1, zIndex: 1, height: undefined, width: undefined}}/>
                </View>
                <View style={styles.viewInfo}>
                    <TouchableOpacity style={styles.viewFoto} onPress={() => this.validarAlteracaoFoto()}>
                        <Image resizeMethod="resize" style={styles.foto} source={{uri: foto}}/>
                        {this.renderCamerazinha(sou_eu)}
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

                <TouchableOpacity style={styles.viewReceitas} onPress={() => this.props.navigation.push("Receitas", { id_usuario })}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <View style={styles.viewInfoReceitas}>
                            <Text style={styles.tituloReceitas}>Receitas</Text>
                            <Text style={styles.subTituloReceitas}>17 pratos</Text>
                        </View>
                        <View style={styles.receitas}>
                            
                            {this.renderReceitas()}
                        </View>
                    </View>
                    <Icon name="chevron-right" solid size={15} color="#000"/>
                </TouchableOpacity>

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
            console.log("aqui sou eu sim")
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
        let { nome, descricao, seguidores, seguindo, sou_eu, is_seguindo_voce, is_seguindo, id_usuario, posts, foto, cor_texto, cor_fundo, capa, telefone, ddd } = this.state.user;
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
                        <TouchableOpacity onPress={() => this.setState({infoRestauranteVisible: true})} style={styles.infoContato}><Icon name="info" size={18} solid color="#fff"/></TouchableOpacity>
                        <TouchableOpacity style={{height: 105, width: 105, borderRadius: 105/2}} onPress={() => {this.tipoFoto = "fotoPerfil"; this.validarAlteracaoFoto()}}>
                            <Image resizeMethod="resize" style={{height: 105, width: 105, borderRadius: 105/2}} source={{uri: foto}}/>
                            {this.renderCamerazinha(sou_eu)}
                            <View style={{position: 'absolute', left: 0, right: 0, bottom: -12, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'}}>
                                <AutoHeightImage source={require('../../../assets/imgs/folhinha_da_macunha.png')}  width={30}/>
                            
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${ddd}${telefone}`)} style={styles.infoContato}><Icon name="phone" size={18} solid color="#fff"/></TouchableOpacity>
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
            {chave: "ALTERAR", texto: "Alterar", color: '#27ae60', fontWeight: 'bold'},
            {chave: "VER_FOTO", texto: "Visualizar", color: '#27ae60', fontWeight: 'bold'},
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
        } else if (key == "VER_FOTO"){
            this.setState({
                modalFotoVisible: true
            })
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
                    titulo: "Foto de Perfil",
                    subTitulo: "O que deseja fazer com sua foto de perfil?",
                    botoes: this.criarBotoes()
                }
            })
        } else {
            this.setState({
                modalFotoVisible: true
            })
        }
    }

    formatarImagemViewer(foto){
        return [foto]
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

                <ModalPostagemViewer visible={this.state.modalFotoVisible}
                            foto={this.state.user.foto}
                            titulo={this.state.user.nome}
                            imagens={this.formatarImagemViewer(this.state.user.foto)}
                            onSwipeDown={() => this.setState({modalFotoVisible: false})}
                            onClose={() => this.setState({modalFotoVisible: false})}/>

                <Modal
                    
                  animationType="slide"
                    transparent={true}
                    visible={this.state.infoRestauranteVisible}
                    onRequestClose={() => {
                        this.setState({infoRestauranteVisible: false})
                    }}
                    >
                    <TouchableOpacity onPress={() => this.setState({infoRestauranteVisible: false})} style={{flex: 1}}>
                    
                    </TouchableOpacity>
                    <View style={styles.informacoesRestaurante}>
                        <View style={[styles.row, styles.paddingInfoRestaurante, styles.headerInfoRestaurante]}>
                            <View style={[styles.column, {flex: 1}]}>
                                <View style={[styles.row, styles.alignCenter]}>
                                    <Text style={styles.tituloHeaderRestaurante}>{this.state.user.nome}</Text>
                                    <View style={styles.bolaVerde}></View>
                                    <Text style={styles.textoAberto}>Aberto</Text>
                                </View>
                                <View style={[styles.row, styles.alignCenter, {marginTop: 10}]}>
                                    <Icon name="clock" size={15} color="#222" solid/>
                                    <Text style={styles.horarioRestaurante}>Fecha as 23h</Text>
                                </View>
                                <View style={[styles.row, styles.alignCenter, {marginTop: 5}]}>
                                    <Icon name="map-marker-alt" size={15} color="#777" solid/>
                                    <Text style={styles.enderecoRestaurante}>{this.state.user.logradouro}{this.state.user.numero ? ',' : ''} {this.state.user.numero}</Text>
                                </View>
                            </View>
                            <View style={styles.viewFotoRestauranteInfo}>
                                <Image resizeMethod="resize" source={{uri: this.state.user.foto}} style={styles.imagemRestauranteInfo}/>
                            </View>
                            <View style={styles.botaoFecharInfoRestaurante}>
                                <TouchableOpacity onPress={() => this.setState({infoRestauranteVisible: false})}>
                                    <Icon name="times" color="#222" size={24}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.column, styles.paddingInfoRestaurante, styles.viewSobreRestaurante]}>
                            <Text style={styles.tituloSobreRestaurante}>Sobre</Text>
                            <Text style={styles.sobreRestaurante}>{this.state.user.sobre}</Text>
                        </View>
                    </View>
                </Modal>
                
                {/* <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}> */}
                    {this.returnFotos()}


                        {/*fotos aqui*/}
                        

                {/* </ScrollView> */}
            </View>
        );
    }
}

const styles = {

    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column'
    },
    bolaVerde: {
        height: 8,
        width: 8,
        borderRadius: 8/2,
        backgroundColor: '#28b657',
        marginHorizontal: 10
    },
    paddingInfoRestaurante: {
        paddingHorizontal: 25,
        paddingVertical: 15
    },
    alignCenter: {
        alignItems: 'center'
    },

    viewPerfil: {
        paddingTop: 20
    },
    viewInfo: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 55,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    viewFoto: {
        height: 85,
        width: 85,
        borderRadius: 85/2,
        elevation: 30,
        backgroundColor: '#000',
        overflow: 'hidden'
    },
    foto: {
        height: 85,
        width: 85,
        borderRadius: 85/2
    },
    camerazinhaFoto: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, height: 30,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        justifyContent: 'center',
        alignItems: 'center'
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewInfoReceitas: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 25
    },
    tituloReceitas: {
        fontSize: 20,
        color: '#333',
    },
    subTituloReceitas: {
        fontSize: 12,
        color: '#aaa',
    },
    receitas: {
        flexDirection: 'row'
    },
    receita: {
        flexDirection: 'column',
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bolaReceita: {
        height: 30,
        width: 30,
        borderRadius: 30/2,
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fotoReceita: {
        height: 30,
        width: 30,
        borderRadius: 30/2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff'
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
    capaUsuario: {
        position: 'absolute',
        height: 120,
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
    },






    //INFO BAIXO RESTAURANTE
    informacoesRestaurante: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, backgroundColor: '#fff',
        zIndex: 9999,
        borderTopLeftRadius: 35, borderTopRightRadius: 35,
        elevation: 30
    },
    headerInfoRestaurante: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    tituloHeaderRestaurante: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#000'
    },
    textoAberto: {
        color: '#28b657',
        fontWeight: 'bold',
        fontSize: 18
    },
    horarioRestaurante: {
        fontSize: 14,
        marginLeft: 10,
        color: '#222'
    },
    enderecoRestaurante: {
        fontSize: 14,
        marginLeft: 10,
        color: '#777'
    },
    viewFotoRestauranteInfo: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    imagemRestauranteInfo: {
        height: 60,
        width: 60,
        borderRadius: 4
    },
    botaoFecharInfoRestaurante: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingLeft: 25
    },
    viewSobreRestaurante: {
        paddingBottom: 50,
        paddingTop: 10
    },
    tituloSobreRestaurante: {
        fontSize: 22,
        color: '#222',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sobreRestaurante: {
        color: '#777',
        fontSize: 13,
        lineHeight: 20
    }



}