import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../components/ImagemNutring/ImagemNutring';

export default class Cadastro extends Component {

    static navigationOptions = {
        headerTitle: (
            <ImagemNutring/>
        )
    };

    constructor(props){
        super(props);
    }

    render(){
        return(
            <ScrollView>

                    <AutoHeightImage style={{marginLeft: 40}} source={require('../../assets/imgs/nutring-color.png')} width={260}/>
                    <Text style={{marginTop: 10}}>Você mais saudável</Text>

            </ScrollView>
        );
    }

}

const styles = {

}