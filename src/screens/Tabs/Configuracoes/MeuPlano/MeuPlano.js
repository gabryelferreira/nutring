import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, WebView, Image } from 'react-native';
import Network from '../../../../network';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class MeuPlano extends Network {

    static navigationOptions = {
        title: 'Meu Plano',
    };

    constructor(props){
        super(props);
        this.state = {
            carregandoInicial: true,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            planos: [],
            usuario: {}
        }
    }

    componentDidMount(){
        this.getDados();
    }

    async getDados(){
        await this.getPerfil();
    }

    async getPerfil(){
        let result = await this.callMethod("getPerfil");
        if (result.success){
            this.setState({
                usuario: result.result
            }, this.getPlanos)
        }
    }

    async getPlanos(){
        let result = await this.callMethod("getPlanos");
        if (result.success){
            this.setState({
                planos: result.result,
                carregandoInicial: false
            })
        }
    }

    getModalClick(key){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (key == "ENVIAR"){
        }
    }

    async enviarNotificacao(){
        
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

    criarBotoes(){
        let botoes = [
            {chave: "ENVIAR", texto: "Confirmar", color: '#28b657', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    returnBotaoUpgrade(plano){
        if (plano.is_plano_atual){
            return <Text style={{color: '#28b657'}}>Esse é seu plano</Text>
        } else if (plano.id_plano != 1){
            if (!plano.is_plano_atual){
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Plano", { id_plano: plano.id_plano })} style={{backgroundColor: '#28b657'}}>
                        <Text style={{color: '#fff'}}>Upgradezin</Text>
                    </TouchableOpacity>
                );
            }
        }
        return null;
    }

    corrigirPreco(preco){
        if (!preco) return null;
        return preco.split('.');
    }

    renderPlanos(){
        return this.state.planos.map((plano) => {
            let color = plano.id_plano == 2 ? '#976938' : '#28b657';
            let preco = this.corrigirPreco(plano.preco);
            return (
                <View key={plano.id_plano} style={styles.plano}>
                    <Image resizeMethod="resize" source={{uri: plano.foto}} style={styles.fotoPlano}/>
                    <View>
                        <Text style={styles.tituloPlano}>Plano Nutring <Text style={{color}}>{plano.nome}</Text></Text>
                        <Text style={styles.apenas}>por apenas</Text>
                        <View style={styles.alinharBaixo}>
                            <Text style={[styles.preco, {color}]}>R$ <Text style={styles.precoNumeroMaior}>{preco[0]}</Text>,{preco[1]}</Text>
                            <TouchableOpacity style={[styles.alinharTextos, styles.botaoDetalhes]}>
                                <Text style={styles.detalhes}>Detalhes</Text>
                                <Icon name="chevron-right" solid size={12} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.botaoAssinarPlano, {borderColor: color}]}>
                            <Text style={styles.textoBotaoAssinarPlano}>{plano.is_plano_atual ? 'RENOVE' : 'ASSINE'} O PLANO {plano.nome.toUpperCase()}</Text>
                            <Icon name="chevron-right" solid size={14} color="#fff" style={{fontWeight: 'bold'}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        })
    }

    renderIconePlano(semPlano){
        if (semPlano)
            return <Icon name="times" solid size={14} color="#EA2027"/>
        return <Icon name="check" solid size={14} color="#28b657"/>
    }

    renderDiasRestantes(diasRestantes){
        if (diasRestantes)
            return (
                <View style={[styles.viewTextoPlano, styles.alinharTextos]}>
                    <Icon name="clock" solid size={14} color="#777"/>
                    <Text style={styles.textoMeuPlano}>{diasRestantes} dias restantes</Text>
                </View>
            );
        return null;
    }

    renderMeuPlano(){
        let plano = this.state.planos.filter((plano) => {
            if (plano.is_plano_atual)
                return plano
            return null
        })
        if (Array.isArray(plano) && plano.length > 0){
            plano = plano[0];
            return this.renderPlanoAtual(plano);
        } else {
            plano = {
                nome: "Você não possui um plano",
                semPlano: true
            }
            return this.renderPlanoAtual(plano);
        }
    }

    renderPlanoAtual(plano){
        return (
            <View style={styles.meuPlano}>
                <Image source={{uri: 'https://image.flaticon.com/icons/png/512/20/20177.png'}} style={styles.fotoMeuPlano}/>
                <View>
                    <View style={[styles.viewTituloPlano, styles.alinharTextos]}>
                        <Icon name="star" solid size={14} color="#000"/>
                        <Text style={styles.tituloMeuPlano}>{this.state.usuario.nome}</Text>
                    </View>
                    <View style={[styles.viewTextoPlano, styles.alinharTextos]}>
                        {this.renderIconePlano(plano.semPlano)}
                        <Text style={[styles.textoMeuPlano, plano.semPlano ? {color: '#EA2027'} : {color: '#28b657'}]}>{!plano.semPlano ? 'Plano Nutring ' : ''}{plano.nome}</Text>
                    </View>
                    {this.renderDiasRestantes(plano.dias_restantes)}
                </View>
            </View>
        );
    }

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        return (
            <View style={{flex: 1, backgroundColor: '#000'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    {this.renderMeuPlano()}
                    {this.renderPlanos()}
                </ScrollView>
            </View>
            // <WebView
            //     source={{uri: 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code=64636165BBBBC73EE4A37F9AD1B734D6'}}
            // />
        );
    }

}

const styles = {
    alinharTextos: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    meuPlano: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    fotoMeuPlano: {
        width: 50,
        height: 50,
        borderRadius: 50/2,
        marginRight: 20
    },
    viewTituloPlano: {
        marginBottom: 5
    },
    tituloMeuPlano: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 7
    },
    viewTextoPlano: {
        marginBottom: 2
    },
    textoMeuPlano: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#777',
        marginLeft: 7
    },




    plano: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#976938'
    },
    fotoPlano: {
        width: 90,
        height: 90,
        borderRadius: 90/2,
        marginRight: 30
    },
    tituloPlano: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    apenas: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5
    },
    alinharBaixo: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    preco: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    precoNumeroMaior: {
        fontSize: 34
    },
    detalhes: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 5
    },
    botaoDetalhes: {
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    botaoAssinarPlano: {
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
        marginTop: 8
    },
    textoBotaoAssinarPlano: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 7
    }
    

}


/*
<Text style={styles.tituloPlano}>Plano Nutring <Text style={styles.corVerde}>Plus</Text></Text>
<Text style={styles.apenas}>por apenas</Text>
<View style={styles.alinharBaixo}>
    <Text style={styles.preco}>R$ <Text style={styles.precoNumeroMaior}>79</Text>,97</Text>
    <TouchableOpacity style={styles.alinharTextos}>
        <Text style={styles.detalhes}>Detalhes</Text>
        <Icon name="chevron-right" solid size={12} color="#fff"/>
    </TouchableOpacity>
</View>
*/