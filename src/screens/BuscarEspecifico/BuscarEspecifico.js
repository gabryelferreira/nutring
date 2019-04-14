import React, { Component } from 'react';
import { View, TouchableOpacity, NativeModules, Text, Image, Button, Modal, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
const { StatusBarManager } = NativeModules;
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import SearchBar from '../../components/SearchBar/SearchBar';
import { HeaderBackButton } from 'react-navigation';
import SemDados from '../../components/SemDados/SemDados';
import Item from '../../components/Item/Item';


import { StackActions, NavigationActions } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

const Header = ({navigation}) => {
    return (
        <View></View>
    );
}

export default class BuscarEspecifico extends Network {

    static navigationOptions = ({ navigation }) => ({
        header: (
            <View></View>
        )
    });

    state = {
        loading: true,
        pesquisa: "",
        usuarios: [],
        offset: [],
        limit: [],
        statusBarHeight: Platform.OS === 'ios' ? 20 : 0
    }

    constructor(props){
        super(props);
    }

    async getUsuariosPesquisados(){
        let result = await this.callMethod("getUsuariosPesquisados");
        if (result.success){
            if (result.result.length == 0){
                this.getRandomUsuarios();
            } else {
                this.setState({
                    usuarios: result.result,
                    loading: false
                })
            }
        }
    }

    async getRandomUsuarios(){
        let result = await this.callMethod("getRandomUsuarios");
        if (result.success){
            this.setState({
                usuarios: result.result,
                loading: false
            })
        }
    }

    async pesquisar(pesquisa){
        this.setState({
            loading: true
        })
        if (!pesquisa){
            this.getUsuariosPesquisados();
        } else {
            let result = await this.callMethod("getPesquisaUsuarios", { pesquisa });
            if (result.success){
                this.setState({
                    usuarios: result.result,
                    loading: false
                })
            }
        }
    }

    componentDidMount() {
        if (Platform.OS === 'ios'){
            StatusBarManager.getHeight(statusBar => {
                this.setState({
                    statusBarHeight: statusBar.height
                });
            });
        }
        this.getUsuariosPesquisados();
    }

    renderTextoSeguindo(is_seguindo, is_seguindo_voce, seguidores){
        if (is_seguindo)
            return "Seguindo";
        if (is_seguindo_voce)
            return "Te segue";
        let textoSeguidores = " seguidores";
        if (seguidores == 1)
            textoSeguidores = " seguidor";
        return seguidores + textoSeguidores;
    }

    pesquisarUsuario(id_usuario_pesquisado){
        this.callMethod("pesquisarUsuario", { id_usuario_pesquisado });
        this.props.navigation.navigate("Perfil", { id_usuario_perfil: id_usuario_pesquisado });
    }

  renderUsuarios(){
    return this.state.usuarios.map((usuario) => {
        return <Item key={usuario.id_usuario} 
                     onPress={() => this.pesquisarUsuario(usuario.id_usuario)} 
                     onPressFoto={() => this.pesquisarUsuario(usuario.id_usuario)} 
                     titulo={usuario.nome} descricao={this.renderTextoSeguindo(usuario.is_seguindo, usuario.is_seguindo_voce, usuario.seguidores)} 
                     tipo="BUSCANDO" 
                     foto={usuario.foto}
                     />
    })
  }


    renderDados(){
        if (this.state.loading){
            return (
                <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', marginTop: 20}}>
                    <ActivityIndicator color="#777" size="large" />
                </View>
            );
        } else if (this.state.usuarios.length == 0){
                return (
                    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 15}}>
                        <Text style={{fontSize: 14, color: '#777', fontWeight: 'bold'}}>Não foram encontrados resultados</Text>
                    </View>
            );
        }
        return this.renderUsuarios();
    }

  render() {
    return (
    <View style={[{flex: 1, backgroundColor: '#fff', marginTop: this.state.statusBarHeight}]}>

        <View style={{
                elevation: 1,
                shadowOpacity: 0,
                height: 50,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                left: 0, right: 0, top: 0,
                zIndex: 9999,
                borderBottomWidth: 1,
                borderBottomColor: '#eee'
            }}>
                <SearchBar value={this.state.pesquisa} navigation={this.props.navigation} onChangeText={(pesquisa) => this.setState({pesquisa}, () => this.pesquisar(this.state.pesquisa))}/>
            </View>
        <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
            {this.renderDados()}
        </ScrollView>
    </View>
    );
  }

}