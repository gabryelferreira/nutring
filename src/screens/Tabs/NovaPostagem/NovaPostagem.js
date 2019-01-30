import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import SearchBar from '../../../components/SearchBar/SearchBar';
import SearchButton from '../../../components/SearchBar/SearchBarButton';
import Card from '../../../components/Card/Card';
import SemDadosPerfil from '../../../components/SemDadosPerfil/SemDadosPerfil';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Notificacoes extends Network {

    static navigationOptions = ({navigation}) => ({
        title: 'Notificações',
    });

  render() {
    return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
        <SemDadosPerfil icone={"sad-tear"} titulo={"Sem notificações"} texto={"Você ainda não recebeu notificações."}/>
      </View>
    </ScrollView>
    );
  }

}

const styles = {
}