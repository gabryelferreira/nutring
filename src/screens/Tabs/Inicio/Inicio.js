import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Input from '../../../components/Input/Input';
import Network from '../../../network';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const InicioHeader = () => {
    return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 1, borderColor: '#eee', height: 30, width: 30, borderRadius: 30/2}}>
                <Image style={{height: 30, width: 30, borderRadius: 30/2, borderWidth: 1, borderColor: '#eee'}} source={require('../../../assets/imgs/eu.jpg')}/>
            </View>
            <AutoHeightImage style={{alignSelf: 'center'}} source={require('../../../assets/imgs/nutring-color.png')} width={110}/>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Icon style={{marginRight: 20}}
                    name="search"
                    size={17}
                    color='#27ae60' />
                <Icon
                    name="ellipsis-v"
                    size={17}
                    color='#27ae60' />
            </View>
        </View>
    );
}

export default class Inicio extends Network {

    static navigationOptions = {
        headerTitle: (
            <InicioHeader/>
        )
    };

    state = {
        carregando: false,
        dados: [],
        offset: 0
    }

    nomes = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "FODA-SE", "Y", "TUA TIA", "MATTHAUS", "Z"];

    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log("to no didmount bb")
        this.carregarDadosIniciais();
    }

    cadastrar(){
        console.log("opa")
    }

    irParaLogin(){
        console.log("indo")
    }

    carregarDadosIniciais() {
        console.log("carregando seus dados iniciais bb")
        this.setState({
            offset: 0,
            dados: []
        }, this.carregarDados)
    }

    async carregarDados() {
        let result = await this.callMethod("getFeed", { id_usuario: 1, offset: this.state.offset, limit: 10 })
        if (result.success){
            let dados = this.state.dados;
            result.result.forEach(element => {
                let dado = element;
                dado.conteudo = dado.conteudo[0].url_conteudo;
                console.log("conteudo = ", dado.conteudo)
                dados.push(element)
            });
            console.log("settando estadooooooooo")
            this.setState({
                dados: dados
            }, function() {
                console.log("TODOS OS DADOS = ", this.state.dados)
            });
            
            console.log("ofsset aqui embaixoxoo " + this.state.offset)
        }
    }

    pegarDados(){
        this.setState({
            offset: this.state.offset + 10
        }, this.carregarDados);        
    }

    render(){
        let larguraImagem = imageWidth - 15*2 - imageWidth*0.2;
        return (
            <FlatList
                data={this.state.dados}
                keyExtractor={(item, index) => item.id_post.toString()}
                renderItem={({item}) => (
                    // <Text>{item.key}</Text>

                    <View style={styles.container}>
                        <View style={styles.viewFoto}>
                            <Image style={{height: 52, width: 52, borderRadius: 52/2}} source={{uri: item.foto}}/>
                        </View>
                        <View style={styles.viewInfoEConteudo}>
                            <View style={styles.viewInfo}>
                                <View style={styles.viewInfoTexto}>
                                    <Text style={styles.nome}>{item.nome}</Text>
                                    <Text style={styles.tempo}>30 min atrás</Text>
                                </View>
                                <View style={styles.viewInfoCurtidas}>
                                    <AutoHeightImage style={{marginRight: 7}} source={require('../../../assets/imgs/folha_nutring.png')} width={27}/>
                                    <Text style={styles.curtidas}>{item.curtidas}</Text>
                                </View>
                            </View>
                            <View style={styles.viewInfoDescricao}>
                                <Text style={styles.texto}>{item.descricao}</Text>
                            </View>
                            <View style={styles.viewImagem}>
                                <AutoHeightImage style={{borderRadius: 5}} source={{uri: item.conteudo}} width={larguraImagem}/>
                            </View>
                        </View>
                    </View>

                )}
                refreshing={this.state.carregando}
                onRefresh={() => this.carregarDadosIniciais()}
                onEndReached={() => this.pegarDados()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 20, marginBottom: 40 }}/>}
                />
        );
    }
}

const styles = {
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    viewFoto: {
        flex: .2,
        flexDirection: 'column',
        alignItems: 'center'
    },
    viewInfoEConteudo: {
        flex: .8,
        flexDirection: 'column',
    },
    viewInfo: {
        flexDirection: 'row'
    },
    viewInfoTexto: {
        flex: .7,
        flexDirection: 'column'
    },
    nome: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold'
    },
    tempo: {
        fontSize: 13,
        color: '#aaa'
    },
    viewInfoCurtidas: {
        flex: .3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 3
    },
    curtidas: {
        fontSize: 17,
        color: '#aaa',
        fontWeight: 'bold'
    },
    viewInfoDescricao: {
        flexDirection: 'column'
    },
    texto: {
        marginTop: 15,
        fontSize: 15,
        color: '#000'
    },
    viewImagem: {
        marginTop: 10,
        flexDirection: 'row'
    }
}