import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, ScrollView, Dimensions } from 'react-native';
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

  componentDidMount() {
    this.props.navigation.setParams({
        abrirModal: this.abrirModal.bind(this)
    })
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

  render() {
    return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
        <Text style={[styles.titulo, styles.paddingHorizontal]}>Em alta</Text>
        <View style={[styles.item, styles.paddingHorizontal]}>
            <View style={styles.flexRow}>
                <View style={styles.bolinhaVerde}></View><Text style={styles.subTitulo}>Restaurantes</Text>
            </View>
        </View>
        <ScrollView horizontal={true} style={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
            <Card imagem={'https://pbs.twimg.com/media/CIreT36WwAA2ofe.jpg'}/>
            <Card imagem={'https://pbs.twimg.com/media/CIreT36WwAA2ofe.jpg'}/>
            <Card imagem={'https://pbs.twimg.com/media/CIreT36WwAA2ofe.jpg'}/>
            <Card imagem={'https://pbs.twimg.com/media/CIreT36WwAA2ofe.jpg'}/>
            <Card imagem={'https://pbs.twimg.com/media/CIreT36WwAA2ofe.jpg'}/>
        </ScrollView>

        <View style={[styles.item, styles.paddingHorizontal]}>
            <View style={styles.flexRow}>
                <View style={styles.bolinhaVerde}></View><Text style={styles.subTitulo}>Pratos</Text>
            </View>
        </View>
        <ScrollView horizontal={true} style={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
            <Card imagem={"https://www.jasminealimentos.com/wp-content/uploads/2016/02/iStock-511814034.jpg"}/>
            <Card imagem={"https://www.jasminealimentos.com/wp-content/uploads/2016/02/iStock-511814034.jpg"}/>
            <Card imagem={"https://www.jasminealimentos.com/wp-content/uploads/2016/02/iStock-511814034.jpg"}/>
            <Card imagem={"https://www.jasminealimentos.com/wp-content/uploads/2016/02/iStock-511814034.jpg"}/>
            <Card imagem={"https://www.jasminealimentos.com/wp-content/uploads/2016/02/iStock-511814034.jpg"}/>
        </ScrollView>
        

        <Text style={[styles.titulo, styles.paddingHorizontal]}>Para você</Text>
        
        <ScrollView horizontal={true} style={{paddingHorizontal: 15, paddingTop: 5, paddingBottom: 10}} showsHorizontalScrollIndicator={false}>
            <View style={[styles.filtro, styles.filtroSelecionado]}>
                <Text style={styles.textoFiltro}>Vegetais</Text>
            </View>
            <View style={[styles.filtro]}>
                <Text style={styles.textoFiltro}>Frutas</Text>
            </View>
            <View style={[styles.filtro]}>
                <Text style={styles.textoFiltro}>Grãos</Text>
            </View>
            <View style={[styles.filtro]}>
                <Text style={styles.textoFiltro}>Proteínas</Text>
            </View>
            <View style={[styles.filtro]}>
                <Text style={styles.textoFiltro}>Low-fat</Text>
            </View>
        </ScrollView>
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
        marginTop: 10
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