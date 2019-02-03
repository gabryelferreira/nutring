import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import SearchBar from '../../../components/SearchBar/SearchBar';
import SearchButton from '../../../components/SearchBar/SearchBarButton';
import Card from '../../../components/Card/Card';
import SemDadosPerfil from '../../../components/SemDadosPerfil/SemDadosPerfil';
import SemDados from '../../../components/SemDados/SemDados';
import Item from '../../../components/Item/Item';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Notificacoes extends Network {

  static navigationOptions = () => ({
      title: 'Notificações',
  });

  state = {
    loading: false,
    carregandoPrimeiraVez: true,
    refreshing: false,
    dados: [],
    offset: 0,
    limit: 20,
    semMaisDados: false,
    promocao: {
      quantidade: 0,
      foto_restaurante: ""
    }
  }

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.getQuantidadePromocoes();
    // this.getNotificacoes();
  }

  async getQuantidadePromocoes(){
    let result = await this.callMethod("getQuantidadePromocoes");
    if (result.success){
      this.setState({
        promocao: result.result
      }, this.getNotificacoes)
    }
  }

  async getNotificacoes(){
    if (!this.state.semMaisDados){
      let result = await this.callMethod("getNotificacoes", { offset: this.state.offset, limit: this.state.limit });
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

  refreshNotificacoes(){
    this.setState({
      offset: 0,
      refreshing: true,
      semMaisDados: false
    }, this.getQuantidadePromocoes)
  }
  
  carregarMaisNotificacoes(){
    this.setState({
      offset: this.state.offset + this.state.limit
    }, this.getNotificacoes)
  }

  abrirPromocoes(){
    this.props.navigation.navigate("Promocoes");
  }

  returnHeaderComponent(){
      return <Item key={this.state.promocao.quantidade.toString()} 
                     onPress={() => this.abrirPromocoes()} 
                     onPressFoto={() => this.abrirPromocoes()} 
                     titulo={"Promoções"}
                     quantidade={this.state.promocao.quantidade}
                     descricao={this.state.promocao.quantidade > 0 ? "Veja as promoções dos seus restaurantes favoritos." : "Você não possui promoções disponíveis."} 
                     promo={true}
                     foto={this.state.promocao.foto_restaurante ? this.state.promocao.foto_restaurante : 'http://imagensemoldes.com.br/wp-content/uploads/2018/06/Emoji-Triste-PNG-300x300.png'}
                     />
  }

  returnFooterComponent(){
    if (!this.state.semMaisDados && !this.state.refreshing){
        return <ActivityIndicator color="#27ae60" size="large" style={{ marginVertical: 20 }}/>
    } return null;
  }

  handleOnPress = (cd_acao, id_usuario, id_post) => {
    if (cd_acao == "COMENTOU_POST" || cd_acao == "CURTIU_POST" || cd_acao == "CURTIU_COMENTARIO"){
        this.props.navigation.push("Postagem", { id_post: id_post });
    } else if (cd_acao == "SEGUIU"){
        this.props.navigation.push("Perfil", { id_usuario_perfil: id_usuario });
    }
  }

  handleOnPressFoto = (id_usuario_perfil) => {
      this.props.navigation.push("Perfil", { id_usuario_perfil });
  }

  handleOnPressFinal = (id_post, foto_post) => {
    if (foto_post){
      this.props.navigation.push("Postagem", { id_post });
    }
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
      return <SemDados icone={"sad-tear"} titulo={"Sem notificações"} texto={"Você não possui notificações."}/>
    }

    return (
      <FlatList
        data={this.state.dados}
        keyExtractor={(item, index) => item.id_acao.toString()}
        renderItem={({item, index}) => (
              <Item acao={item.cd_acao}
                item={item}
                titulo={item.nome}
                descricao={item.descricao}
                foto={item.foto}
                fotoPost={item.foto_post}
                tempoAtras={item.tempo_atras}
                navigation={this.props.navigation}
                onPress={() => this.handleOnPress(item.cd_acao, item.id_usuario, item.id_post)}
                onPressFoto={() => this.handleOnPressFoto(item.id_usuario)}
                onPressFinal={() => this.handleOnPressFinal(item.id_post, item.foto_post)}
                />
        )}
        refreshing={this.state.refreshing}
        onRefresh={() => this.refreshNotificacoes()}
        onEndReached={() => this.carregarMaisNotificacoes()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() => this.returnHeaderComponent()}
        ListFooterComponent={() => this.returnFooterComponent()}
        />
    );
  }


}

const styles = {
}