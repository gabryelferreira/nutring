import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class UsuarioCard extends Network {

    constructor(props){
        super(props);
        this.state = {
            usuario: this.props.usuario,
            navigation: this.props.navigation,
            seguindo: false,
            parandoDeSeguir: false
        }
    }

    async seguir(){
        let id_usuario = await this.getIdUsuarioLogado();
        let id_seguido = this.state.usuario.id_usuario;
        await this.setState({
            seguindo: true
        })
        let result = await this.callMethod("follow", { id_usuario, id_seguido });
        if (result.success){
            let usuario = this.state.usuario;
            usuario.is_seguindo = true;
            usuario.seguidores = usuario.seguidores + 1;
            await this.setState({
                usuario: usuario
            })
        }
        await this.setState({
            seguindo: false
        })
    }

    async pararDeSeguir(){
        let id_usuario = await this.getIdUsuarioLogado();
        let id_seguido = this.state.usuario.id_usuario;
        await this.setState({
            parandoDeSeguir: true
        })
        let result = await this.callMethod("unfollow", { id_usuario, id_seguido });
        if (result.success){
            let usuario = this.state.usuario;
            usuario.is_seguindo = false;
            usuario.seguidores = usuario.seguidores - 1;
            await this.setState({
                usuario: usuario
            })
        }
        await this.setState({
            parandoDeSeguir: false
        })
    }

    renderBotaoSeguir(){
        if (this.state.parandoDeSeguir || this.state.seguindo)
            return this.renderBotaoCarregandoSeguindo();
        if (this.state.usuario.is_seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={styles.textoBotaoEditar}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="check" color="#28b657" size={13} />
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={styles.botaoEditar} onPress={() => this.seguir()}>
                <Text style={styles.textoBotaoEditar}>Seguir</Text>
            </TouchableOpacity>
        );
    }

    renderBotaoCarregandoSeguindo(){
        if (this.state.seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={styles.textoBotaoEditar}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
        if (this.state.parandoDeSeguir){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={styles.textoBotaoEditar}>Seguir</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render(){
        let larguraImagem = imageWidth;
        let { id_usuario, nome, foto, seguidores, seguindo, posts } = this.state.usuario;
        return (
            <View style={[styles.container, {width: larguraImagem/2 - 30, marginHorizontal: 5, marginBottom: 10}]}>
                <TouchableOpacity style={styles.viewFoto} onPress={() => this.state.navigation.navigate("Perfil", { id_usuario_perfil: id_usuario })}>
                    <Image style={{flex: 1, width: undefined, height: undefined, borderRadius: undefined}} source={{uri: foto}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.state.navigation.navigate("Perfil", { id_usuario_perfil: id_usuario })}>
                    <Text style={styles.nome}>{nome}</Text>
                </TouchableOpacity>
                <View style={styles.tabs}>
                    <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                        <View style={styles.infoTab}>
                            {/* <Icon name="utensils" size={15} color="#aaa"/> */}
                            <Text style={styles.tabTitulo}>PRATOS</Text>
                        </View>
                        <Text style={styles.tabTexto}>{posts}</Text>
                    </View>
                    <View style={[styles.tab]}>
                        <View style={styles.infoTab}>
                            {/* <Icon name="chart-line" size={15} color="#aaa"/> */}
                            <Text style={styles.tabTitulo}>SEGUIDORES</Text>
                        </View>
                        <Text style={styles.tabTexto}>{seguidores}</Text>
                    </View>
                </View>
                {this.renderBotaoSeguir()}
                <AutoHeightImage source={require('../../assets/imgs/folha_nutring.png')} width={20} style={{position: 'absolute', top: 5, right: 5}}/>
            </View>
        );
    }

}

const styles = {
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#aaa'
    },
    viewFoto: {
        height: 55,
        width: 55,
        borderRadius: 55/2,
        overflow: 'hidden',
        marginBottom: 5
    },
    nome: {
        color: '#000',
        maxHeight: 17,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold'
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tab: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoTab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3
    },
    tabTitulo: {
        fontSize: 8,
        color: '#aaa',
        marginHorizontal: 8,
        letterSpacing: 1.1
    },
    tabTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222'
    },
    botaoEditar: {
        marginTop: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        flexDirection: 'row'
    },
    textoBotaoEditar: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold'
    },
}