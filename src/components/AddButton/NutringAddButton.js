import React, {Component} from 'react';
import { TouchableHighlight, View, Modal, ScrollView, Text, Image, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Camera from '../Camera/Camera';
import Network from '../../network';
import { SafeAreaView } from 'react-navigation';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Header = ({onCloseClick}) => {
    return (
        <SafeAreaView style={{backgroundColor: '#fff'}}>
            <View style={{
                elevation: 1,
                shadowOpacity: 0,
                height: 50,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                left: 0, right: 0, top: 0,
                zIndex: 9999,
                borderBottomWidth: 1,
                borderBottomColor: '#eee'
            }}>
                <View style={{position: 'relative', flex: 1, zIndex: 9999, flexDirection: 'row', alignItems: 'center', justifyContent: Platform.OS === 'ios' ? 'space-between' : 'flex-start'}}>
                    <Icon onPress={onCloseClick} name="times" color="#000" size={24}/>
                    <Text style={{color: '#000', fontWeight: 'bold', fontSize: 22, marginLeft: Platform.OS === 'ios' ? 0 : 30}}>Escolha</Text>
                    <Icon name="times" color="#fff" size={24}/>
                </View>
            </View>
        </SafeAreaView>
    );
}
class NutringAddButton extends Network {

    state = {
        visible: false,
        cameraVisible: false,
        isRestaurante: false,
        carregando: true,
        erro: false
    }

    constructor(props){
        super(props);
        this.isRestaurante();
    }

    async isRestaurante(){
        let result = await this.callMethod("isRestaurante");
        if (result.success){
            this.setState({
                isRestaurante: result.result,
                carregando: false
            })
        } else {
            this.setState({
                carregando: false,
                erro: true
            })
        }
    }

    abrirCamera(){
        this.setState({
            visible: false,
            cameraVisible: true
        })
    }

    abrirPagina(pagina){
        this.setState({
            visible: false
        })
        this.props.navigation.navigate(pagina, { navigation: this.props.navigation })
    }

    renderReceitas(){
        if (this.state.isRestaurante || this.state.carregando) return null;
        // if (1 == 1) return null;
        return (
            <View style={[styles.opcao, styles.borderBottom]}>
                <Image source={require('../../assets/imgs/tela-mais/prato2.png')} style={styles.foto}/>
                <View style={styles.textos}>
                    <Text style={styles.titulo}>Postar Receita</Text>
                    <Text style={styles.descricao}>Compartilhe suas <Text style={styles.bold}>melhores receitas! </Text>
                    Poste para a <Text style={styles.bold}>aba receitas.</Text> Pode ser uma receita feita por você, pelo seu amigo ou uma que você viu na internet e deseja compartilhar! ;)</Text>
                    <TouchableOpacity style={styles.botao} onPress={() => this.abrirPagina("NovaReceita")}>
                        <Text style={styles.textoBotao}>POSTAR RECEITA</Text>
                        <Icon name="chevron-right" solid size={14} color="#000" style={{fontWeight: 'bold'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderPromocoes(){
        if (!this.state.isRestaurante) return null;
        return (
            <View>

                <View style={[styles.opcao, styles.borderBottom]}>
                    <Image source={require('../../assets/imgs/tela-mais/prato3.png')} style={styles.foto}/>
                    <View style={styles.textos}>
                        <Text style={styles.titulo}>Cadastrar Promoção</Text>
                        <Text style={styles.descricao}>Cadastre aqui suas promoções para seus clientes. Elas ficarão visíveis para todos os seus seguidores dentro do Nutring. Aumenta as chances dos clientes efetuarem a compra!</Text>
                        <TouchableOpacity style={styles.botao} onPress={() => this.abrirPagina("NovaPromocao")}>
                            <Text style={styles.textoBotao}>NOVA PROMOÇÃO</Text>
                            <Icon name="chevron-right" solid size={14} color="#000" style={{fontWeight: 'bold'}}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.opcao, styles.borderBottom]}>
                    <Image source={require('../../assets/imgs/tela-mais/prato4.png')} style={styles.foto}/>
                    <View style={styles.textos}>
                        <Text style={styles.titulo}>Enviar Notificação</Text>
                        <Text style={styles.descricao}>Envie aqui suas notificações personalizadas para seus clientes. Elas serão enviadas no horário escolhido diretamente para todos os seus seguidores. Escolha em horários chave!</Text>
                        <TouchableOpacity style={styles.botao} onPress={() => this.abrirPagina("EnviarNotificacao")}>
                            <Text style={styles.textoBotao}>ENVIAR NOTIFICAÇÃO</Text>
                            <Icon name="chevron-right" solid size={14} color="#000" style={{fontWeight: 'bold'}}/>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }

    render() {
        // if (this.state.carregando){
        //     return (
        //         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //             <ActivityIndicator size="large" color="#28b657"/>
        //         </View>
        //     );
        // }

        return (
            // <View style={{
            //     position: 'absolute',
            //     top: -22,
            //     backgroundColor: '#27ae60',
            //     paddingVertical: 7,
            //     paddingHorizontal: 10,
            //     borderRadius: 80
            // }}>
            <SafeAreaView>
                <View>

                    <Modal 
                    visible={this.state.cameraVisible}
                    animationType="slide"
                    presentationStyle="fullScreen"
                    onRequestClose={() => {
                        this.setState({cameraVisible: false})
                    }}
                    >
                        <SafeAreaView style={{flex: 1}}>
                            <Camera onClose={() => this.setState({cameraVisible: false})}/>
                        </SafeAreaView>
                    </Modal>
                    
                    <Modal 
                    visible={this.state.visible}
                    animationType="slide"
                    presentationStyle="fullScreen"
                    onRequestClose={() => {
                        this.setState({visible: false})
                    }}
                    >
                        <Header onCloseClick={() => this.setState({visible: false})}/>
                        <View style={{flex: 1}}>
                            <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>

                                <View style={[styles.opcao, styles.borderBottom]}>
                                    <Image source={require('../../assets/imgs/tela-mais/prato1.png')} style={styles.foto}/>
                                    <View style={styles.textos}>
                                        <Text style={styles.titulo}>Postar Prato</Text>
                                        <Text style={styles.descricao}>Compartilhe seus <Text style={styles.bold}>pratos favoritos! </Text>
                                        Poste fotos no <Text style={styles.bold}>seu feed.</Text> Podem ser fotos feitas por você, por algum amigo ou um prato lindo que você consumiu em um restaurante! ;)</Text>
                                        <TouchableOpacity style={styles.botao} onPress={() => this.abrirCamera()}>
                                            <Text style={styles.textoBotao}>POSTAR PRATO</Text>
                                            <Icon name="chevron-right" solid size={14} color="#000" style={{fontWeight: 'bold'}}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {this.renderReceitas()}

                                {this.renderPromocoes()}

                            </ScrollView>
                        </View>
                    </Modal>
                        <View style={{
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({visible: true})} style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Icon style={{paddingHorizontal: 25, paddingVertical: 10}} name="plus" size={22} color="#c7c7c7"/>
                            </TouchableOpacity>
                        </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = {

    bold: {
        // fontWeight: 'bold'
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },

    opcao: {
        paddingVertical: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    foto: {
        width: 140,
        height: 140,
        borderRadius: 140/2,
        marginLeft: -50
    },
    textos: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20
    },
    titulo: {
        fontSize: 21,
        marginBottom: 7,
        fontWeight: 'bold',
        color: '#000'
    },
    descricao: {
        color: '#000',
        fontSize: 14,
        marginBottom: 7,
        lineHeight: 20
    },
    botao: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#666',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
        marginTop: 8,
        alignSelf: 'flex-start'
    },
    textoBotao: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 7
    },


}

export default NutringAddButton;