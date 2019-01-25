import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Button, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import SearchBar from '../../components/SearchBar/SearchBar';
import { HeaderBackButton } from 'react-navigation';


import { StackActions, NavigationActions } from 'react-navigation';

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
            overflow: 'hidden',
            justifyContent: 'center'
        }}>
            <SearchBar navigation={navigation} onChangeText={navigation.getParam('procurar')}/>
        </View>
    )
  });

  // Use arrow function to bind it to the MyScreen class.
  // (I'm not sure you have to do it like this, try to use it as a normal function first)
  procurarFunction = (text) => {
  }

  // Add the `searchFunction` as a navigation param:
  componentDidMount() {
    this.props.navigation.setParams({
        procurar: this.procurarFunction.bind(this),
    })
  }

  // Since we pass a class function as a param
  // I believe it would be a good practice to remove it 
  // from the navigation params when the Component unmounts.
  componentWillUnmount() {
    this.props.navigation.setParams({
        procurar: null,
    })
  }

  render() {
    return (
    <View>
        
    </View>
    );
  }

}