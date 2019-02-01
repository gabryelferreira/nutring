import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, ScrollView, Dimensions } from 'react-native';
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

    static navigationOptions = ({navigation}) => ({
        title: 'Notificações',
    });

    state = {
      loading: false,
      dados: [],
    }

    constructor(props){
      super(props);
    }

  render() {
    // if (!this.state.loading && this.state.dados.length == 0){
    //   return <SemDados icone={"sad-tear"} titulo={"Sem notificações"} texto={"Você ainda não recebeu notificações."}/>
    // }
    return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
      <Item promo={true} 
            quantidade={23} 
            tipo={"PROMOCAO"} 
            titulo={"Promoções"}
            texto={"Promoções de restaurantes que você segue."} 
            foto={'https://logodownload.org/wp-content/uploads/2016/09/Outback-logo-10.png'}
            />
      <Item icone={"comment"}
            tipo={"SEGUIU"} 
            titulo={"Gabryel Ferreira"} 
            foto={'https://img.stpu.com.br/?img=https://s3.amazonaws.com/pu-mgr/default/a0RG000000o0ohkMAA/594989e9e4b0eb7905e31616.jpg&w=620&h=400'}
            />
    </ScrollView>
    );
  }

}

const styles = {
}