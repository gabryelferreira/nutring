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
import Input from '../../../components/Input/Input';
import BotaoPequeno from '../../../components/Botoes/BotaoPequeno';
import DraggableFlatList from 'react-native-draggable-flatlist'

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
                <Text style={{fontSize: 16, color: '#28b657', fontWeight: 'bold', marginRight: 5}}>Publicando</Text>
                <ActivityIndicator animating color="#28b657" size={12}/>
            </View>
        )
    });

    segundoInput;

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
        }
    }

    // state = {
    //     data: []
    // }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log("navvvv", this.props.navigation.getParam("dados", null));
        if (this.props.navigation.getParam("dados", null)){
            console.log("temmm")
            this.setState({
                dados: this.props.navigation.getParam("dados")
            })
        } else {
            console.log("pegar dados receita");
        }
        this.props.navigation.setParams({
            onPress: this.confirmar.bind(this)
        })
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
            }, this.confirmarReceita)
        }
        if (this.state.promocaoFinalizada){
            this.props.navigation.goBack();
        }
    }

    async confirmarReceita(){
        let dados = JSON.stringify(this.state.dados);
        let passos = JSON.stringify(this.state.data);
        let result = await this.callMethod("confirmarReceita", { dados, passos });
    }

    async salvarReceita(){
        
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
    
    renderItem = ({ item, index, move, moveEnd, isActive }) => {

        return (
            <View style={styles.border}>
                <TouchableOpacity
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

        // return (
        //   <TouchableOpacity
        //     style={{ 
        //       height: 100, 
        //       backgroundColor: isActive ? 'blue' : item.backgroundColor,
        //       alignItems: 'center', 
        //       justifyContent: 'center' 
        //     }}
        //     onLongPress={move}
        //     onPressOut={moveEnd}
        //   >
        //     <Text style={{ 
        //       fontWeight: 'bold', 
        //       color: 'white',
        //       fontSize: 32,
        //     }}>{item.label}</Text>
        //   </TouchableOpacity>
        // )
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
                descricao: d.descricao
            }
        });
        dados.key = data.length;
        data.push(dados)
        this.setState({
            data
        })
    }

    abrirEditar(dados, tipo = ""){
        this.props.navigation.navigate("EditarPasso", {
            dados,
            tipo,
            onGoBack: (dados, tipo) => this.tratarDadosEdicao(dados, tipo)
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
            <View>
                <View style={styles.borderBottom}>
                    <TouchableOpacity onPress={() => this.abrirEditar(this.state.dados, 'EDITAR_DADOS')} style={[styles.dado, styles.flexRow, styles.justifySpaceBetween, styles.alignCenter]}>
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
                    <TouchableOpacity onPress={() => this.abrirAdicionarPasso()}>
                        <Text style={styles.adicionar}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
            </View>

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
        flex: .7
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
        marginLeft: 20
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
        borderRadius: 45/2
    },
    backgroundGray: {
        backgroundColor: '#eee'
    },
    adicionar: {
        color: '#28b657',
        fontWeight: 'bold',
        fontSize: 15
    }

}