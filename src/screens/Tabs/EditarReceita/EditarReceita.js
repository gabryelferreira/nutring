import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Linking, Modal, BackHandler, Platform } from 'react-native';
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
import Input from '../../../components/Input/Input';
import BotaoPequeno from '../../../components/Botoes/BotaoPequeno';
import DraggableFlatList from 'react-native-draggable-flatlist';
import RNFetchBlob from 'react-native-fetch-blob';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class EditarReceita extends Network {

    static navigationOptions = ({ navigation }) => ({
        title: 'Sua Receita',
        headerRight: !navigation.getParam("loading", null) ? (
            <TouchableOpacity onPress={navigation.getParam("onPress")} style={{paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: 20}}>
                <Text style={{fontSize: 16, color: '#28b657', fontWeight: 'bold'}}>Confirmar</Text>
            </TouchableOpacity>
        ) : (
            <View style={{paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', opacity: .3, marginRight: 20}}>
                {/* <Text style={{fontSize: 16, color: '#28b657', fontWeight: 'bold', marginRight: 5}}>Confirmando</Text> */}
                <ActivityIndicator animating color="#777" size="small"/>
            </View>
        )
    });

    segundoInput;

    receitaSalva = false;

    state = {
        // data: [...Array(20)].map((d, index) => ({
        //   key: `item-${index}`,
        //   titulo: "",
        //   descricao: ""
        // })),
        data: [],
        dados: {},
        modal: {
            visible: false,
            titulo: "",
            subTitulo: "",
            botoes: []
        },
        editando: false
    }

    // state = {
    //     data: []
    // }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        if (this.props.navigation.getParam("dados", null)){
            this.setState({
                dados: this.props.navigation.getParam("dados")
            })
        } else {
            let receita = (this.props.navigation.getParam("receita", null));
            let dados = receita;
            dados.fotoNoServidor = true;
            let data = receita.passos;
            for (var i = 0; i < data.length; i++){
                data[i].key = `item-${i}`;
                data[i].fotoNoServidor = true;
            }
            this.setState({
                dados: receita,
                data
            }, this.arrumarFotos)
        }
        this.props.navigation.setParams({
            onPress: this.confirmar.bind(this)
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        // this.goBack();
        if (this.state.data.length > 0){
            this.showModal("A receita será perdida", "Deseja sair sem salvar? Todos os dados serão perdidos.", this.criarBotoesVoltar());
            return true;
        }
        return false;
    }

    criarBotoesVoltar(){
        return [
            {chave: "VOLTAR", texto: "Sair", color: '#DC143C', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"}
        ]
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (key == "CONFIRMAR"){
            this.props.navigation.setParams({
                loading: true
            })
            this.confirmarReceita();
        }
        if (key == "VOLTAR"){
            this.props.navigation.goBack();
        }
        if (this.receitaSalva){
            if (this.props.navigation.state.params.onGoBack){
                console.log("tem caralhoooo")
                this.props.navigation.state.params.onGoBack();
                this.props.navigation.goBack();
            } else {
                this.props.navigation.pop(2);
            }
        }
    }

    async confirmarReceita(){
        let dados = this.state.dados;
        let passos = this.state.data;
        if (!dados.fotoNoServidor){
            dados.base64 = await RNFetchBlob.fs.readFile(dados.foto, 'base64');
            dados.base64 = `data:image/jpg;base64,${dados.base64}`;
        }
        for (var i = 0; i < passos.length; i++){
            if (!passos[i].fotoNoServidor){
                passos[i].base64 = await RNFetchBlob.fs.readFile(passos[i].foto, 'base64');
                passos[i].base64 = `data:image/jpg;base64,${passos[i].base64}`;
            }
        }
        dados = JSON.stringify(dados);
        passos = JSON.stringify(passos);
        let result = await this.callMethod("confirmarReceita", { dados, passos });
        this.props.navigation.setParams({
            loading: false
        })
        if (result.success){
            if (result.result == "RECEITA_CRIADA"){
                this.receitaSalva = true;
                this.showModal("Receita criada", "Sua receita foi criada com sucesso e já está disponível em seu perfil.");
            } else if (result.result == "RECEITA_SALVA"){
                this.receitaSalva = true;
                this.showModal("Receita salva", "Sua receita foi salva com sucesso!");
            }
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
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

    confirmar(){
        console.log("oi bb")
        if (this.state.data.length == 0){
            this.showModal("Nenhum passo", "Sua receita não contem passos. Para concluir sua receita, adicione pelo menos um passo.");
        } else {
            this.showModal("Confirmação", "Deseja confirmar sua receita?", this.criarBotoesConfirmar());
        }
    }

    criarBotoesConfirmar(){
        let botoes = [
            {chave: "CONFIRMAR", texto: "Confirmar", color: '#28b657', fontWeight: 'bold'},
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

    renderFirstRow(){
        if (this.state.data.length == 0){
            return (
                <View style={[styles.border, styles.flex]}>
                    <TouchableOpacity
                        onPress={() => this.abrirAdicionarPasso()}
                        style={[styles.dado, styles.flexRow, styles.justifySpaceBetween, styles.alignCenter]}
                    >
                        <View style={[styles.flexRow, styles.alignCenter, styles.dadosPrincipais]}>
                            <View style={[styles.fotoPasso, styles.backgroundAlmostBlack]}>
                                <Icon name="plus" size={18} color="#fff" solid/>
                            </View>
                            <View style={[styles.textos, styles.flex]}>
                                <Text style={styles.tituloPasso} numberOfLines={1}>Adicionar o primeiro passo</Text>
                                <Text style={styles.descricao} numberOfLines={3}>Após já ter adicionado um passo, esse botão irá sumir e, para adicionar passos, clique em "Adicionar" à direita.</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }
    
    renderItem = ({ item, index, move, moveEnd, isActive }) => {

        return (
            <View style={[styles.border, styles.flex]}>
                <TouchableOpacity
                    disabled={this.props.navigation.getParam("loading", false)}
                    onPress={() => this.abrirEditar(item, "EDITAR_PASSO")}
                    onLongPress={move}
                    onPressOut={moveEnd}
                    style={[styles.dado, styles.flexRow, styles.justifySpaceBetween, styles.alignCenter, [isActive ? styles.border : '']]}
                >
                    <View style={[styles.flexRow, styles.alignCenter, styles.dadosPrincipais]}>
                        <View style={[styles.fotoPasso, styles.backgroundGray]}>
                            <Image resizeMethod="resize" style={styles.fotoPasso} source={{uri: item.foto}}/>
                        </View>
                        <View style={styles.textos}>
                            <Text style={styles.tituloPasso} numberOfLines={1}>{item.titulo}</Text>
                            <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>
                        </View>
                    </View>
                    <View style={{flex: .2, flexDirection: 'row',  justifyContent: 'flex-end', alignItems: 'center'}}>
                        <Text style={{color: '#000', fontWeight: 'bold', fontSize: 12, marginRight: 8}}>{index}</Text>
                        <TouchableOpacity 
                            
                            onPressIn={move}
                            onPressOut={moveEnd}
                        >
                            <Icon name="bars" solid size={18} color="#000"/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    abrirAdicionarPasso(){
        this.props.navigation.navigate("EditarPasso", {
            onGoBack: (dados) => this.adicionarPasso(dados)
        });
    }
    
    adicionarPasso(dados){
        let data = this.state.data.map((d, index) => {
            return {
                key: `item-${index}`,
                foto: d.foto,
                titulo: d.titulo,
                descricao: d.descricao,
                fotoNoServidor: d.fotoNoServidor
            }
        });
        dados.key = data.length;
        data.push(dados)
        this.setState({
            data
        })
    }

    deletarPasso(passo){
        let passos = this.state.data;
        for (var i = passos.length - 1; i >= 0; i--){
            if (passos[i].key == passo.key){
                passos.splice(i, 1);
                break;
            }
        }
        this.setState({
            data: passos
        })
    }

    abrirEditar(dados, tipo = ""){
        if (this.props.navigation.getParam("loading", false)) return false;
        this.props.navigation.navigate("EditarPasso", {
            dados,
            tipo,
            onGoBack: (dados, tipo) => this.tratarDadosEdicao(dados, tipo),
            onDeletePasso: (passo) => this.deletarPasso(passo)
        })
    }

    tratarDadosEdicao(dados, tipo){
        if (tipo == "EDITAR_DADOS"){
            this.setState({
                dados
            })
        } else if (tipo == "EDITAR_PASSO"){
            let data = this.state.data.map(d => {
                if (d.key == dados.key){
                    d = dados
                }
                return d;
            })
            this.setState({
                data
            })
        }
    }

    returnDadosReceita(){
        return (
            <View style={styles.flex}>
                <View style={styles.borderBottom}>
                    <TouchableOpacity 
                        disabled={this.props.navigation.getParam("loading", false)}    
                        onPress={() => this.abrirEditar(this.state.dados, 'EDITAR_DADOS')} style={[styles.dado, styles.flexRow, styles.justifySpaceBetween, styles.alignCenter]}>
                        <View style={[styles.flexRow, styles.alignCenter, styles.dadosPrincipais]}>
                            <View style={[styles.fotoReceita, styles.backgroundGray]}>
                                <Image resizeMethod="resize" style={styles.fotoReceita} source={{uri: this.state.dados.foto}}/>
                            </View>
                            <View style={styles.textos}>
                                <Text style={styles.titulo} numberOfLines={1}>{this.state.dados.titulo}</Text>
                                <Text style={styles.descricao} numberOfLines={3}>{this.state.dados.descricao}</Text>
                            </View>
                        </View>
                        <View style={{flex: .2, flexDirection: 'row',  justifyContent: 'flex-end'}}>
                            <Icon name="chevron-right" solid size={16} color="#aaa"/>
                        </View>
                    </TouchableOpacity>
                </View>
            
                <View style={styles.borderBottom}>
                    <View style={[styles.dado, styles.justifySpaceBetween, styles.alignCenter, styles.flexRow]}>
                        <Text style={styles.labelPassos}>Passos</Text>
                        <TouchableOpacity
                            disabled={this.props.navigation.getParam("loading", false)}
                            onPress={() => this.abrirAdicionarPasso()}>
                            <Text style={styles.adicionar}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderFirstRow()}

            </View>
        );
    }

    render(){

        return (
            <View style={{ flex: 1 }}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.getModalClick()}
                    botoes={this.state.modal.botoes}/>
              <DraggableFlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `draggable-item-${item.key}`}
                scrollPercent={5}
                onMoveEnd={({ data }) => this.setState({ data })}
                ListHeaderComponent={() => this.returnDadosReceita()}
              />
            </View>
          )
    }

}

const styles = {
    flex: {
        flex: 1
    },
    dado: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flex: 1,
        backgroundColor: '#fff',
    },
    borda: {
        flex: 1,
        height: .4,
        backgroundColor: '#222',
        zIndex: 999
    },
    bordaMenor: {
        flex: 1,
        height: .2,
        backgroundColor: '#222',
        zIndex: 999
    },
    border: {
        borderBottomColor: '#222',
        borderBottomWidth: .4,
        borderTopColor: '#222',
        borderTopWidth: .4
    },
    borderBottom: {
        borderBottomColor: '#222',
        borderBottomWidth: .6,
    },
    dadosPrincipais: {
        flex: 1
    },
    flexRow: {
        flexDirection: 'row'
    },
    alignCenter: {
        alignItems: 'center'
    },
    justifySpaceBetween: {
        justifyContent: 'space-between'
    },
    fotoReceita: {
        height: 60,
        width: 60,
        borderRadius: 60/2
    },
    textos: {
        marginLeft: 15,
        flex: 1
    },
    titulo: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 3
    },
    tituloPasso: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 3
    },
    descricao: {
        color: '#000',
        fontSize: 14,
    },
    labelPassos: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold'
    },
    fotoPasso: {
        height: 45,
        width: 45,
        borderRadius: 45/2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundGray: {
        backgroundColor: '#eee'
    },
    backgroundAlmostBlack: {
        backgroundColor: '#333'
    },
    adicionar: {
        color: '#28b657',
        fontWeight: 'bold',
        fontSize: 15
    }

}