import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Image, PermissionsAndroid, CameraRoll } from 'react-native';
import Network from '../../../../../network';
import Opcao from '../../../../../components/Opcao/Opcao';
import Input from '../../../../../components/Input/Input'
import Sugestoes from '../../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Galeria from '../../../../../components/Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';
import BotaoMedio from '../../../../../components/Botoes/BotaoMedio';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Promocao extends Network {

    static navigationOptions = {
        title: 'Promoção',
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            notificacaoEnviada: false,
            carregandoPrimeiraVez: true,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            promocao: {},
            loading: false,
            confirmado: false,
        }
    }

    componentDidMount(){
        this.getPromocao(this.props.navigation.getParam("id_promocao", "0"));
    }

    async getPromocao(id_promocao){
        let result = await this.callMethod("getPromocao", { id_promocao });
        if (result.success){
            this.setState({
                promocao: result.result
            })
        }
        this.setState({
            carregandoPrimeiraVez: false,
        })
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (this.state.confirmado){
            this.props.navigation.goBack();
        }
    }

    async confirmarPresenca(){
        this.setState({ loading: true });
        let result = await this.callMethod("confirmarPresenca", { id_promocao: this.props.navigation.getParam("id_promocao", "0") });
        if (result.success){
            let promocao = this.state.promocao;
            promocao.estou_confirmado = true;
            this.setState({
                promocao
            })
        }
        this.setState({ loading: false });
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

    returnImagemPublicacao(foto){
        if (foto){
            return <Image resizeMethod="resize" style={{width: undefined, height: undefined, flex: 1}} source={{uri: foto}}/>
        } else {
            return null;
        }
    }

    returnTextoEmbaixoTitulo(){
        if (this.state.promocao.eh_minha_promocao){
            if (this.state.promocao.confirmados == 1){
                return <Text style={styles.descricaoHeader}>{this.state.promocao.confirmados} usuário confirmou presença</Text>
            } else {
                return <Text style={styles.descricaoHeader}>{this.state.promocao.confirmados} usuários confirmaram presença</Text>
            }
        }
        if (this.state.promocao.estou_confirmado){
            return <Text style={[styles.descricaoHeader, {color: '#28b657'}]}>Você garantiu seu cupom!</Text>;
        }
        if (this.state.promocao.confirmados > 0){
            if (this.state.promocao.confirmados == 1){
                return <Text style={styles.descricaoHeader}>{this.state.promocao.confirmados} usuário já garantiu cupom</Text>
            } else {
                return <Text style={styles.descricaoHeader}>{this.state.promocao.confirmados} usuários já garantiram cupom</Text>
            }
        } else if (this.state.promocao.is_promocao_relampago){
            return <Text style={styles.descricaoHeader}>Essa é uma promoção relâmpago!</Text>
        } else {
            return <Text style={styles.descricaoHeader}>Garanta agora seu cupom!</Text>
        }
    }

    returnBotaoConfirmar(){
        if (!this.state.promocao.estou_confirmado && !this.state.promocao.eh_minha_promocao){
            return (
                <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <BotaoPequeno texto={"Gerar Cupom"} textoLoading={"Gerando"} onPress={() => this.confirmarPresenca()} loading={this.state.loading}/>
                </View>
            );
        }
    }

    returnPromocaoRelampago(){
        if (this.state.promocao.is_promocao_relampago){
            return (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Icon name="bolt" color="#eccc68" size={16}/>
                    <View style={styles.botaoTimer}>
                        <Text style={styles.textoBotaoTimer}>HOJE</Text>
                    </View>
                </View>
            );
        }
        return null;
    }

    render(){
        if (this.state.carregandoPrimeiraVez){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color="#777" />
                </View>
            );
        }
        return (
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.getModalClick()}
                />
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.imagem}>
                        {this.returnImagemPublicacao(this.state.promocao.foto_promocao)}
                    </View>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => this.props.navigation.push("Perfil", { id_usuario_perfil: this.state.promocao.id_usuario })} 
                                                style={{height: 55, width: 55, borderRadius: 55/2, marginHorizontal: 15}}>
                                <Image style={{height: 55, width: 55, borderRadius: 55/2}} source={{uri: this.state.promocao.foto}}/>
                            </TouchableOpacity>
                            <View style={styles.titulos}>
                                <TouchableOpacity onPress={() => this.props.navigation.push("Perfil", { id_usuario_perfil: this.state.promocao.id_usuario })}>
                                    <Text style={styles.tituloHeader}>{this.state.promocao.nome}</Text>
                                </TouchableOpacity>
                                {this.returnTextoEmbaixoTitulo()}
                            </View>
                            {this.returnPromocaoRelampago()}
                        </View>
                        <View style={styles.viewDescricao}>
                            <Text style={styles.titulo}>{this.state.promocao.titulo}</Text>
                            <Text style={styles.descricao}>{this.state.promocao.descricao}</Text>
                            {this.returnBotaoConfirmar()}
                        </View>
                        {/* <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>A notificação será enviada para todos seus seguidores.</Text>
                        </View> */}
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = {
    container: {
        paddingBottom: 10,
        paddingHorizontal: 15
    },
    imagem: {
        width: imageWidth,
        maxHeight: 300,
        minHeight: 250,
        backgroundColor: '#eee'
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
    },
    titulos: {
        flexDirection: 'column',
        flex: 1,
    },
    tituloHeader: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    descricaoHeader: {
        fontSize: 11,
        color: '#777',
    },
    botaoTimer: {
        paddingVertical: 5,
        borderRadius: 7,
        paddingHorizontal: 10,
        backgroundColor: '#FF0000',
        alignSelf: 'flex-end',
        marginVertical: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4
    },
    textoBotaoTimer: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 10,
    },
    viewDescricao: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    titulo: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    descricao: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
        
    },
}