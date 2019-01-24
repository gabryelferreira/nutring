import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, Picker } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../components/ImagemNutring/ImagemNutring';
import Loader from '../../components/Loader/Loader';
import Modalzin from '../../components/Modal/Modal';
import Network from '../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Input from '../../components/Input/Input';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Cadastro extends Network {


    state = {
        loading: false,
        modal: {
            visible: false,
            title: "",
            subTitle: ""
        },
        nome: "",
        email: "",
        senha: "",
        dt_nasc: "",
        backup_dt_nasc: "",
        sexo: "M",
        campoErro: ""
    }

    static navigationOptions = {
        header: (
            <View></View>
        )
    };

    async salvarDadosUsuario(usuario){
        try {
            await AsyncStorage.setItem("userData", JSON.stringify(usuario));
        } catch(error){
            console.error(error);
        }
    }

    setModalState(visible){
        this.setState({
            modal: {
                visible: visible
            }
        })
    }

    getModalClick(key){
        this.setModalState(false);
    }

    renderTextoBotao(){
        if (!this.state.loading){
            return <Text style={styles.textoBotao}>Entrar</Text>
        } else {
            return <ActivityIndicator animating color="#fff"/>
        }
    }

    mudarOpcao(){
        this.setState({
            modal: {
                title: "Opção não disponível  :(",
                subTitle: "Essa opção está em desenvolvimento pela nossa super-equipe! Aguarde.",
                visible: true
            }
        })
    }

    async verifyDtNasc(){
        if (this.state.dt_nasc.length > this.state.backup_dt_nasc.length){
            var replace = true;
            while (replace == true){
                if (this.state.dt_nasc.indexOf('/') != -1){
                    let dt_nasc = this.state.dt_nasc.replace('/', '')
                    await this.setState({dt_nasc: dt_nasc, backup_dt_nasc: dt_nasc});
                } else {
                    replace = false;
                    this.transformDtNasc();
                }
            }
        } else {
            await this.setState({backup_dt_nasc: this.state.dt_nasc})
        }
      }

    async transformDtNasc(){
        if (this.state.dt_nasc.length <= 2)
            await this.setState({ dt_nasc: this.state.dt_nasc.replace(/(\d{2})/g,"\$1/") })
        else if (this.state.dt_nasc.length <= 3)
            await this.setState({ dt_nasc: this.state.dt_nasc.replace(/(\d{2})(\d{1})/g,"\$1/\$2") })
        else if (this.state.dt_nasc.length <= 4)
            await this.setState({ dt_nasc: this.state.dt_nasc.replace(/(\d{2})(\d{2})/g,"\$1/\$2/") })
        else if (this.state.dt_nasc.length <= 5)
            await this.setState({ dt_nasc: this.state.dt_nasc.replace(/(\d{2})(\d{2})(\d{1})/g,"\$1/\$2/\$3") })
        else if (this.state.dt_nasc.length <= 6)
            await this.setState({ dt_nasc: this.state.dt_nasc.replace(/(\d{2})(\d{2})(\d{2})/g,"\$1/\$2/\$3") })
        else if (this.state.dt_nasc.length <= 7)
            await this.setState({ dt_nasc: this.state.dt_nasc.replace(/(\d{2})(\d{2})(\d{3})/g,"\$1/\$2/\$3") })
        else if (this.state.dt_nasc.length <= 8)
            await this.setState({ dt_nasc: this.state.dt_nasc.replace(/(\d{2})(\d{2})(\d{4})/g,"\$1/\$2/\$3") })
        this.setState({backup_dt_nasc: this.state.dt_nasc})
    }

    returnDataFormatada(data){
        let _data = data.substring(6, 10) + "-" + data.substring(3, 5) + "-" + data.substring(0, 2);
        return _data;
    }

    validateDtNasc(){
        var date = null;
        var fullDate = this.state.dt_nasc;
        var length = fullDate.length;
        var count = 0;
        for (var i = 0; i < fullDate.length; i++){
            if (fullDate[i] == "/")
                count++;
        }
        if (count == 2 && length == 10){
            var replace = true;
            while (replace == true){
                if (fullDate.indexOf("/") != -1){
                    fullDate = fullDate.replace("/", "");
                } else {
                    replace = false;
                }
            }
            var day = fullDate.substring(0, 2);
            var month = fullDate.substring(2, 4);
            var year = fullDate.substring(4, 8);
            date = new Date(year + "-" + month  + "-" + (parseInt(day) + 1).toString());
        }
        this.setState({dt_nasc_formatada: date})
        return date != null && date != undefined && date != "Invalid Date"
    }

    async validarDados(){
        let valido = true;
        let campos = ["nome", "email", "senha"];
        console.log("a caalhoo", this.validateDtNasc())
        if (!this.validateDtNasc()){
            await this.setState({
                campoErro: "A data de nascimento está incorreta."
            })
            return false;
            
        }
        for (var i = 0; i < campos.length; i++){
            if (this.state[campos[i]].length <= 0){
                await this.setState({
                    campoErro: "O campo " + campos[i] + " é obrigatório."
                });
                return false;
            }
        }
        return valido;
    }

    async cadastrar(){
        if (await this.validarDados() == true && !this.state.loading){
            await this.setState({loading: true});
            let user = { nome: this.state.nome, email: this.state.email, senha: this.state.senha, sexo: this.state.sexo, dt_nasc: this.returnDataFormatada(this.state.dt_nasc) };
            user = JSON.stringify(user);
            let result = await this.callMethod("registerV2", { user })
            if (result.success){
                if (result.result == "EMAIL_EXISTS"){
                    this.showModal("E-mail já cadastrado", "Esse e-mail já está cadastro em nosso sistema.");
                } else {
                    await this.salvarDadosUsuario(result.result);
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
                    });
                    
                    this.props.navigation.dispatch(resetAction);
                }
            } else {
                this.showModal("Ocorreu um erro!", "Verifique sua internet e tente novamente em alguns instantes.");
            }
            await this.setState({loading: false});
        } else {
            this.showModal("Erros a vista", this.state.campoErro)
        }
    }

    showModal(titulo, subTitulo){
        this.setState({
            modal: {
                title: titulo,
                subTitle: subTitulo,
                visible: true
            }
        })
    }

    setModalState(visible){
        this.setState({
            modal: {
                visible: visible
            }
        })
    }

    getModalClick(key){
        this.setModalState(false);
    }

    render(){
        return (      
            <View style={{flex: 1}}>
                <Modalzin 
                    titulo={this.state.modal.title} 
                    subTitulo={this.state.modal.subTitle} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.setState({modal: {visible: false}})}
                    botoes={this.state.modal.botoes}
                />
                <ScrollView>


                    <View style={styles.viewCadastro}>
                        <View style={{alignItems: 'center'}}>
                            <AutoHeightImage source={require('../../assets/imgs/nutring-color.png')} width={260}/>
                            <Text style={{marginTop: 10}}>Você mais saudável</Text>
                        </View>
                        <View style={styles.botoesOpcao}>
                            <TouchableOpacity style={[styles.botaoOpcao, styles.botaoVerde]}>
                                <Text style={[styles.textoBranco, styles.textoBotaoOpcao]}>Pessoa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.mudarOpcao()} style={styles.botaoOpcao}>
                                <Text style={[styles.textoVerde, styles.textoBotaoOpcao]}>Restaurante</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container}>
                            <TextInput 
                            placeholder="Nome" 
                            placeholderTextColor="rgb(153, 153, 153)" 
                            style={styles.input}
                            onChangeText={(nome) => this.setState({nome})}
                            value={this.state.nome}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.segundoInput.focus()}
                            blurOnSubmit={false}
                            autoCapitalize = 'words'
                            maxLength={100}
                            />
                            <TextInput 
                            ref={(input) => this.segundoInput = input}
                            placeholder="Data de nascimento" 
                            placeholderTextColor="rgb(153, 153, 153)" 
                            style={styles.input}
                            value={this.state.dt_nasc}
                            onChangeText={(dt_nasc) => this.setState({dt_nasc}, this.verifyDtNasc)}
                            // onSubmitEditing={() => this.terceiroInput.focus()}
                            // blurOnSubmit={false}
                            autoCapitalize = 'none'
                            keyboardType='number-pad'
                            maxLength={10}
                            />

                            <View style={styles.picker}>
                                {/* <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, pointerEvents: 'none', background: '#fff', borderRadius: 30 }}>
                                    <Text style={{ fontSize: 15, marginLeft: 15, color: "rgb(153, 153, 153)" }}>Gênero</Text>
                                </View> */}
                                <Picker
                                    selectedValue={this.state.sexo}
                                    onValueChange={(sexo, _) => this.setState({ sexo }, function(){
                                        console.log("mudei o state do sexo e agr ta", this.state.sexo)
                                    })}
                                    >
                                    <Picker.Item label="Masculino" value="M" />
                                    <Picker.Item label="Feminino" value="F" />
                                </Picker>
                            </View>
                            
                            <TextInput 
                            ref={(input) => this.quartoInput = input}
                            placeholder="E-mail" 
                            placeholderTextColor="rgb(153, 153, 153)" 
                            style={styles.input}
                            value={this.state.email}
                            onChangeText={(email) => this.setState({email})}
                            onSubmitEditing={() => this.quintoInput.focus()}
                            blurOnSubmit={false}
                            autoCapitalize = 'none'
                            returnKeyType={"next"}
                            maxLength={100}
                            />
                            <TextInput 
                            ref={(input) => this.quintoInput = input}
                            placeholder="Senha" 
                            placeholderTextColor="rgb(153, 153, 153)" 
                            style={styles.input}
                            value={this.state.senha}
                            onChangeText={(senha) => this.setState({senha})}
                            onSubmitEditing={() => this.cadastrar()}
                            secureTextEntry={true}
                            autoCapitalize = 'none'
                            maxLength={100}
                            />
                            <TouchableOpacity onPress={() => this.cadastrar()} style={styles.botao}>
                                {this.renderTextoBotao()}
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
                {/* <View style={{position: 'absolute', left: 0, bottom: 0, flex: 1, zIndex: -1}}>
                    <AutoHeightImage source={require('../../assets/imgs/fundo.png')} width={imageWidth}/>
                </View> */}
            </View>
        );
    }
}

const styles = {
    container: {
        flexDirection: 'column',
        paddingHorizontal: 30,
        paddingVertical: 30,
    },
    backgroundImage: {
        height: imageHeight,
        width: imageWidth,
        position: 'absolute'
    },
    viewLogo: {
        flex: .5,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    viewCadastro: {
        flex: .8,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 40
    },
    botoesOpcao: {
        width: 260,
        marginTop: 50,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        alignSelf: 'center'
    },
    botaoOpcao: {
        flex: .5,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    botaoVerde: {
        backgroundColor: '#27ae60'
    },
    textoBranco: {
        color: '#fff'
    },
    textoVerde: {
        color: 'rgba(39,174,96, .4)'
    },
    textoBotaoOpcao: {
        fontWeight: 'bold'
    },
    picker: {
        alignSelf: 'stretch',
        borderRadius: 30,
        paddingLeft: 15,
        paddingRight: 5,
        color: '#000',
        paddingVertical: 5,
        fontSize: 15,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 7,
        marginBottom: 7
    },
    input: {
        alignSelf: 'stretch',
        borderRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 15,
        color: '#000',
        fontSize: 15,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 7,
        marginBottom: 7
    },
    botao: {
        borderRadius: 30,
        alignSelf: 'stretch',
        color: '#fff',
        backgroundColor: '#27ae60',
        height: 60,
        marginTop: 7,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textoProblema: {
        color: '#aaa',
    },
    textoProblemaLink: {
        color: '#222',
        fontWeight: 'bold',
    }
}