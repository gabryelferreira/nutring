import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Modal, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Network from '../../../../network';
import Modalzin from '../../../../components/Modal/Modal';
import AutoHeightImage from 'react-native-auto-height-image';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import PassoReceita from '../../../../components/PassoReceita/PassoReceita';
import PassosReceita from '../../../../components/PassosReceita/PassosReceita';
import SemDados from '../../../../components/SemDados/SemDados';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class VerReceita extends Network {

    static navigationOptions = ({ navigation }) => ({
        title: 'Receita',
        headerRight: (
            navigation.getParam("receita", {}).minha_receita ? (
                <View style={{marginRight: 20}}>
                    {navigation.getParam("excluindo", false) ? (
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', opacity: .3}}>
                            <Text style={{fontSize: 16, color: '#DC143C', fontWeight: 'bold', marginRight: 5}}>Excluindo</Text>
                            <ActivityIndicator animating color="#DC143C" size="small"/>
                        </View>
                    ) : (
                        null
                    )}
                    
                </View>
            ) : (
                <View></View>
            )
        )
    });


    //props
    receitaExcluida = false;
    swiper;
    swiperIndex = 0;

    constructor(props){
        super(props);
        this.state = {
            carregandoInicial: true,
            receita: {},
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            modalAberto: false,
            passoAtual: 0,
            altura: 0,
            carregandoImagem: false,
            naoEncontrada: false,
            id_receita: 0
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({
            onDotsClick: this.abrirModalOpcoes.bind(this)
        })
        let id_receita = this.props.navigation.getParam("id_receita", 0);
        this.setState({
            id_receita,
            carregandoInicial: true
        }, this.getReceita);
    }

    componentWillUnmount() {
        this.props.navigation.setParams({
            onDotsClick: null,
        })
    }

    abrirModalOpcoes(){
        this.showModal("Selecione uma opção", "O que deseja fazer?", this.criarBotoesOpcoes())
    }

    criarBotoesOpcoes(){
        let botoes = [
            {chave: "EDITAR", texto: "Editar", color: '#000', fontWeight: 'bold'},
            {chave: "EXCLUIR", texto: "Excluir", color: '#DC143C', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    criarBotoesExclusao(){
        let botoes = [
            {chave: "CONFIRMAR_EXCLUSAO", texto: "Excluir", color: '#DC143C', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    onExcluirClick(){
        this.showModal("Excluir Receita", "Deseja excluir a receita? Você não poderá voltar atrás.", this.criarBotoesExclusao());
    }

    onEditarClick(){
        this.props.navigation.navigate("EditarReceita", {
            receita: this.state.receita,
            onGoBack: () => this.carregarDadosIniciais()
        })
    }

    carregarDadosIniciais(){
        this.setState({
            carregandoInicial: true
        }, this.getReceita)
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (key == "CONFIRMAR_EXCLUSAO"){
            this.excluirReceita();
        }
        if (this.receitaExcluida){
            if (this.props.navigation.state.params.onDelete)
                this.props.navigation.state.params.onDelete(this.state.id_receita);
            this.props.navigation.goBack();
        }
    }

    async excluirReceita(){
        this.props.navigation.setParams({
            excluindo: true
        })
        let result = await this.callMethod("excluirReceita", { id_receita: this.state.receita.id_receita });
        this.props.navigation.setParams({
            excluindo: false
        })
        if (result.success){
            this.receitaExcluida = true;
            this.showModal("Receita excluída", "Sua receita foi excluída.");
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

    async getReceita(){
        let result = await this.callMethod("getReceita", { id_receita: this.state.id_receita });
        if (result.success){
            if (result.result == "NAO_ENCONTRADA"){
                this.setState({
                    naoEncontrada: true,
                })
            } else {
                this.setState({
                    receita: result.result,
                }, this.setParams);
            }
        }
        this.setState({
            carregandoInicial: false
        })
    }

    setParams(){
        this.props.navigation.setParams({
            receita: this.state.receita
        })
    }

    reduzirPasso(){
        if (this.state.passoAtual > 0) this.setState({passoAtual: this.state.passoAtual-1});
    }

    avancarPasso(){
        if (this.state.passoAtual < this.state.receita.passos.length) this.setState({passoAtual: this.state.passoAtual+1})
    }

    renderBotaoAnterior(){
        if (this.state.passoAtual == 0 || !this.state.receita || !this.state.receita.passos){
            return (
                <View style={[styles.botaoProximoAnterior, styles.disabled]}>
                    <Text style={styles.textoBotaoProxAnt}>Anterior</Text>
                </View>
            );
        }
        return (
            <TouchableOpacity style={styles.botaoProximoAnterior} onPress={() => this.reduzirPasso()}>
                <Text style={styles.textoBotaoProxAnt}>Anterior</Text>
            </TouchableOpacity>
        );
    }

    renderBotaoProximo(){
        if (this.state.passoAtual == this.state.receita.passos.length - 1 || !this.state.receita || !this.state.receita.passos){
            return (
                <View style={[styles.botaoProximoAnterior, styles.disabled]}>
                    <Text style={styles.textoBotaoProxAnt}>Próximo</Text>
                </View>
            );
        }
        return (
            <TouchableOpacity style={styles.botaoProximoAnterior} onPress={() => this.avancarPasso()}>
                <Text style={styles.textoBotaoProxAnt}>Próximo</Text>
            </TouchableOpacity>
        );
    }
    
    renderProximoAnterior(){
        if (this.state.receita && this.state.receita.passos && this.state.receita.passos.length > 0){
            return (
                <SafeAreaView style={styles.proximoAnterior}>
                    {this.renderBotaoAnterior()}
                    <Text style={styles.textoPassos}>
                        Passo {this.state.passoAtual + 1} de {this.state.receita && this.state.receita.passos ? this.state.receita.passos.length : '0'}
                    </Text>
                    {this.renderBotaoProximo()}
                </SafeAreaView>
            );
        }
    }
    
    fecharModalPassos(){
        this.setState({
            modalAberto: false,
            passoAtual: 0
        })
    }

    renderPassosReceita(){
        if (this.state.loading){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color="#777" />
                </View>

            );
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => this.fecharModalPassos()}>
                        <Icon name="times" color="#000" size={24}/>
                    </TouchableOpacity>
                    <Text style={styles.tituloModal}>{this.state.receita.titulo}</Text>
                    <TouchableOpacity>
                        <Icon name="times" color="#fff" size={24}/>
                    </TouchableOpacity>
                </View>
                <PassosReceita passos={this.state.receita.passos} foto={this.state.receita.foto}/>
            </SafeAreaView>
        );
    }

    setSwiperIndex(index){
        this.swiperIndex = index;
    }

    swipe(targetIndex) {
        const currentIndex = this.swiper.state.index;
        const offset = targetIndex- currentIndex;
        this.swiper.scrollBy(offset);
    }

    verPassosReceita(){
        this.setState({
            modalAberto: true
        })
    }

    calcularHeight(foto){
        console.log("calculando altura fdp")
        this.setState({
            altura: 0
        })
        Image.getSize(foto, (width, height) => {
            let alturaIdeal = imageWidth * height / width;
            this.setState({altura: alturaIdeal}, console.log("aaaaaaa", alturaIdeal))
        });
    }

    renderFoto(foto){
        if (this.state.altura || !this.state.carregandoImagem){
            return (
                <View style={{flexDirection: 'row', flex: 1}}>
                    <ShimmerPlaceHolder
                        style={{flex: 1, height: this.state.altura}}
                        autoRun={true}
                        visible={!this.state.carregandoImagem}
                    >
                        <Image  onLoad={() => this.setState({ carregandoImagem: false })} resizeMethod="resize" source={{uri: foto}} style={{width: imageWidth, height: this.state.altura}}/>
                    </ShimmerPlaceHolder>
                </View>
            );
        }
        return (
            <View style={{flexDirection: 'row', flex: 1}}>
                <ShimmerPlaceHolder
                    style={{flex: 1, height: 220}}
                    autoRun={true}
                    visible={false}>
                </ShimmerPlaceHolder>
            </View>
        );
    }

    renderBotoesEdicao(){
        if (this.props.navigation.getParam("excluindo") || this.receitaExcluida) return null;
        if (this.state.receita.minha_receita){
            return (
                <View style={styles.botoesImagem}>
                    <View style={styles.botaoImagem}>
                        <TouchableOpacity style={[styles.iconeBotaoImagem, styles.iconeBotaoVerPassos]} onPress={() => this.verPassosReceita()}>
                            <Icon name="chevron-right" color="#fff" size={14}/>
                        </TouchableOpacity>
                        <Text style={styles.textoBotaoImagem}>Ver passos</Text>
                    </View>
                    <View style={styles.botaoImagem}>
                        <TouchableOpacity style={[styles.iconeBotaoImagem, styles.iconeBotaoEditar]} onPress={() => this.onEditarClick()}>
                            <Icon name="pencil-alt" color="#fff" size={16}/>
                        </TouchableOpacity>
                        <Text style={styles.textoBotaoImagem}>Editar</Text>
                    </View>
                    <View style={styles.botaoImagem}>
                        <TouchableOpacity style={[styles.iconeBotaoImagem, styles.iconeBotaoEditar]} onPress={() => this.onExcluirClick()}>
                            <Icon name="trash" color="#fff" size={16}/>
                        </TouchableOpacity>
                        <Text style={styles.textoBotaoImagem}>Excluir</Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.botoesImagem}>
                <View style={styles.botaoImagem}>
                    <TouchableOpacity style={[styles.iconeBotaoImagem, styles.iconeBotaoVerPassos]} onPress={() => this.verPassosReceita()}>
                        <Icon name="chevron-right" color="#fff" size={16}/>
                    </TouchableOpacity>
                    <Text style={styles.textoBotaoImagem}>Ver passos</Text>
                </View>
            </View>
        );
    }

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color="#777" />
                </View>
            );
        }
        if (this.state.naoEncontrada){
            return <SemDados titulo={"Receita não encontrada"} texto={"A receita que você está procurando pode ter sido excluída."}/>
        }
        return (
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.getModalClick()}
                    botoes={this.state.modal.botoes}
                />
                <Modal 
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalAberto}
                    onRequestClose={() => {
                        this.fecharModalPassos()
                    }}
                >
                <SafeAreaView style={{flex: 1}}>
                    {this.renderPassosReceita()}
                </SafeAreaView>
                        
                </Modal>
                {/* <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}> */}
                    
                    {/* <View style={styles.viewImagem}>
                        {this.renderFoto(this.state.receita.foto)}
                    </View> */}
                    <View style={styles.container}>
                        <View style={styles.viewImagem}>
                            <Image resizeMethod="resize" style={styles.imagem} source={{uri: this.state.receita.foto}}/>
                            {this.renderBotoesEdicao()}
                        </View>
                        <View style={styles.viewTextos}>
                            <View style={[styles.row, styles.justifySpaceBetween]}>
                                <View style={[styles.flex, styles.paddingRight]}>
                                    <Text numberOfLines={1} style={styles.titulo}>{this.state.receita.titulo} <Text style={styles.passo}>{this.state.receita.passos.length} passos</Text></Text>
                                    <Text style={styles.nomeUsuario}>{this.state.receita.nome}</Text>
                                </View>
                                <View style={styles.viewFotoReceita}>
                                    <View style={styles.baixoFotoReceita}>
                                        <Image resizeMethod="resize" style={styles.fotoReceita} source={{uri: this.state.receita.foto_perfil}}/>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.descricao}>{this.state.receita.descricao}</Text>
                            {/* <View style={styles.botaoVerSteps}>
                                <BotaoPequeno texto={"Passo a Passo"} onPress={() => this.verPassosReceita()}/>
                            </View> */}
                        </View>
                    </View>
                {/* </ScrollView> */}
            </View>
        );
    }

}

const styles = {
    row: {
        flexDirection: 'row'
    },
    justifySpaceBetween: {
        justifyContent: 'space-between'
    },
    viewFotoReceita: {
        width: 80,
    },
    baixoFotoReceita: {
        position: 'absolute',
        right: 0, top: -40,
        borderRadius: 15,
        height: 80,
        width: 80,
        elevation: 1,
        backgroundColor: '#eee'
    },
    fotoReceita: {
        width: 80, height: 80,
        borderRadius: 15
    },
    flex: {
        flex: 1,
    },
    paddingRight: {
        paddingRight: 10
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#000'
    },
    viewArrowSwiper: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botoesImagem: {
        position: 'absolute',
        top: 0, right: 0,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 999
    },
    botaoImagem: {
        marginHorizontal: 8,
        flexDirection: 'column',
        alignItems: 'center'
    },
    iconeBotaoImagem: {
        height: 35,
        width: 35,
        borderRadius: 35/2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconeBotaoEditar: {backgroundColor: 'rgba(30, 30, 30, .45)',},
    iconeBotaoExcluir: {backgroundColor: 'rgba(200, 0, 0, .45)',},
    iconeBotaoVerPassos: {backgroundColor: 'rgba(40,182,87, .8)',},
    textoBotaoImagem: {
        marginTop: 2,
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    viewImagem: {
        position: 'absolute',
        left: 0, top: 0, right: 0, height: (imageHeight*8/10) - 50,
        backgroundColor: '#eee'
    },
    imagem: {
        flex: 1,
        width: null,
        height: null
    },
    viewTextos: {
        position: 'absolute',
        minHeight: (imageHeight*2.5/10) - 50,
        bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20,
        paddingTop: 20,
        transform: [
            {translateY: -25}
        ],
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#fff',
    },
    nomeUsuario: {
        fontSize: 16,
        color: '#222'
    },
    titulo: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    passo: {
        fontSize: 12,
        color: '#aaa',
        fontWeight: 'normal'
    },
    descricao: {
        fontSize: 15,
        color: '#777',
        marginTop: 10,
        textAlign: 'left'
    },
    botaoVerSteps: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    tituloModal: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 22
    },
    proximoAnterior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    botaoProximoAnterior: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoBotaoProxAnt: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16
    },
    textoPassos: {
        color: '#222'
    },
    disabled: {
        opacity: .4
    }
}