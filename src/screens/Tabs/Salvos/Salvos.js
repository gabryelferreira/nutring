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

export default class Salvos extends Network {

    static navigationOptions = ({navigation}) => ({
        title: 'Favoritos',
    });

  render() {
    return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>

    </ScrollView>
    );
  }

}

const styles = {
}