import React, { Component } from 'react';
import { View, Text, Image, NativeModules, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, KeyboardAvoidingView, Platform } from 'react-native';
const { StatusBarManager } = NativeModules;
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../components/ImagemNutring/ImagemNutring';
import Loader from '../../components/Loader/Loader';
import Modalzin from '../../components/Modal/Modal';
import Network from '../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Input from '../../components/Input/Input';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Login extends Network {


    state = {
        loading: false,
        modal: {
            visible: false,
            title: "",
            subTitle: "",
            botoes: this.criarBotoes()
        },
        email: "",
        senha: "",
        statusBarHeight: Platform.OS === 'ios' ? 20 : 0
    }

    static navigationOptions = {
        header: (
            null
        )
    };

    componentDidMount(){
        if (Platform.OS === 'ios'){
            StatusBarManager.getHeight(statusBar => {
                this.setState({
                    statusBarHeight: statusBar.height
                })
            })
        }
    }

    async salvarNavigation(navigation){
        try {
            await AsyncStorage.setItem("navigation", JSON.stringify(navigation));
        } catch (error) {
            console.error(error);
        }
    }

    async login(){
        if (!this.state.loading){
            this.setState({loading: true});
            let result = await this.callMethod("login", {email: this.state.email, senha: this.state.senha})
            if (result.success){
                if (result.result == "INVALID_LOGIN"){
                    this.setState({
                        modal: {
                            title: "Login inválido",
                            subTitle: "Essa conta não foi encontrada. O que deseja fazer?",
                            visible: true,
                            botoes: this.criarBotoes()
                        }
                    })
                    this.setState({loading: false})
                } else {
                    await this.salvarDadosUsuario(result.result);
                    // await this.salvarNavigation(this.props.navigation);
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
                    });
                    
                    this.props.navigation.dispatch(resetAction);
                }
            } else {
                this.setState({
                    modal: {
                        title: "Ocorreu um erro",
                        subTitle: "Parece que você está sem internet. Verifique-a e tente novamente.",
                        visible: true
                    }
                })
                this.setState({loading: false})
            }
        }
    }

    async salvarDadosUsuario(usuario){
        try {
            await AsyncStorage.setItem("userData", JSON.stringify(usuario));
        } catch(error){
            console.error(error);
        }
    }
    
    criarBotoes(){
        let botoes = [
            {chave: "CRIAR", texto: "Criar conta", color: '#27ae60', fontWeight: 'bold'},
            {chave: "TENTAR", texto: "Tentar novamente"},
        ]
        return botoes;
    }
    
    abrirCadastro(){
        this.props.navigation.navigate('Principal');
    }

    abrirEsqueciSenha(){
        console.log("to aqui")
        this.props.navigation.navigate('EsqueciSenha');
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
        if (key == "CRIAR"){
            this.abrirCadastro();
        }
    }

    renderTextoBotao(){
        if (!this.state.loading){
            return <Text style={styles.textoBotao}>Entrar</Text>
        } else {
            return <ActivityIndicator animating color="#fff"/>
        }
    }

    mudarOpcao(){
        this.setState({
            modal: {
                title: "Opção não disponível  :(",
                subTitle: "Essa opção está em desenvolvimento pela nossa super-equipe! Aguarde.",
                visible: true
            }
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
                    onClose={() => this.setState({modal: {visible: false}})}
                    botoes={this.state.modal.botoes}
                />
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled={Platform.OS === 'ios' ? true : false}   keyboardVerticalOffset={0}>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>

                        {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.botaoVoltar}>
                            <Icon name="chevron-left" solid color="#28b657" size={22}/>
                        </TouchableOpacity> */}

                        <View style={styles.viewLogin}>
                            <View style={{alignItems: 'center', justifyContent: 'flex-end', flex: .5}}>
                                <AutoHeightImage source={require('../../assets/imgs/logo-com-slogan.png')} width={260}/>
                                {/* <Text style={{marginTop: 10}}>Você mais saudável</Text> */}
                            </View>
                        {/* <View style={styles.botoesOpcao}>
                            <TouchableOpacity style={[styles.botaoOpcao, styles.botaoVerde]}>
                                <Text style={[styles.textoBranco, styles.textoBotaoOpcao]}>Pessoa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.mudarOpcao()} style={styles.botaoOpcao}>
                                <Text style={[styles.textoVerde, styles.textoBotaoOpcao]}>Restaurante</Text>
                            </TouchableOpacity>
                        </View> */}
                            <View style={styles.container}>
                                <TextInput 
                                placeholder="Usuário ou email" 
                                placeholderTextColor="rgb(153, 153, 153)" 
                                style={styles.input}
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                                returnKeyType={"next"}
                                onSubmitEditing={() => this.segundoInput.focus()}
                                blurOnSubmit={false}
                                autoCapitalize = 'none'
                                maxLength={60}
                                />
                                <TextInput 
                                ref={(input) => this.segundoInput = input}
                                placeholder="Senha" 
                                placeholderTextColor="rgb(153, 153, 153)" 
                                style={styles.input}
                                value={this.state.senha}
                                onChangeText={(senha) => this.setState({senha})}
                                onSubmitEditing={() => this.login()}
                                secureTextEntry={true}
                                autoCapitalize = 'none'
                                maxLength={30}
                                />
                                <TouchableOpacity disabled={!this.state.email.trim() || !this.state.senha.trim()} onPress={() => this.login()} style={[styles.botao, !this.state.email.trim() || !this.state.senha.trim() ? styles.disabled : {}]}>
                                    {this.renderTextoBotao()}
                                </TouchableOpacity>
                                <View style={{marginTop: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={styles.textoProblema}>Problemas no acesso? </Text>
                                    <TouchableOpacity onPress={() => this.abrirEsqueciSenha()}>
                                        <Text style={styles.textoProblemaLink}>Clique aqui.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
                {/* <View style={{position: 'absolute', left: 0, bottom: 0, flex: 1, zIndex: -1}}>
                    <AutoHeightImage source={require('../../assets/imgs/fundo.png')} width={imageWidth}/>
                </View> */}
            </View>
        );
    }
}

const styles = {
    disabled: {
        opacity: .4
    },
    container: {
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingVertical: 30,
        justifyContent: 'flex-start',
        flex: .5,
        paddingTop: 50
    },
    backgroundImage: {
        height: imageHeight,
        width: imageWidth,
        position: 'absolute'
    },
    viewLogin: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
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
        alignSelf: 'center'
    },
    botaoOpcao: {
        flex: .5,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
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
    },
    viewCadastro: {
        flex: .2,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    cadastro: {
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 15,
        paddingBottom: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoCadastro: {
        color: '#aaa'
    },
    textoCadastroLink: {
        color: '#222',
        fontWeight: 'bold'
    },
    botaoVoltar: {
        marginHorizontal: 20,
        paddingTop: 50,
        paddingHorizontal: 10
    }
}