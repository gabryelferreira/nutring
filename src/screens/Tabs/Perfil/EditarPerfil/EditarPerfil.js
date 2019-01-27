import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';
import Input from '../../../../components/Input/Input'
import Sugestoes from '../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';


export default class EditarPerfil extends Network {

    static navigationOptions = {
        title: 'Editar perfil'
    };

    segundoInput;

    constructor(props){
        super(props);
        this.state = {
            descricao: "",
            carregandoDados: true,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: ""
            },
            loading: false
        }
    }

    componentDidMount(){
        this.getPerfilAlteracao();
    }

    async getPerfilAlteracao(){
        let result = await this.callMethod("getPerfilAlteracao");
        if (result.success){
            this.setState({
                descricao: result.result.descricao
            })
        } else {
            this.showModal("Ocorreu um erro", "Não conseguimos pegar seus dados. Verifique sua internet.");
        }
        this.setState({
            carregandoDados: false
        })
    }

    getModalClick(){
        this.setState({
            modal: {
                visible: false
            }
        })
    }

    async editarPerfil(){
        this.setState({
            loading: true
        })
        let result = await this.callMethod("editarPerfil", { descricao: this.state.descricao });
        if (result.success){
            this.props.navigation.state.params.onGoBack();
            this.props.navigation.goBack();
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
    }

    showModal(titulo, subTitulo){
        this.setState({
            modal: {
                visible: true,
                titulo: titulo,
                subTitulo: subTitulo
            }
        })
    }

    render(){
        if (this.state.carregandoDados)
            return (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color="#27ae60" size="large"/>
                </View>
            );
        return (
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={() => this.getModalClick()}
                    onClose={() => this.getModalClick()}
                />
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.container}>
                        <Input label={"Descrição"}
                                icone={"comment"}
                            onChangeText={(descricao) => this.setState({descricao})}
                            value={this.state.descricao}
                            onSubmitEditing={() => this.editarPerfil()}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={255}
                            returnKeyType={"none"}
                        />
                        <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>A descrição ficará visível para quem acessar seu perfil.</Text>
                            {/* <Text style={{fontSize: 11, color: '#000'}}>Pode ficar tranquilo ;)</Text> */}
                        </View>
                        <View style={{marginVertical: 10}}>
                            <BotaoPequeno texto={"Confirmar"} onPress={() => this.editarPerfil()} loading={this.state.loading}/>
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