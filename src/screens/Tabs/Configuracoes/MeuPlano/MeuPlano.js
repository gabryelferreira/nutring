import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, WebView, Image, Modal } from 'react-native';
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
            usuario: {},
            assinando: false,
            planoAssinando: {},
            meuPlano: {},
            modalAberto: false,
            erro: false
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
        } else {
            this.setState({
                carregandoInicial: false,
                erro: true
            })
        }
    }

    async getPlanos(){
        let result = await this.callMethod("getPlanos");
        if (result.success){
            let meuPlano = result.result.find(plano => {
                return plano.is_plano_atual
            });
            this.setState({
                planos: result.result,
                carregandoInicial: false,
                meuPlano
            })
        } else {
            this.setState({
                carregandoInicial: false,
                erro: true
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

    async assinarPlano(plano){
        this.setState({
            assinando: true
        })
        let result = await this.callMethod("assinarPlano", {id_plano: plano.id_plano});
        if (result.success){
            this.setState({
                assinando: false,
                modalAberto: false
            })
            let titulo = "";
            let subTitulo = "";
            if (result.result == "SOLICITACAO_EXISTENTE"){
                titulo = "Solicitação existente";
                subTitulo = "Você já possui uma solicitação para assinatura ou renovação de um plano. Reenviamos o e-mail com o link para pagamento.";
            } else if (result.result == "SOLICITACAO_ENVIADA"){
                titulo = "Solicitação enviada";
                subTitulo = `Sua solicitação do Plano Nutring ${this.state.planoAssinando.nome} foi enviada com sucesso. Para realizar o pagamento, acesse o link enviado para seu e-mail.`;
            } else {
                titulo = "Atualize o App";
                subTitulo = "Vimos que sua versão do aplicativo não é a mais recente. Atualize seu app para ficar ligado nas novidades do Nutring.";
            }
            this.setState({
                assinando: false,
                solicitado: true,
                modal: {
                    visible: true,
                    titulo,
                    subTitulo,
                    botoes: []
                }
            })
        } else {
            this.setState({
                modal: {
                    visible: true,
                    titulo: "Ocorreu um erro",
                    subTitulo: "Verifique sua conexão a internet e tente novamente.",
                    botoes: []
                },
                assinando: false
            })
        }
    }

    setModalState(visible){
        this.setState({
            modal: {
                visible: visible,
                titulo: "",
                subTitulo: "",
                botoes: []
            }
        })
    }

    getModalClick(key){
        this.setModalState(false);
        if (this.state.solicitado)
            this.props.navigation.goBack(null);
        if (key == "CONFIRMAR"){
            this.assinarPlano(this.state.planoAssinando.id_plano);
        }
    }

    renderIconeForward(id_plano){
        if (this.state.assinando){
            if (this.state.planoAssinando && this.state.planoAssinando.id_plano == id_plano){
                return <ActivityIndicator animating color="#fff" size={14}/>
            }
            return <Icon name="chevron-right" solid size={14} color="#fff" style={{fontWeight: 'bold'}}/>
        }
        return <Icon name="chevron-right" solid size={14} color="#fff" style={{fontWeight: 'bold'}}/>
    }

    renderIconeForwardModal(id_plano){
        if (this.state.assinando){
            if (this.state.planoAssinando && this.state.planoAssinando.id_plano == id_plano){
                return <ActivityIndicator animating color="#fff" size={16}/>
            }
            return <Icon name="chevron-right" solid size={16} color="#fff" style={{fontWeight: 'bold'}}/>
        }
        return <Icon name="chevron-right" solid size={16} color="#fff" style={{fontWeight: 'bold'}}/>
    }

    renderTextoBotaoAssinar(plano){
        if (this.state.meuPlano && plano.id_plano != this.state.meuPlano.id_plano && plano.preco < this.state.meuPlano.preco){
            return <Text style={styles.textoBotaoAssinarPlano}>CONHEÇA O PLANO {plano.nome.toUpperCase()}</Text>
        }
        return <Text style={styles.textoBotaoAssinarPlano}>{plano.is_plano_atual ? 'RENOVE' : 'ASSINE'} O PLANO {plano.nome.toUpperCase()}</Text>
    }

    renderTextoBotaoAssinarModal(plano){
        return <Text style={styles.textoBotaoAssinarPlanoModal}>{plano.is_plano_atual ? 'RENOVE' : 'ASSINE'} O PLANO {plano.nome ? plano.nome.toUpperCase() : ""}</Text>
    }

    abrirPlano(plano){
        // this.props.navigation.navigate("Plano", { plano, meuPlano: this.state.meuPlano });
        this.setState({
            modalAberto: true,
            planoAssinando: plano
        })
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
                            <TouchableOpacity style={[styles.alinharTextos, styles.botaoDetalhes]} onPress={() => this.abrirPlano(plano)}>
                                <Text style={styles.detalhes}>Detalhes</Text>
                                <Icon name="chevron-right" solid size={12} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity disabled={this.state.assinando} style={[styles.botaoAssinarPlano, {borderColor: color}]} onPress={() => this.abrirPlano(plano)}>
                            {this.renderTextoBotaoAssinar(plano)}
                            {this.renderIconeForward(plano.id_plano)}
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
                    <Icon name="clock" solid size={14} color="#000"/>
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
                <Image source={require('../../../../assets/imgs/icone-casinha.png')} style={styles.fotoMeuPlano}/>
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

    renderBotaoModal(plano){
        if (!plano.disponivel){
            return (
                <Text style={styles.textoObsModal}>Você não pode assinar esse plano no momento, pois seu plano atual possui mais vantagens.</Text>
            );
        }
        return (
            <TouchableOpacity disabled={this.state.assinando} style={[styles.botaoAssinarPlanoModal, {borderColor: plano.id_plano == 2 ? '#976938' : '#28b657'}]} onPress={() => this.assinarPlano(plano)}>
                {this.renderTextoBotaoAssinarModal(this.state.planoAssinando)}
                {this.renderIconeForwardModal(this.state.planoAssinando.id_plano)}
            </TouchableOpacity>
        );
    }

    renderObsPlano(plano){
        if (!plano.disponivel) return null;
        if (plano.is_plano_atual){
            return (
                <Text style={[styles.textoObsModal, {marginVertical: 15}]}>Renovando o Plano Nutring {plano.nome}, você terá 30 dias acrescentados aos seus dias restantes, somando um total de {parseInt(plano.dias_restantes) + 30} dias.</Text>
            );
        } else {
            return (
                <Text style={[styles.textoObsModal, {marginVertical: 15}]}>Assinando o Plano Nutring {plano.nome}, você terá até o final do seu período atual para utilizá-lo, e pagará proporcional aos dias de uso.</Text>
            );
        }
    }

    renderModal(){
        if (this.state.planoAssinando){
            return (
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, .94)'}}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => this.setState({modalAberto: false})} style={styles.botaoFecharModal}>
                            <Icon name="times" color="#fff" size={24}/>
                        </TouchableOpacity>
                        <Text style={styles.tituloModal}>Plano Nutring {this.state.planoAssinando.nome}</Text>
                        <TouchableOpacity style={styles.botaoFecharModal}>
                            <Icon name="times" color="#000" size={24}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                        <View style={styles.viewModalFoto}>
                            <Image style={[styles.fotoModal, {borderColor: this.state.planoAssinando.id_plano == 2 ? '#976938' : '#28b657'}]} source={{uri: this.state.planoAssinando.foto}}/>
                        </View>
                        <View style={[styles.viewDescricaoModal, {borderColor: this.state.planoAssinando.id_plano == 2 ? '#976938' : '#28b657'}]}>
                            <Text style={styles.descricaoModal}>
                                {this.state.planoAssinando.descricao}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
                            <View style={styles.precosModal}>
                                <Text style={[styles.porApenasModal, {transform: [{translateY: 18}]}]}>
                                    por apenas
                                </Text>
                                <Text style={[styles.precoModal, {color: this.state.planoAssinando.id_plano == 2 ? '#976938' : '#28b657'}]}>R$ <Text style={styles.precoNumeroMaiorModal}>{this.corrigirPreco(this.state.planoAssinando.preco) ? this.corrigirPreco(this.state.planoAssinando.preco)[0] : ""}</Text>,{this.corrigirPreco(this.state.planoAssinando.preco) ? this.corrigirPreco(this.state.planoAssinando.preco)[1] : ""}</Text>
                            </View>
                            {this.renderBotaoModal(this.state.planoAssinando)}
                            {this.renderObsPlano(this.state.planoAssinando)}
                        </View>
                    </ScrollView>
                </View>
            );
        }
        return null;
    }

    render(){
        if (this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        if (this.state.erro){
            return <SemDados titulo={"Sem internet"} texto={"Verifique sua internet e tente novamente."}/>
        }
        return (
            <View style={{flex: 1, backgroundColor: '#000'}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.getModalClick("OK")}
                    botoes={this.state.modal.botoes}
                    />
                    <Modal 
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalAberto}
                            onRequestClose={() => {
                                this.setState({modalAberto: false})
                            }}
                    >
                        {this.renderModal()}
                            
                    </Modal>
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

    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    tituloModal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 22
    },
    viewModalFoto: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fotoModal: {
        width: 140,
        height: 140,
        borderRadius: 140/2,
        borderWidth: 2
    },
    viewDescricaoModal: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        paddingVertical: 15,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    descricaoModal: {
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 22,
        textAlign: 'center'
    },
    precosModal: {
        flexDirection: 'column',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    porApenasModal: {
        fontSize: 18,
        color: '#fff',
    },
    precoModal: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    precoNumeroMaiorModal: {
        fontSize: 90
    },
    botaoAssinarPlanoModal: {
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    textoBotaoAssinarPlanoModal: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10
    },
    textoObsModal: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center'
    },









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
        color: '#000',
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
    },
    

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