import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';

export default class Ajuda extends Network {

    static navigationOptions = {
        title: 'Ajuda'
    };

    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    <Opcao icone={"question-circle"} texto={"Como usar o Nutring"}/>
                    <Opcao icone={"question-circle"} texto={"Reporte um problema"}/>
                </ScrollView>
            </View>
        );
    }

}