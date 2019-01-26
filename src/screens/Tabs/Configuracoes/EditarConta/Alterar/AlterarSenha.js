import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Network from '../../../../../network';
import Opcao from '../../../../../components/Opcao/Opcao';
import Input from '../../../../../components/Input/Input'
import Sugestoes from '../../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';

export default class AlterarSenha extends Network {

    static navigationOptions = {
        title: 'Alterar senha'
    };

    segundoInput;
    terceiroInput;

    constructor(props){
        super(props);
        this.state = {
            senhaAtual: "",
            novaSenha: "",
            repetirSenha: ""
        }
    }

    alterarSenha(){
        console.log("alterando o fdp");
    }


    render(){
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    <View style={styles.container}>
                        <Input label={"Senha atual"} icone={"lock"}
                            onChangeText={(senhaAtual) => this.setState({senhaAtual})}
                            value={this.state.senhaAtual}
                            returnKeyType={'next'}
                            onSubmitEditing={() => this.segundoInput.focus()}
                            blurOnSubmit={false}
                            autoCapitalize={"none"}
                            secureTextEntry={true}
                            small={true}
                        />
                        <Input label={"Nova senha"} 
                                inputRef={(input) => {this.segundoInput = input}}
                                icone={"lock"}
                            onChangeText={(novaSenha) => this.setState({novaSenha})}
                            value={this.state.novaSenha}
                            onSubmitEditing={() => this.terceiroInput.focus()}
                            autoCapitalize={"none"}
                            blurOnSubmit={false}
                            secureTextEntry={true}
                            small={true}
                        />
                        <Input label={"Confirme a nova senha"} 
                                inputRef={(input) => {this.terceiroInput = input}}
                                icone={"lock"}
                            onChangeText={(repetirSenha) => this.setState({repetirSenha})}
                            value={this.state.repetirSenha}
                            onSubmitEditing={() => this.alterarSenha()}
                            autoCapitalize={"none"}
                            secureTextEntry={true}
                            small={true}
                        />
                        <View style={{marginVertical: 10}}>
                            <BotaoPequeno texto={"Alterar senha"} onPress={() => this.alterarSenha()}/>
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