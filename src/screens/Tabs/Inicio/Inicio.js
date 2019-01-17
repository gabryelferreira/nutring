import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import Post from '../../../components/Post/Post';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const InicioHeader = () => {
    return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20}}>
            {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 1, borderColor: '#eee', height: 30, width: 30, borderRadius: 30/2}}>
                <Image style={{height: 30, width: 30, borderRadius: 30/2, borderWidth: 1, borderColor: '#eee'}} source={require('../../../assets/imgs/eu.jpg')}/>
            </View> */}
            <AutoHeightImage style={{alignSelf: 'center'}} source={require('../../../assets/imgs/nutring-color.png')} width={110}/>
            {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Icon style={{marginRight: 20}}
                    name="search"
                    size={17}
                    color='#27ae60' />
                <Icon
                    name="ellipsis-v"
                    size={17}
                    color='#27ae60' />
            </View> */}
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
        offset: 0,
        semMaisDados: false
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
            dados: [],
            semMaisDados: false
        }, this.carregarDados)
    }

    async carregarDados() {
        if (!this.state.semMaisDados){
            let result = await this.callMethod("getFeed", { id_usuario: 1, offset: this.state.offset, limit: 10 })
            if (result.success){
                if (result.result.length == 0){
                    this.setState({
                        semMaisDados: true
                    })
                } else {
                    let dados = this.state.dados;
                    result.result.forEach(element => {
                        let dado = element;
                        dado.conteudo = dado.conteudo[0].url_conteudo;
                        console.log("conteudo = ", dado.conteudo)
                        dados.push(element)
                    });
                    this.setState({
                        dados: dados
                    }, function() {
                        console.log("TODOS OS DADOS = ", this.state.dados)
                    });                
                }
            }
        }
    }

    pegarDados(){
        this.setState({
            offset: this.state.offset + 10
        }, this.carregarDados);        
    }

    returnFooterComponent(){
        if (!this.state.semMaisDados){
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginTop: 20, marginBottom: 40 }}/>
        } else return <View style={{marginBottom: 20}}></View>
    }

    render(){
        return (
            <FlatList
                data={this.state.dados}
                keyExtractor={(item, index) => item.id_post.toString()}
                renderItem={({item}) => (

                    <Post data={item}/>

                )}
                refreshing={this.state.carregando}
                onRefresh={() => this.carregarDadosIniciais()}
                onEndReached={() => this.pegarDados()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => this.returnFooterComponent()}
                legacyImplementation={true}
                enableEmptySections={true}
                />
        );
    }
}