import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';

export default class EditarConta extends Network {

    static navigationOptions = {
        title: 'Editar Conta'
    };

    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    <Opcao icone={"user-circle"} texto={"Alterar usuário"} onPress={() => this.props.navigation.navigate("AlterarUsuario")}/>
                    <Opcao icone={"envelope"} texto={"Alterar email"} onPress={() => this.props.navigation.navigate("AlterarEmail")}/>
                    <Opcao icone={"lock"} texto={"Alterar senha"} onPress={() => this.props.navigation.navigate("AlterarSenha")}/>
                </ScrollView>
            </View>
        );
    }

}