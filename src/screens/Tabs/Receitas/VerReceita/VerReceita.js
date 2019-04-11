import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Modal, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Network from '../../../../network';
import Modalzin from '../../../../components/Modal/Modal';
import AutoHeightImage from 'react-native-auto-height-image';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import PassoReceita from '../../../../components/PassoReceita/PassoReceita';
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
                        <TouchableOpacity onPress={navigation.getParam("onDotsClick")} style={{paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Icon name="ellipsis-v" solid color="#000" size={18}/>
                        </TouchableOpacity>
                    )}
                    
                </View>
            ) : (
                <View></View>
            )
        )
    });

    receitaExcluida = false;

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
        if (key == "EXCLUIR"){
            this.showModal("Excluir Receita", "Deseja excluir a receita? Você não poderá voltar atrás.", this.criarBotoesExclusao())
        }
        if (key == "EDITAR"){
            this.props.navigation.navigate("EditarReceita", {
                receita: this.state.receita,
                onGoBack: () => this.carregarDadosIniciais()
            })
        }
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

    renderPasso(){
        console.log("to aqui no passo renderizando kk")
        if (this.state.receita && this.state.receita.passos && this.state.receita.passos.length > 0){
            console.log("passo atual = ", this.state.receita.passos[this.state.passoAtual])
            return (
                <PassoReceita data={this.state.receita.passos[this.state.passoAtual]} index={this.state.passoAtual}/>
            );
        }
        return null;
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
                <View style={styles.proximoAnterior}>
                    {this.renderBotaoAnterior()}
                    <Text style={styles.textoPassos}>
                        Passo {this.state.passoAtual + 1} de {this.state.receita && this.state.receita.passos ? this.state.receita.passos.length : '0'}
                    </Text>
                    {this.renderBotaoProximo()}
                </View>
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
                    <ActivityIndicator size="large" color="#777" />
                </View>

            );
        }
        return (
            <View style={{flex: 1}}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => this.fecharModalPassos()}>
                        <Icon name="times" color="#000" size={24}/>
                    </TouchableOpacity>
                    <Text style={styles.tituloModal}>Passos</Text>
                    <TouchableOpacity>
                        <Icon name="times" color="#fff" size={24}/>
                    </TouchableOpacity>
                </View>
                {this.renderPasso()}
                {this.renderProximoAnterior()}
            </View>
        );
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

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#777" />
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
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    
                    {/* <View style={styles.viewImagem}>
                        {this.renderFoto(this.state.receita.foto)}
                    </View> */}
                    <View style={styles.container}>
                        <View style={styles.imagem}>
                            <Image resizeMethod="resize" style={styles.imagem} source={{uri: this.state.receita.foto}}/>
                        </View>
                        <Text style={styles.titulo}>{this.state.receita.titulo}</Text>
                        <Text style={styles.descricao}>{this.state.receita.descricao}</Text>
                        <View style={styles.botaoVerSteps}>
                            <BotaoPequeno texto={"Passo a Passo"} onPress={() => this.verPassosReceita()}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = {
    container: {
        paddingVertical: 40,
        paddingHorizontal: 40,
        flexDirection: 'column',
        alignItems: 'center'
    },
    viewImagem: {
        flexDirection: 'row',
        maxHeight: 250,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee'
    },
    imagem: {
        width: 185,
        height: 185,
        borderRadius: 185/2,
        marginBottom: 25,
        backgroundColor: '#eee'
    },
    titulo: {
        fontSize: 22,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    descricao: {
        fontSize: 16,
        color: '#000',
        marginTop: 20,
        textAlign: 'center'
    },
    botaoVerSteps: {
        marginTop: 25
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