import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import SearchBar from '../../../components/SearchBar/SearchBar';
import SearchButton from '../../../components/SearchBar/SearchBarButton';
import Card from '../../../components/Card/Card';
import SemDadosPerfil from '../../../components/SemDadosPerfil/SemDadosPerfil';
import SemDados from '../../../components/SemDados/SemDados';
import Notificacao from '../../../components/Notificacao/Notificacao';


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
      <Notificacao promo={true} quantidade={23}/>
      <Notificacao icone={"comment"} tipo={"FOLLOW"} titulo={"Gabryel Ferreira"} foto={'https://img.stpu.com.br/?img=https://s3.amazonaws.com/pu-mgr/default/a0RG000000o0ohkMAA/594989e9e4b0eb7905e31616.jpg&w=620&h=400'}/>
    </ScrollView>
    );
  }

}

const styles = {
}