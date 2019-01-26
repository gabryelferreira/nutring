import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Network from '../../../../../network';
import Opcao from '../../../../../components/Opcao/Opcao';
import Input from '../../../../../components/Input/Input'
import Sugestoes from '../../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';

export default class AlterarUsuario extends Network {

    static navigationOptions = {
        title: 'Alterar usuário'
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            usuarioAtual: "",
            usuarioNovo: ""
        }
    }

    alterarUsuario(){
        console.log("alterando o fdp");
    }


    render(){
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    <View style={styles.container}>
                        <Input label={"Usuário atual"} icone={"user-circle"}
                            onChangeText={(usuarioAtual) => this.setState({usuarioAtual})}
                            value={this.state.usuarioAtual}
                            returnKeyType={'next'}
                            onSubmitEditing={() => this.segundoInput.focus()}
                            blurOnSubmit={false}
                            autoCapitalize={"none"}
                            small={true}
                        />
                        <Input label={"Novo usuário"} 
                                inputRef={(input) => {this.segundoInput = input}}
                                icone={"user-circle"}
                            onChangeText={(usuarioNovo) => this.setState({usuarioNovo})}
                            value={this.state.usuarioNovo}
                            onSubmitEditing={() => this.alterarUsuario()}
                            autoCapitalize={"none"}
                            small={true}
                        />
                        <View style={{marginVertical: 5}}>
                            <Sugestoes/>
                        </View>
                        <View style={{marginVertical: 10}}>
                            <BotaoPequeno texto={"Confirmar"} onPress={() => this.alterarUsuario()}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}

const styles = {
    container: {
        paddingVertical: 10,
        paddingHorizontal: 15
    }
}