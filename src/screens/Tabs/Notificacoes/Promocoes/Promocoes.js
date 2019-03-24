import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../../network';
import SearchBar from '../../../../components/SearchBar/SearchBar';
import SearchButton from '../../../../components/SearchBar/SearchBarButton';
import Card from '../../../../components/Card/Card';
import SemDadosPerfil from '../../../../components/SemDadosPerfil/SemDadosPerfil';
import SemDados from '../../../../components/SemDados/SemDados';
import Item from '../../../../components/Item/Item';
import Promocao from '../../../../components/Promocao/Promocao';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Promocoes extends Network {

    static navigationOptions = () => ({
        title: 'Promocões',
    });

    state = {
        loading: false,
        carregandoPrimeiraVez: true,
        refreshing: false,
        dados: [],
        offset: 0,
        limit: 20,
        semMaisDados: false,
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.getPromocoes();
    }

    async getPromocoes(){
        if (!this.state.semMaisDados){
        let result = await this.callMethod("getPromocoes", { offset: this.state.offset, limit: this.state.limit });
        if (result.success){
            if (this.state.refreshing){
            await this.setState({
                dados: []
            })
        }
            if (result.result.length < this.state.limit){
            this.setState({
                semMaisDados: true
            })
            }
            let dados = this.state.dados;
            for (var i = 0; i < result.result.length; i++){
            dados.push(result.result[i]);
            }
            this.setState({
            dados
            })
        }
        this.setState({
            carregandoPrimeiraVez: false,
            refreshing: false
        })
        }
    }

    refreshPromocoes(){
        this.setState({
        offset: 0,
        refreshing: true,
        semMaisDados: false
        }, this.getPromocoes)
    }
    
    carregarMaisPromocoes(){
        this.setState({
        offset: this.state.offset + this.state.limit
        }, this.getPromocoes)
    }

    abrirPromocoes(){

    }

    returnHeaderComponent(){
        return <Item key={this.state.promocao.quantidade.toString()} 
                        onPress={() => this.abrirPromocoes()} 
                        onPressFoto={() => this.abrirPromocoes()} 
                        titulo={"Promoções"}
                        quantidade={this.state.promocao.quantidade}
                        descricao={this.state.promocao.quantidade > 0 ? "Veja as promoções disponíveis hoje." : "Você não recebeu promoções hoje."} 
                        promo={true}
                        foto={this.state.promocao.foto_restaurante}
                        />
    }

    returnFooterComponent(){
        if (!this.state.semMaisDados && !this.state.refreshing){
            return <ActivityIndicator color="#27ae60" size="large" style={{ marginVertical: 20 }}/>
        } return null;
    }

    handleOnPress = (id_promocao) => {
        this.props.navigation.push("Promocao", { id_promocao });
    }

    handleOnPressFoto = (id_usuario_perfil) => {
        this.props.navigation.push("Perfil", { id_usuario_perfil });
    }


  render() {

    if (this.state.carregandoPrimeiraVez){
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color="#28b657" />
          </View>
      );
    }

    if (this.state.dados.length == 0 && !this.state.refreshing){
      return <SemDados titulo={"Sem promoções"} texto={"Você não possui promoções."}/>
    }

    return (
      <FlatList
        data={this.state.dados}
        keyExtractor={(item, index) => item.id_promocao.toString()}
        renderItem={({item, index}) => (
              <Promocao
                titulo={item.nome}
                descricao={item.descricao}
                foto={item.foto_restaurante}
                // tempoAtras={item.tempo_atras}
                relampago={item.is_promocao_relampago}
                confirmados={item.confirmados}
                confirmacao={item.estou_confirmado}
                onPress={() => this.handleOnPress(item.id_promocao)}
                onPressFoto={() => this.handleOnPressFoto(item.id_usuario)}
                onPressFinal={() => this.handleOnPress(item.id_promocao)}
                />
        )}
        refreshing={this.state.refreshing}
        onRefresh={() => this.refreshPromocoes()}
        onEndReached={() => this.carregarMaisPromocoes()}
        onEndReachedThreshold={0.5}
        // ListHeaderComponent={() => this.returnHeaderComponent()}
        ListFooterComponent={() => this.returnFooterComponent()}
        />
    );
  }


}

const styles = {
}