import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import Network from '../../../../network';
import Opcao from '../../../../components/Opcao/Opcao';
import Input from '../../../../components/Input/Input'
import Sugestoes from '../../../../components/Sugestoes/Sugestoes';
import BotaoPequeno from '../../../../components/Botoes/BotaoPequeno';
import Modalzin from '../../../../components/Modal/Modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Label from '../../../../components/Label/Label';
import DateTimePicker from 'react-native-modal-datetime-picker';


export default class EditarPerfil extends Network {

    static navigationOptions = {
        title: 'Editar perfil'
    };

    segundoInput;

    mostrouModalFuncionamento = false;
    diaSelecionado = {};


    stepHorario = "NENHUM";

    constructor(props){
        super(props);
        this.state = {
            descricao: "",
            carregandoDados: false,
            isDateTimePickerVisible: false,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            user: {},
            loading: false,
            cor_fundo: "",
            cor_texto: "",
            nome: "",
            sobre: "",
            horarios_funcionamento: []
        }
    }

    componentDidMount(){
        this.setState({
            user: this.props.navigation.getParam("user", {})
        }, this.setDados)
    }

    setDados(){
        this.setState({
            nome: this.state.user.nome,
            descricao: this.state.user.descricao,
            cor_fundo: this.state.user.cor_fundo,
            cor_texto: this.state.user.cor_texto,
            sobre: this.state.user.sobre,
            horarios_funcionamento: this.state.user.horarios_funcionamento
        })
    }

    getModalClick(chave = ""){
        this.setState({
            modal: {
                visible: false
            }
        })
        if (chave == "VAMOS") this._showDateTimePicker();
    }

    async editarPerfilCliente(){
        let result = await this.callMethod("editarPerfil", { nome: this.state.nome, descricao: this.state.descricao, tipo_edicao: 'CLIENTE' });
        if (result.success){
            if (result.result == "PERFIL_ALTERADO"){
                this.props.navigation.state.params.onGoBack();
                this.props.navigation.goBack();
            } else {
                this.showModal("Ocorreu um erro", result.result);
            }
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
    }

    async editarPerfilRestaurante(){
        let result = await this.callMethod("editarPerfil", {
                                                nome: this.state.nome,
                                                descricao: this.state.descricao,
                                                cor_fundo: this.state.cor_fundo,
                                                cor_texto: this.state.cor_texto,
                                                sobre: this.state.sobre,
                                                tipo_edicao: 'RESTAURANTE',
                                                horarios_funcionamento: JSON.stringify(this.state.horarios_funcionamento)
                                            });
        if (result.success){
            if (result.result == "PERFIL_ALTERADO"){
                this.props.navigation.state.params.onGoBack();
                this.props.navigation.goBack();
            } else {
                this.showModal("Ocorreu um erro", result.result);
            }
        } else {
            this.showModal("Ocorreu um erro", "Verifique sua internet e tente novamente.");
        }
        this.setState({
            loading: false
        })
    }

    async editarPerfil(){
        this.setState({
            loading: true
        })
        if (this.state.user.is_restaurante){
            this.editarPerfilRestaurante();
        } else {
            this.editarPerfilCliente();
        }
        
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

    renderCoresRestaurante(){
        if (this.state.user.is_restaurante){
            return (
                <View>
                    <Input label={"Cor de fundo (hexadecimal)"}
                        icone={"palette"}
                        onChangeText={(cor_fundo) => this.setState({cor_fundo})}
                        value={this.state.cor_fundo}
                        onSubmitEditing={() => this.terceiroInput.focus()}
                        autoCapitalize={"none"}
                        small={true}
                        blurOnSubmit={false}
                        maxLength={6}
                        returnKeyType={"next"}
                        hashtag={true}
                    />
                    <Input label={"Cor do texto (hexadecimal)"}
                        icone={"palette"}
                        inputRef={(input) => this.terceiroInput = input}
                        onChangeText={(cor_texto) => this.setState({cor_texto})}
                        value={this.state.cor_texto}
                        onSubmitEditing={() => this.quartoInput.focus()}
                        autoCapitalize={"none"}
                        small={true}
                        maxLength={6}
                        returnKeyType={"next"}
                        hashtag={true}
                    />
                </View>
            );
        }
        return null;
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        let d = new Date(date);
        let hora = d.getHours().toString();
        hora = hora.length == 1 ? `0${hora}` : hora;
        let minuto = d.getMinutes().toString();
        minuto = minuto.length == 1 ? `0${minuto}` : minuto;
        
        let horarios_funcionamento = this.state.horarios_funcionamento;
        for (let i in horarios_funcionamento){
            if (horarios_funcionamento[i].cd_dia_semana == this.diaSelecionado.cd_dia_semana){
                if (this.stepHorario == "ABERTURA")
                    horarios_funcionamento[i].horario_abertura = `${hora}:${minuto}`;
                else
                    horarios_funcionamento[i].horario_fechamento = `${hora}:${minuto}`;
            }
        }
        this.setState({
            horarios_funcionamento
        })
        this._hideDateTimePicker();
        this.handleStepHorario();
    };

    handleStepHorario = () => {
        if (this.stepHorario == "ABERTURA"){
            this.stepHorario = "FECHAMENTO";
            let dia = this.diaSelecionado;
            let d = new Date();
            let hora = '00';
            let minuto = '00';
            let arrayHorario = dia.horario_fechamento.split(':');
            console.log("array Horario = ", arrayHorario);
            if (arrayHorario.length == 2 && dia.horario_fechamento.length == 5){
                hora = arrayHorario[0];
                minuto = arrayHorario[1];
            }
            dia.newDate = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate(), hora, minuto);
            console.log("new date = ", dia.newDate);
            this.diaSelecionado = dia;
            this._showDateTimePicker();
        }
    }

    renderHorariosFuncionamento(){
        return this.state.horarios_funcionamento.map(dia => {
            return (
                <TouchableOpacity onPress={() => this.mostrarModalFuncionamento(dia)} style={styles.viewHorario}>
                    <Text style={[styles.textoHorario, styles.bold]}>{dia.ds_dia_semana}</Text>
                    <Text style={styles.horario}>{dia.horario_abertura} - {dia.horario_fechamento}</Text>
                </TouchableOpacity>
            );
        })
    }

    mostrarModalFuncionamento(dia){
        let d = new Date();
        let hora = '00';
        let minuto = '00';
        let arrayHorario = dia.horario_abertura.split(':');
        console.log("array Horario = ", arrayHorario);
        if (arrayHorario.length == 2 && dia.horario_abertura.length == 5){
            hora = arrayHorario[0];
            minuto = arrayHorario[1];
        }
        dia.newDate = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate(), hora, minuto);
        console.log("new date = ", dia.newDate);
        this.diaSelecionado = dia;
        this.stepHorario = "ABERTURA";
        if (!this.mostrouModalFuncionamento){
            this.mostrouModalFuncionamento = true;
            this.setState({
                modal: {
                    visible: true,
                    titulo: "Vamos lá!",
                    subTitulo: "Primeiro você irá definir o horário de abertura e, após clicar em OK, definirá o horário de fechamento.",
                    botoes: [
                        {chave: "VAMOS", texto: "Entendi", color: '#28b657', fontWeight: 'bold'}
                    ]
                }
            })
        } else {
            this._showDateTimePicker();
        }
    }

    renderInformacoesRestaurante(){
        if (this.state.user.is_restaurante){
            return (
                <View>
                    <View style={[styles.wrapper, styles.borderTop, {paddingTop: 10}]}>
                        <View style={styles.infoRestaurante}>
                            <Icon name="info-circle" size={16} solid color="#000"/>
                            <Text style={styles.tituloInfoRestaurante}>Informações</Text>
                        </View>
                        <Input label={"Sobre"}
                                icone={"info-circle"}
                                inputRef={(input) => this.quartoInput = input}
                                onChangeText={(sobre) => this.setState({sobre})}
                                value={this.state.sobre}
                                autoCapitalize={"sentences"}
                                small={true}
                                multiline={true}
                                numberOfLines={5}
                                maxLength={255}
                                returnKeyType={'none'}
                        />
                    
                    </View>
                        <View style={{paddingHorizontal: 15, paddingVertical: 5}}>
                            <Label label={"Horários de Funcionamento"} icone={"clock"}/>
                        </View>
                        <ScrollView horizontal={true} contentContainerStyle={{marginBottom: 20}} showsHorizontalScrollIndicator={false}>
                            {this.renderHorariosFuncionamento()}
                        </ScrollView>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            date={this.diaSelecionado.newDate}
                            mode={'time'}
                        />
                </View>

            );
        }
        return null;
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
                    botoes={this.state.modal.botoes}
                    visible={this.state.modal.visible} 
                    onClick={(chave) => this.getModalClick(chave)}
                    onClose={() => this.getModalClick()}
                />
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <View style={styles.container}>
                        <Input label={"Nome *"}
                            icone={"user"}
                            onChangeText={(nome) => this.setState({nome})}
                            value={this.state.nome}
                            autoCapitalize={"words"}
                            onSubmitEditing={() => this.segundoInput.focus()}
                            small={true}
                            blurOnSubmit={false}
                            maxLength={60}
                            returnKeyType={'next'}
                        />
                        <Input label={"Descrição"}
                            icone={"comment"}
                            inputRef={(input) => this.segundoInput = input}
                            onChangeText={(descricao) => this.setState({descricao})}
                            value={this.state.descricao}
                            autoCapitalize={"sentences"}
                            small={true}
                            multiline={true}
                            numberOfLines={5}
                            maxLength={255}
                            returnKeyType={'none'}
                        />
                        {this.renderCoresRestaurante()}
                        <View style={{marginVertical: 5, flex: .7}}>
                            <Text style={{fontSize: 11, color: '#000'}}>A descrição ficará visível para quem acessar seu perfil.</Text>
                            {/* <Text style={{fontSize: 11, color: '#000'}}>Pode ficar tranquilo ;)</Text> */}
                        </View>
                        
                    </View>
                    {this.renderInformacoesRestaurante()}
                    <View style={styles.container}>
                        <View style={{marginBottom: 10, flexDirection: 'column', alignItems: 'flex-start'}}>
                            <BotaoPequeno texto={"Confirmar"} textoLoading={"Confirmando"} onPress={() => this.editarPerfil()} loading={this.state.loading}/>
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
    },
    wrapper: {
        paddingHorizontal: 15
    },

    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    },

    infoRestaurante: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    tituloInfoRestaurante: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
    viewHorario: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderWidth: 0.7,
        borderColor: '#ddd'
    },
    textoHorario: {
        fontSize: 14,
        color: '#222'
    },
    bold: {
        fontWeight: 'bold'
    },
    horario: {
        color: '#000'
    }


}