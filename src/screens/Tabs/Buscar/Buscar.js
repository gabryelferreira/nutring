import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import SearchBar from '../../../components/SearchBar/SearchBar';
import SearchButton from '../../../components/SearchBar/SearchBarButton';
import Card from '../../../components/Card/Card';
import FotoGrandeEsquerda from './FotosLayout/FotoGrandeEsquerda';
import FotoGrandeDireita from './FotosLayout/FotoGrandeDireita';
import FotoPequenaEsquerda from './FotosLayout/FotoPequenaEsquerda';
import FotoPequenaDireita from './FotosLayout/FotoPequenaDireita';

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
      loadingPratos: false,
      semMaisPratos: false
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
        if (result.result.length < this.state.limit){
            this.setState({
                semMaisPratos: true
            })
        }
        let pratos = this.state.pratos;
        for (var i = 0; i < result.result.length; i++){
            pratos.push(result.result[i]);
        }
      this.setState({
          pratos,
          loading: false,
          loadingPratos: false
      })
      setTimeout(() => {
          this.carregando = false;
      }, 200);
    }
  }

  getMaisPratos(){
      if (!this.carregando && !this.state.semMaisPratos){
          this.carregando = true;
          this.setState({
              offset: this.state.offset + this.state.limit,
              loadingPratos: true
          }, this.getTopPratosClientes)
      }
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

  irParaPerfil(id_post){
      this.props.navigation.navigate("Postagem", { id_post });
  }

    renderImagens(){
        console.log("renderizando imagens")
        let totalImagensPossiveis = this.state.limit;
        let imagensCount = Math.floor(this.state.pratos.length/totalImagensPossiveis);
        let imagens = [];
        for (var i = 0; i < imagensCount; i++){
            let index = i*totalImagensPossiveis;
            imagens.push((
                <View key={i} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <FotoGrandeEsquerda chave={this.state.pratos[index].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index].id_post)} foto={this.state.pratos[index].foto}/>

                    <View style={{flexDirection: 'column'}}>
                        <FotoPequenaDireita chave={this.state.pratos[index+1].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+1].id_post)} foto={this.state.pratos[index+1].foto}/>
                        <FotoPequenaDireita chave={this.state.pratos[index+2].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+2].id_post)} foto={this.state.pratos[index+2].foto}/>
                    </View>

                    <FotoPequenaEsquerda chave={this.state.pratos[index+3].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+3].id_post)} foto={this.state.pratos[index+3].foto}/>
                    <FotoPequenaDireita chave={this.state.pratos[index+4].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+4].id_post)} foto={this.state.pratos[index+4].foto}/>
                    <FotoPequenaDireita chave={this.state.pratos[index+5].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+5].id_post)} foto={this.state.pratos[index+5].foto}/>

                    <View style={{flexDirection: 'column'}}>
                        <FotoPequenaEsquerda chave={this.state.pratos[index+6].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+6].id_post)} foto={this.state.pratos[index+6].foto}/>
                        <FotoPequenaEsquerda chave={this.state.pratos[index+7].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+7].id_post)} foto={this.state.pratos[index+7].foto}/>
                    </View>



                    <FotoGrandeDireita chave={this.state.pratos[index+8].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+8].id_post)} foto={this.state.pratos[index+8].foto}/>

                    <FotoPequenaEsquerda chave={this.state.pratos[index+9].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+9].id_post)} foto={this.state.pratos[index+9].foto}/>
                    <FotoPequenaDireita chave={this.state.pratos[index+10].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+10].id_post)} foto={this.state.pratos[index+10].foto}/>
                    <FotoPequenaDireita chave={this.state.pratos[index+11].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index+11].id_post)} foto={this.state.pratos[index+11].foto}/>
                </View>
            ));
        }
        if (this.state.pratos.length/totalImagensPossiveis != imagensCount){
            for (var i = Math.floor(this.state.pratos.length/totalImagensPossiveis)*totalImagensPossiveis; i < this.state.pratos.length; i++){
                let index = i;
                if (i % 3 == 0){
                    imagens.push((
                        <View key={this.state.pratos[index].id_post}>
                            <FotoPequenaEsquerda chave={this.state.pratos[index].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index].id_post)} foto={this.state.pratos[index].foto}/>
                        </View>
                    ));
                } else {
                    imagens.push((
                        <View key={this.state.pratos[index].id_post}>
                            <FotoPequenaDireita chave={this.state.pratos[index].id_post} onPress={() => this.irParaPerfil(this.state.pratos[index].id_post)} foto={this.state.pratos[index].foto}/>
                        </View>
                    ));
                }
                
            }
        }
        return imagens;
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
            return <Card key={prato.id_usuario} imagem={prato.foto} nome={prato.nome} seguidores={prato.curtidas} onPress={() => this.props.navigation.navigate("Postagem", { id_post: prato.id_post })}/>
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

    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    returnLoader(){
        if (!this.state.semMaisPratos){
            return (
                <View style={{marginVertical: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>
            );
        }
        return null;
    }

    carregando = false;

    render() {
        if (this.state.loading){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#28b657" />
                </View>

            );
        }
        return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} onScroll={({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent)) {
                this.getMaisPratos();
            }
        }}
        scrollEventThrottle={400}>
            <Text style={[styles.titulo, styles.paddingHorizontal]}>Em alta</Text>
            
            {this.renderTopRestaurantesView()}

            
            {this.renderTopPratosRestaurantesView()}
            

            <Text style={[styles.titulo, styles.paddingHorizontal]}>Para você</Text>
            
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {this.renderImagens()}
            </View>
            {this.returnLoader()}
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