import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, Picker } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../components/ImagemNutring/ImagemNutring';
import Loader from '../../components/Loader/Loader';
import Modalzin from '../../components/Modal/Modal';
import Network from '../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Input from '../../components/Input/Input';
import Label from '../../components/Label/Label';
import { validarCNPJ } from '../../validacoes';
import { removerCaracteresEspeciais, removerCaracter, formatarCNPJ, formatarData, formatarCep } from '../../help-functions';

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
        opcao: "PESSOA",
        nome: "",
        email: "",
        usuario: "",
        senha: "",
        dt_nasc: "",
        backup_dt_nasc: "",
        backup_cnpj: "",
        backup_cep: "",
        sexo: "M",
        campoErro: "",
        ddi: "",
        ddd: "",
        telefone: "",
        cnpj: "",
        cep: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        numero: "",
        complemento: ""
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

    renderBotaoLogin(){
        if (!this.state.loading){
            return (
                <TouchableOpacity onPress={() => this.cadastrar()} style={styles.botao}>
                    <Text style={styles.textoBotao}>Entrar</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity style={styles.botao}>
                    <ActivityIndicator animating color="#fff"/>
                </TouchableOpacity>
            );
        }        
    }

    mudarOpcao(opcao){
        this.setState({
            opcao: opcao
        })
    }

    async verifyDtNasc(){
        if (this.state.dt_nasc.length > this.state.backup_dt_nasc.length){
            let dt_nasc = formatarData(this.state.dt_nasc);
            await this.setState({
                dt_nasc: dt_nasc,
                backup_dt_nasc: dt_nasc
            })
        } else {
            await this.setState({backup_dt_nasc: this.state.dt_nasc})
        }
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
            console.log("date = " + date)
        }
        this.setState({dt_nasc_formatada: date})
        return date != null && date != undefined && date != "Invalid Date"
    }

    async validarDados(){
        let valido = true;
        this.setState({
            campoErro: ""
        })
        let campos = ["nome", "email", "usuario", "senha"];
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

    async validarDadosRestaurante(){
        let valido = true;
        this.setState({
            campoErro: ""
        })
        let campos = ["nome", "email", "usuario", "senha", "cnpj", "ddi", "ddd", "telefone", "cep", "logradouro", "bairro", "cidade", "estado", "pais", "numero"];
        if (!validarCNPJ(this.state.cnpj)){
            await this.setState({
                campoErro: "CNPJ inválido."
            })
            return false;
        }
        let cepValido = await this.isCepValido(removerCaracteresEspeciais(this.state.cep, ["-"]));
        if (!cepValido){
            await this.setState({
                campoErro: "CEP inválido."
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

    async verifyCNPJ(){
        if (this.state.cnpj.length > this.state.backup_cnpj.length){
            let cnpj = formatarCNPJ(this.state.cnpj);
            await this.setState({
                cnpj: cnpj,
                backup_cnpj: cnpj
            })
        } else {
            await this.setState({backup_cnpj: this.state.cnpj})
        }
    }

    async verifyCep(){
        if (this.state.cep.length > this.state.backup_cep.length){
            let cep = formatarCep(this.state.cep);
            await this.setState({
                cep: cep,
                backup_cep: cep
            })
            if (removerCaracteresEspeciais(cep, ["-"]).length == 8){
                this.gerarCep();
            }
        } else {
            await this.setState({backup_cep: this.state.cep})
        }
    }
        

    async cadastrar(){
        let valido = false;
        await this.setState({loading: true});
        if (this.state.opcao == "RESTAURANTE"){
            valido = this.validarDadosRestaurante();
        } else {
            valido = this.validarDados();
        }
        if (valido){
            let user;
            if (this.state.opcao == "PESSOA"){
                user = { 
                    nome: this.state.nome,
                    email: this.state.email,
                    senha: this.state.senha,
                    sexo: this.state.sexo,
                    usuario: this.state.usuario,
                    dt_nasc: this.returnDataFormatada(this.state.dt_nasc)
                };
            } else {
                user = { 
                    nome: this.state.nome,
                    cnpj: removerCaracteresEspeciais(this.state.backup_cnpj, ["-", ".", "/"]),
                    email: this.state.email,
                    senha: this.state.senha,
                    usuario: this.state.usuario,
                    ddi: this.state.ddi,
                    ddd: this.state.ddd,
                    telefone: this.state.telefone,
                    cep: removerCaracteresEspeciais(this.state.cep, ["-"]),
                    logradouro: this.state.logradouro,
                    bairro: this.state.bairro,
                    cidade: this.state.cidade,
                    estado: this.state.estado,
                    pais: this.state.pais,
                    numero: this.state.numero,
                    complemento: this.state.complemento
                };
            }
            user = JSON.stringify(user);
            let result = await this.callMethod("registerV2", { user, tipoDeCadastro: this.state.opcao })
            if (result.success){
                if (result.result == "EMAIL_EXISTS"){
                    this.showModal("Email já cadastrado", "Esse email já está cadastro em nosso sistema.");
                } else if (result.result == "USER_EXISTS"){
                    this.showModal("Usuário já cadastrado", "Esse nome de usuário já está cadastro em nosso sistema.");
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
        } else {
            this.showModal("Erros a vista", this.state.campoErro)
        }
        await this.setState({loading: false});
    }

    async gerarCep(){
        let result = await this.viaCepMethod(this.state.cep);
        if (result && !result.erro){
            this.setState({
                logradouro: result.logradouro,
                bairro: result.bairro,
                cidade: result.localidade,
                estado: result.uf,
                pais: "Brasil",
            })
        }
    }

    async isCepValido(cep){
        if (cep.length == 8){
            let result = await this.viaCepMethod(cep);
            return !result.erro;
        }
        return false;
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

    renderCadastroRestaurante(){
        return (      
            <View style={styles.container}>
                <Input 
                label={"Nome *"}
                icone={"user-circle"}
                placeholder="Nome" 
                placeholderTextColor="rgb(153, 153, 153)" 
                // style={styles.input}
                onChangeText={(nome) => this.setState({nome})}
                value={this.state.nome}
                returnKeyType={"next"}
                onSubmitEditing={() => this.segundoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'words'
                maxLength={100}
                />
                <Input
                label={"CNPJ *"}
                icone={"id-card"}
                inputRef={(input) => this.segundoInput = input}
                placeholder="CNPJ" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(cnpj) => this.setState({cnpj}, this.verifyCNPJ)}
                value={this.state.cnpj}
                returnKeyType={"next"}
                onSubmitEditing={() => this.terceiroInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType='number-pad'
                maxLength={18}
                />
                
                <Input
                label={"Email *"}
                icone={"envelope"}
                inputRef={(input) => this.terceiroInput = input}
                placeholder="Email" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}
                onSubmitEditing={() => this.quartoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                returnKeyType={"next"}
                maxLength={100}
                />
                <Input
                label={"Usuário *"}
                icone={"user-circle"}
                inputRef={(input) => this.quartoInput = input}
                placeholder="Usuário" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                value={this.state.usuario}
                onChangeText={(usuario) => this.setState({usuario})}
                onSubmitEditing={() => this.quintoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                returnKeyType={"next"}
                maxLength={30}
                />
                <Input
                label={"Senha *"}
                icone={"lock"}
                inputRef={(input) => this.quintoInput = input}
                placeholder="Senha" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                value={this.state.senha}
                onChangeText={(senha) => this.setState({senha})}
                onSubmitEditing={() => this.sextoInput.focus()}
                blurOnSubmit={false}
                secureTextEntry={true}
                autoCapitalize = 'none'
                maxLength={100}
                />
                <Input
                label={"DDI *"}
                icone={"phone"}
                inputRef={(input) => this.sextoInput = input}
                placeholder="DDI" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(ddi) => this.setState({ddi})}
                value={this.state.ddi}
                returnKeyType={"next"}
                onSubmitEditing={() => this.setimoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType='number-pad'
                maxLength={3}
                />
                <Input
                label={"DDD *"}
                icone={"phone"}
                inputRef={(input) => this.setimoInput = input}
                placeholder="DDD" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(ddd) => this.setState({ddd})}
                value={this.state.ddd}
                returnKeyType={"next"}
                onSubmitEditing={() => this.oitavoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType='number-pad'
                maxLength={2}
                />
                <Input
                label={"Telefone *"}
                icone={"phone"}
                inputRef={(input) => this.oitavoInput = input}
                placeholder="Telefone" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(telefone) => this.setState({telefone})}
                value={this.state.telefone}
                returnKeyType={"next"}
                onSubmitEditing={() => this.nonoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType='number-pad'
                maxLength={11}
                />
                <Input
                label={"CEP *"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.nonoInput = input}
                placeholder="CEP" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(cep) => this.setState({cep}, this.verifyCep)}
                value={this.state.cep}
                returnKeyType={"next"}
                onSubmitEditing={() => this.decimoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType='number-pad'
                maxLength={9}
                />
                <Input
                label={"Logradouro *"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.decimoInput = input}
                placeholder="Logradouro" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(logradouro) => this.setState({logradouro})}
                value={this.state.logradouro}
                returnKeyType={"next"}
                onSubmitEditing={() => this.decimoPrimeiroInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'words'
                maxLength={60}
                />
                <Input
                label={"Bairro *"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.decimoPrimeiroInput = input}
                placeholder="Bairro" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(bairro) => this.setState({bairro})}
                value={this.state.bairro}
                returnKeyType={"next"}
                onSubmitEditing={() => this.decimoSegundoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'words'
                maxLength={30}
                />
                <Input
                label={"Cidade *"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.decimoSegundoInput = input}
                placeholder="Cidade" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(cidade) => this.setState({cidade})}
                value={this.state.cidade}
                returnKeyType={"next"}
                onSubmitEditing={() => this.decimoTerceiroInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'words'
                maxLength={30}
                />
                <Input
                label={"Estado *"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.decimoTerceiroInput = input}
                placeholder="Estado" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(estado) => this.setState({estado})}
                value={this.state.estado}
                returnKeyType={"next"}
                onSubmitEditing={() => this.decimoQuartoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'words'
                maxLength={4}
                />
                <Input
                label={"País *"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.decimoQuartoInput = input}
                placeholder="País" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(pais) => this.setState({pais})}
                value={this.state.pais}
                returnKeyType={"next"}
                onSubmitEditing={() => this.decimoQuintoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'words'
                maxLength={30}
                />
                <Input
                label={"Número *"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.decimoQuintoInput = input}
                placeholder="País" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(numero) => this.setState({numero})}
                value={this.state.numero}
                returnKeyType={"next"}
                onSubmitEditing={() => this.decimoSextoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType="number-pad"
                maxLength={30}
                />
                <Input
                label={"Complemento"}
                icone={"map-marker-alt"}
                inputRef={(input) => this.decimoSextoInput = input}
                placeholder="Complemento" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                onChangeText={(complemento) => this.setState({complemento})}
                value={this.state.complemento}
                returnKeyType={"next"}
                onSubmitEditing={() => this.cadastrar()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType="number-pad"
                maxLength={30}
                />
                
                {this.renderBotaoLogin()}
            </View>
        );
    }

    renderCadastroPessoa(){
        return (
            <View style={styles.container}>
                <Input 
                    label={"Nome"}
                    icone={"user-circle"}
                    placeholder="Nome" 
                    placeholderTextColor="rgb(153, 153, 153)" 
                    // style={styles.input}
                    onChangeText={(nome) => this.setState({nome})}
                    value={this.state.nome}
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.segundoInput.focus()}
                    blurOnSubmit={false}
                    autoCapitalize = 'words'
                    maxLength={100}
                    />
                <Input
                label={"Data de Nascimento"}
                icone={"birthday-cake"}
                inputRef={(input) => this.segundoInput = input}
                placeholder="Data de nascimento" 
                placeholderTextColor="rgb(153, 153, 153)" 
                value={this.state.dt_nasc}
                onChangeText={(dt_nasc) => this.setState({dt_nasc}, this.verifyDtNasc)}
                // onSubmitEditing={() => this.terceiroInput.focus()}
                // blurOnSubmit={false}
                autoCapitalize = 'none'
                keyboardType='number-pad'
                maxLength={10}
                />
                <Label label={"Gênero"} icone={"transgender"}/>
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
                
                <Input
                icone={"envelope"}
                label={"Email"} 
                inputRef={(input) => this.quartoInput = input}
                placeholder="Email" 
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
                <Input
                icone={"user-circle"}
                label={"Usuário"} 
                inputRef={(input) => this.quintoInput = input}
                placeholder="Usuário" 
                placeholderTextColor="rgb(153, 153, 153)" 
                style={styles.input}
                value={this.state.usuario}
                onChangeText={(usuario) => this.setState({usuario})}
                onSubmitEditing={() => this.sextoInput.focus()}
                blurOnSubmit={false}
                autoCapitalize = 'none'
                returnKeyType={"next"}
                maxLength={30}
                />
                <Input 
                icone={"lock"}
                label={"Senha"} 
                inputRef={(input) => this.sextoInput = input}
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
                    {this.renderBotaoLogin()}
                </TouchableOpacity>
            </View>
        );
    }

    renderCadastro(){
        if (this.state.opcao == "PESSOA"){
            return this.renderCadastroPessoa();
        }
        return this.renderCadastroRestaurante();
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
                        <TouchableOpacity style={[this.state.opcao == "PESSOA" ? styles.botoesOpcao : [styles.botoesOpcao, styles.botoesOpcaoVerde]]}>
                            <TouchableOpacity style={[this.state.opcao == "PESSOA" ? [styles.botaoOpcao, styles.botaoVerde] : [styles.botaoOpcao, styles.botaoBranco]]} onPress={() => this.mudarOpcao("PESSOA")}>
                                <Text style={[this.state.opcao == "PESSOA" ? [styles.textoBranco, styles.textoBotaoOpcao] : [styles.textoVerde, styles.textoBotaoOpcao]]}>Pessoa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[this.state.opcao == "RESTAURANTE" ? [styles.botaoOpcao, styles.botaoVerde] : styles.botaoOpcao]} onPress={() => this.mudarOpcao("RESTAURANTE")}>
                                <Text style={[this.state.opcao == "RESTAURANTE" ? [styles.textoBranco, styles.textoBotaoOpcao] : [styles.textoVerde, styles.textoBotaoOpcao]]}>Restaurante</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        {this.renderCadastro()}
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
        alignSelf: 'center',
    },
    botoesOpcaoVerde: {
        backgroundColor: '#27ae60'
    },
    botaoOpcao: {
        flex: .5,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    botaoBranco: {
        backgroundColor: '#fff'
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