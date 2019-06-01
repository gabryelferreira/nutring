import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, Picker } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../components/ImagemNutring/ImagemNutring';
import Loader from '../../components/Loader/Loader';
import Modalzin from '../../components/Modal/Modal';
import Network from '../../network';
import Input from '../../components/Input/Input';
import Label from '../../components/Label/Label';
import { StackActions, NavigationActions } from 'react-navigation';
import { removerCaracteresEspeciais, removerCaracter, formatarCNPJ, formatarData, formatarCep } from '../../help-functions';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class RecuperarSenha extends Network {

    static navigationOptions = {
        header: (
            null
        )
    };

    state = {
        novaSenha: "",
        repetirSenha: "",
        loading: false,
        senhaAlterada: false,
        modal: {
            visible: false,
            title: "",
            subTitle: ""
        },
    }

    getModalClick(key = ""){
        this.setModalState(false);
        if (this.state.senhaAlterada){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Principal' })],
            });
            
            this.props.navigation.dispatch(resetAction);
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
            return <Text style={styles.textoBotao}>Recuperar</Text>
        } else {
            return <ActivityIndicator animating color="#fff"/>
        }
    }

    async alterarSenha(){
        this.setState({
            loading: true
        })
        let data = {
            usuario: this.props.navigation.getParam("usuario"),
            codigo: this.props.navigation.getParam("codigo"),
            novaSenha: this.state.novaSenha,
            repetirSenha: this.state.repetirSenha
        }
        let result = await this.callMethod("alterarSenhaRecuperacao", data);
        if (result.success){
            if (result.result == "SENHA_DIFERENTE") this.showModal("Senhas diferentes", "As senhas digitadas não coincidem.");
            else if (result.result == "EXPIRADO") this.showModal("Recuperação expirada", "O tempo para recuperação da senha expirou. É necessário iniciar a recuperação de senha novamente.");
            else if (result.result == "SENHA_ALTERADA"){
                this.setState({
                    senhaAlterada: true
                });
                this.showModal("Senha alterada", "Sua senha foi alterada com sucesso! Agora é só entrar e aproveitar as funcionalidades do Nutring!");
            }
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
    }

    returnDataFormatada(data){
        let _data = data.substring(6, 10) + "-" + data.substring(3, 5) + "-" + data.substring(0, 2);
        return _data;
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
                            Agora é só digitar a senha desejada.
                        </Text>
                        <Input
                        icone={"lock"}
                        label={"Nova Senha"} 
                        style={styles.input}
                        value={this.state.novaSenha}
                        onChangeText={(novaSenha) => this.setState({novaSenha})}
                        onSubmitEditing={() => this.segundoInput.focus()}
                        blurOnSubmit={false}
                        autoCapitalize = 'none'
                        returnKeyType={"next"}
                        secureTextEntry={true}
                        maxLength={100}
                        />
                        <Input
                        label={"Repetir Nova Senha"}
                        icone={"lock"}
                        inputRef={(input) => this.segundoInput = input}
                        value={this.state.repetirSenha}
                        onChangeText={(repetirSenha) => this.setState({repetirSenha})}
                        onSubmitEditing={() => this.alterarSenha()}
                        autoCapitalize = 'none'
                        secureTextEntry={true}
                        maxLength={100}
                        />
                        <TouchableOpacity onPress={() => this.alterarSenha()} style={styles.botao}>
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