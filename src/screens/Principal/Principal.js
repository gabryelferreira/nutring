import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, AsyncStorage, ActivityIndicator, BackHandler } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { StackActions, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Principal extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props){
        super(props);
        this.state = {
            carregando: true
        }
        this.isUsuarioLogado();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        // this.goBack();
        console.log("going back")
        BackHandler.exitApp()
        return true;
    }

    async isUsuarioLogado(){
        try {
            let user = await AsyncStorage.getItem("userData");
            user = JSON.parse(user);
            if (user && user.token){
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
                });
                this.props.navigation.dispatch(resetAction);
            } else {
                await this.setState({
                    carregando: false
                })
                SplashScreen.hide();
            }
        } catch (error) {
            await this.setState({
                carregando: false
            })
            SplashScreen.hide();
            console.error(error);
        }

    }

    navigate(screen){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.props.navigation.navigate(screen);
    }

    render(){
        if (this.state.carregando){
            return null;
        }
        return (
            <View style={{flex: 1}}>
                <View style={styles.view}>
                    <AutoHeightImage source={require('../../assets/imgs/logo-com-slogan.png')} width={260}/>
                    {/* <Text style={{marginTop: 10}}>Você mais saudável</Text> */}
                    <View style={styles.botoes}>
                        <TouchableOpacity onPress={() => this.navigate('Cadastro')} style={[styles.botao, styles.botaoVerde]}>
                            <Text style={[styles.textoBranco, styles.textoBotao]}>Criar conta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.navigate('Login')} style={styles.botao}>
                            <Text style={[styles.textoVerde, styles.textoBotao]}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{position: 'absolute', left: 0, bottom: 0, flex: 1}}>
                    <AutoHeightImage source={require('../../assets/imgs/fundo.png')} width={imageWidth}/>
                </View>
            </View>
        );
    }
}

const styles = {
    view: {
        flex: .9,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    botoes: {
        width: 260,
        marginTop: 50,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        height: 55,
        borderRadius: 30,
        alignItems: 'center'
    },
    botao: {
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
        color: '#27ae60'
    },
    textoBotao: {
        fontWeight: 'bold'
    }
}