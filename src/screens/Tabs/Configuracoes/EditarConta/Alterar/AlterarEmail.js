import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Network from '../../../../../network';
import Opcao from '../../../../../components/Opcao/Opcao';
import Input from '../../../../../components/Input/Input'
import Sugestoes from '../../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../../components/Botoes/BotaoPequeno';

export default class AlterarEmail extends Network {

    static navigationOptions = {
        title: 'Alterar email'
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            emailAtual: "",
            emailNovo: ""
        }
    }

    alterarEmail(){
        console.log("alterando o fdp");
    }


    render(){
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    <View style={styles.container}>
                        <Input label={"Email atual"} icone={"envelope"}
                            onChangeText={(emailAtual) => this.setState({emailAtual})}
                            value={this.state.emailAtual}
                            returnKeyType={'next'}
                            onSubmitEditing={() => this.segundoInput.focus()}
                            blurOnSubmit={false}
                            autoCapitalize={"none"}
                            small={true}
                        />
                        <Input label={"Novo email"} 
                                inputRef={(input) => {this.segundoInput = input}}
                                icone={"envelope"}
                            onChangeText={(emailNovo) => this.setState({emailNovo})}
                            value={this.state.emailNovo}
                            onSubmitEditing={() => this.alterarEmail()}
                            autoCapitalize={"none"}
                            small={true}
                        />
                        <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>Seu email não será mostrado em seu perfil do Nutring.</Text>
                            <Text style={{fontSize: 11, color: '#000'}}>Pode ficar tranquilo ;)</Text>
                        </View>
                        <View style={{marginVertical: 10}}>
                            <BotaoPequeno texto={"Confirmar"} onPress={() => this.alterarEmail()}/>
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