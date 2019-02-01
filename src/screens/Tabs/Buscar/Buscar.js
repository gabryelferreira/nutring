import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import SearchBar from '../../../components/SearchBar/SearchBar';
import SearchButton from '../../../components/SearchBar/SearchBarButton';
import Card from '../../../components/Card/Card';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Buscar extends Network {

    static navigationOptions = ({ navigation }) => 
  ({
    header: (
        <View style={{
            borderBottom: 1,
            borderColor: '#ddd',
            elevation: 1,
            shadowOpacity: 0,
            height: 50,
            overflow: 'hidden'
        }}>
            <SearchButton onPress={navigation.getParam('abrirModal')}/>
        </View>
    )
  });

  imagens = [
        "https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/51163/tomatoes-eggs-dish-the-green-plate-51163.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/22420/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/1162540/pexels-photo-1162540.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://images.pexels.com/photos/1440119/pexels-photo-1440119.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://images.pexels.com/photos/812860/pexels-photo-812860.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/51163/tomatoes-eggs-dish-the-green-plate-51163.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    ];

  abrirModal(){
    this.props.navigation.navigate('BuscarEspecifico');
  }

  state = {
      loading: true,
      restaurantes: [],
      pratosRestaurantes: [],
      pratos: [],
      offset: 0,
      limit: 12,
      loadingPratos: false
  }

  constructor(props){
      super(props);
  }

  componentDidMount() {
    this.props.navigation.setParams({
        abrirModal: this.abrirModal.bind(this)
    })
    this.getTopRestaurantes();
  }

  async getTopRestaurantes(){
      let result = await this.callMethod("getTopRestaurantes");
      if (result.success){
        this.setState({
            restaurantes: result.result
        }, this.getTopPratosRestaurantes)
      }
  }

  async getTopPratosRestaurantes(){
    let result = await this.callMethod("getTopPratosRestaurantes");
    if (result.success){
      this.setState({
          pratosRestaurantes: result.result
      }, this.getTopPratosClientes)
    }
  }

  async getTopPratosClientes(){
    let result = await this.callMethod("getTopPratosClientes", { offset: this.state.offset, limit: this.state.limit });
    if (result.success){
      this.setState({
          pratos: result.result,
          loading: false,
          loadingPratos: false
      })
    }
  }

  getMaisPratos(){
      this.setState({
          offset: this.state.offset + this.state.limit,
          loadingPratos: true
      }, this.getTopPratosClientes)
  }

  componentWillUnmount() {
    this.props.navigation.setParams({
        abrirModal: null
    })
  }

  fecharBusca(){
      this.props.navigation.setParams({
          modalAberto: false
      })
  }

  renderImagens(){
    if (this.imagens.length == 12){
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <View key={this.imagens[0]} style={{width: imageWidth/1.5, height: imageWidth/1.5, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[0]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>

                <View style={{flexDirection: 'column'}}>
                    <View key={this.imagens[1]} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, paddingBottom: 2}}>
                        <Image source={{uri: this.imagens[1]}} style={{flex: 1, width: undefined, height: undefined}}/>
                    </View>
                    <View key={this.imagens[2]} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, paddingBottom: 2}}>
                        <Image source={{uri: this.imagens[2]}} style={{flex: 1, width: undefined, height: undefined}}/>
                    </View>
                </View>

                <View key={this.imagens[3]} style={{width: imageWidth/3, height: imageWidth/3, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[3]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>
                <View key={this.imagens[4]} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[4]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>
                <View key={this.imagens[5]} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[5]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>

                <View style={{flexDirection: 'column'}}>
                    <View key={this.imagens[6]} style={{width: imageWidth/3, height: imageWidth/3, paddingBottom: 2}}>
                        <Image source={{uri: this.imagens[6]}} style={{flex: 1, width: undefined, height: undefined}}/>
                    </View>
                    <View key={this.imagens[7]} style={{width: imageWidth/3, height: imageWidth/3, paddingBottom: 2}}>
                        <Image source={{uri: this.imagens[7]}} style={{flex: 1, width: undefined, height: undefined}}/>
                    </View>
                </View>

                <View key={this.imagens[8]} style={{width: imageWidth/1.5, height: imageWidth/1.5, paddingLeft: 2, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[8]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>

                <View key={this.imagens[9]} style={{width: imageWidth/3, height: imageWidth/3, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[9]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>
                <View key={this.imagens[10]} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[10]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>
                <View key={this.imagens[11]} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, paddingBottom: 2}}>
                    <Image source={{uri: this.imagens[11]}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>

            </View>
        );

    } else {
        return this.imagens.map((imagem, index) => {
            if (index == 0){
                return (
                    <View key={imagem} style={{width: imageWidth/3, height: imageWidth/3, marginBottom: 2}}>
                        <Image source={{uri: imagem}} style={{flex: 1, width: undefined, height: undefined}}/>
                    </View>
                );
            }
            return (
                <View key={imagem} style={{width: imageWidth/3, height: imageWidth/3, paddingLeft: 2, marginBottom: 2}}>
                    <Image source={{uri: imagem}} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>
            );
        });
    }
  }
  
    renderTopRestaurantes(){
        return this.state.restaurantes.map((restaurante) => {
            return <Card key={restaurante.id_usuario} imagem={restaurante.foto} nome={restaurante.nome} seguidores={restaurante.seguidores} onPress={() => this.props.navigation.navigate("Perfil", { id_usuario_perfil: restaurante.id_usuario })}/>
        })
    }

    renderTopRestaurantesView(){
        if (this.state.restaurantes.length > 0){
            return (
                <View>
                    <View style={[styles.item, styles.paddingHorizontal]}>
                        <View style={styles.flexRow}>
                            <View style={styles.bolinhaVerde}></View><Text style={styles.subTitulo}>Restaurantes</Text>
                        </View>
                    </View>
                    <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
                        {this.renderTopRestaurantes()}
                    </ScrollView>
                </View>
            );
        }
    }

    renderTopPratosRestaurantes(){
        return this.state.pratosRestaurantes.map((prato) => {
            return <Card key={prato.id_usuario} imagem={prato.foto} nome={prato.nome} seguidores={prato.curtidas} onPress={() => this.props.navigation.navigate("Perfil", { id_usuario_perfil: prato.id_usuario })}/>
        })
    }

renderTopPratosRestaurantesView(){
    if (this.state.restaurantes.length > 0){
        return (
            <View>
                <View style={[styles.item, styles.paddingHorizontal]}>
                    <View style={styles.flexRow}>
                        <View style={styles.bolinhaVerde}></View><Text style={styles.subTitulo}>Pratos</Text>
                    </View>
                </View>
                <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
                    {this.renderTopPratosRestaurantes()}
                </ScrollView>
            </View>
        );
    }
    return null;
}

  render() {
      if (this.state.loading){
          return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#28b657" />
              </View>

          );
      }
    return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
        <Text style={[styles.titulo, styles.paddingHorizontal]}>Em alta</Text>
        
        {this.renderTopRestaurantesView()}

        
        {this.renderTopPratosRestaurantesView()}
        

        <Text style={[styles.titulo, styles.paddingHorizontal]}>Para você</Text>
        
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {this.renderImagens()}
        </View>
    </ScrollView>
    );
  }

}

const styles = {
    container: {
        flexDirection: 'column'
    },
    paddingHorizontal: {
        paddingHorizontal: 15
    },
    item: {
        marginTop: 7
    },
    titulo: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 10,
        marginBottom: 15
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bolinhaVerde: {
        height: 6,
        width: 6,
        borderRadius: 6/2,
        backgroundColor: '#20b351',
        marginRight: 7,
        marginLeft: 3,
    },
    subTitulo: {
        fontSize: 15,
        color: '#000',
    },
    filtro: {
        marginHorizontal: 10,
    },
    filtroSelecionado: {
        borderBottomWidth: 1,
        borderBottomColor: '#20b351'
    },
    textoFiltro: {
        color: '#000',
        fontSize: 16
    }
}