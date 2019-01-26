import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';

export default class Privacidade extends Network {

    static navigationOptions = {
        title: 'Editar Conta'
    };

    constructor(props){
        super(props);
        this.state = {
            bloquearComentarios: false,
            fotosMarcadas: false
        }
    }

    setBloquearComentarios(){
        console.log("settando aqui")
        this.setState({
            bloquearComentarios: !this.state.bloquearComentarios
        })
    }

    setFotosMarcadas(){
        this.setState({
            fotosMarcadas: !this.state.fotosMarcadas
        })
    }

    render(){
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    <Opcao icone={"user-circle"} texto={"Contas bloqueadas"}/>
                    <Opcao icone={"user-circle"} texto={"Fotos marcadas"} toggle={true} toggleChange={() => this.setFotosMarcadas()} toggleValue={this.state.fotosMarcadas}/>
                    <Opcao icone={"user-circle"} texto={"Bloquear comentários"} toggle={true} toggleChange={() => this.setBloquearComentarios()} toggleValue={this.state.bloquearComentarios}/>
                </ScrollView>
            </View>
        );
    }

}