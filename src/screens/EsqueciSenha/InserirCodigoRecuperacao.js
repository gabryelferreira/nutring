import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, Picker } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../components/ImagemNutring/ImagemNutring';
import Loader from '../../components/Loader/Loader';
import Modalzin from '../../components/Modal/Modal';
import Network from '../../network';
import Input from '../../components/Input/Input';
import Label from '../../components/Label/Label';
import { removerCaracteresEspeciais, removerCaracter, formatarCNPJ, formatarData, formatarCep } from '../../help-functions';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class InserirCodigoRecuperacao extends Network {

    static navigationOptions = {
        header: (
            <View></View>
        )
    };

    state = {
        codigo: "",
        loading: false,
        modal: {
            visible: false,
            title: "",
            subTitle: ""
        },
    }

    getModalClick(key = ""){
        this.setModalState(false);
        if (this.state.solicitacaoEnviada){
            this.props.navigation.goBack(null);
        }
    }

    showModal(titulo, subTitulo){
        this.setState({
            modal: {
                title: titulo,
                subTitle: subTitulo,
                visible: true
            }
        })
    }

    setModalState(visible){
        this.setState({
            modal: {
                visible: visible
            }
        })
    }

    constructor(props){
        super(props);
    }

    renderTextoBotao(){
        if (!this.state.loading){
            return <Text style={styles.textoBotao}>Validar</Text>
        } else {
            return <ActivityIndicator animating color="#fff"/>
        }
    }

    async recuperar(){
        this.setState({
            loading: true
        })
        let data = {
            usuario: this.props.navigation.getParam("usuario"),
            codigo: this.state.codigo
        }
        let result = await this.callMethod("validarCodigo", data);
        if (result.success){
            if (result.result == "CODIGO_INVALIDO") this.showModal("Código inválido", "O código digitado é inválido. Use o código que foi enviado para seu e-mail.");
            else if (result.result == "CODIGO_VALIDO") this.props.navigation.navigate("RecuperarSenha", { usuario: this.props.navigation.getParam("usuario"), codigo: this.state.codigo });
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
    }

    render(){
        return (      
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.title} 
                    subTitulo={this.state.modal.subTitle} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.getModalClick()}
                    botoes={this.state.modal.botoes}
                />
                <ScrollView keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.container}>
                        <View style={{alignItems: 'center', marginBottom: 30}}>
                            <AutoHeightImage source={require('../../assets/imgs/logo-com-slogan.png')} width={120}/>
                        </View>
                        <Text style={styles.textoRecuperacao}>
                            Digite o código enviado para o seu e-mail para recuperar sua senha.
                        </Text>
                        <Input
                        label={"Código de Recuperação"}
                        icone={"key"}
                        value={this.state.codigo}
                        onChangeText={(codigo) => this.setState({codigo})}
                        onSubmitEditing={() => this.recuperar()}
                        autoCapitalize = 'none'
                        keyboardType='number-pad'
                        maxLength={5}
                        />
                        <TouchableOpacity onPress={() => this.recuperar()} style={styles.botao}>
                            {this.renderTextoBotao()}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    container: {
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingVertical: 30,
    },
    textoRecuperacao: {
        marginBottom: 10
    },
    backgroundImage: {
        height: imageHeight,
        width: imageWidth,
        position: 'absolute'
    },
    viewLogo: {
        flex: .5,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    viewCadastro: {
        flex: .8,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 40
    },
    botoesOpcao: {
        width: 260,
        marginTop: 50,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        alignSelf: 'center',
    },
    botoesOpcaoVerde: {
        backgroundColor: '#27ae60'
    },
    botaoOpcao: {
        flex: .5,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    botaoBranco: {
        backgroundColor: '#fff'
    },
    botaoVerde: {
        backgroundColor: '#27ae60'
    },
    textoBranco: {
        color: '#fff'
    },
    textoVerde: {
        color: 'rgba(39,174,96, .4)'
    },
    textoBotaoOpcao: {
        fontWeight: 'bold'
    },
    picker: {
        alignSelf: 'stretch',
        borderRadius: 30,
        paddingLeft: 15,
        paddingRight: 5,
        color: '#000',
        fontSize: 14,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 7,
        marginBottom: 7
    },
    input: {
        alignSelf: 'stretch',
        borderRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 15,
        color: '#000',
        fontSize: 15,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 7,
        marginBottom: 7
    },
    botao: {
        borderRadius: 30,
        alignSelf: 'stretch',
        color: '#fff',
        backgroundColor: '#27ae60',
        height: 60,
        marginTop: 7,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textoProblema: {
        color: '#aaa',
    },
    textoProblemaLink: {
        color: '#222',
        fontWeight: 'bold',
    }
}