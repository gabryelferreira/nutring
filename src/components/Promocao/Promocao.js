import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';


export default class Promocao extends Network {

    constructor(props){
        super(props);
        this.state = {
            icone: ""
        }
    }
    
    componentDidMount(){
    }
    
    returnDescricao = (descricao) => {
        if (descricao){
            return  <Text style={styles.texto}>{this.props.descricao}</Text>;
        }
        return null;
    }
    

    renderTexto = () => {
        return (
            <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={styles.nome}>{this.props.titulo} {this.returnDescricao(this.props.descricao)}</Text>
                {this.returnConfirmados(this.props.confirmados, this.props.confirmacao)}
            </View>
        );
    }

    returnConfirmados = (confirmados, estou_confirmado) => {
        if (estou_confirmado){
            return <Text style={[styles.tempo, {color: '#28b657'}]}>Você garantiu seu cupom!</Text>;
        }
        if (confirmados > 0){
            if (confirmados == 1) {
                return <Text style={styles.tempo}>{confirmados} usuário já garantiu cupom</Text>;
            } else {
                return <Text style={styles.tempo}>{confirmados} usuários já garantiram cupom</Text>;
            }
        }
        if (this.props.relampago){
            return <Text style={styles.tempo}>Essa é uma promoção válida por apenas 24 horas!</Text>;
        }
        return <Text style={styles.tempo}>Garanta agora seu cupom!</Text>;
    }

    renderFinal = () => {
        
    }

    renderFoto = () => {
        if (this.props.foto){
            return <Image resizeMethod="resize" style={{flex: 1, height: 45, width: 45, borderRadius: 45/2}} source={{uri: this.props.foto}}/>
        }
        return null;
    }

    returnTimer = (relampago) => {
        if (relampago){
            return (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <Icon name="bolt" color="#eccc68" size={12}/>
                    <View style={styles.botaoTimer}>
                        <Text style={styles.textoBotaoTimer}>HOJE</Text>
                    </View>
                </View>
            );
        }
        return null;
    }

    render(){
        return (
            <TouchableOpacity onPress={this.props.onPress} style={[styles.notificacao, [this.props.promo ? {marginBottom: 20} : {}]]}>
                <TouchableOpacity style={styles.foto} onPress={this.props.onPressFoto}>
                    {this.renderFoto()}
                </TouchableOpacity>
                <TouchableOpacity style={styles.textos} onPress={this.props.onPress}>
                    {this.renderTexto()}
                </TouchableOpacity>
                <View style={styles.viewFinal}>
                    {this.returnTimer(this.props.relampago)}
                    <TouchableOpacity style={styles.botaoVerJa} onPress={this.props.onPressFinal}>
                        <Text style={styles.textoBotaoVerJa}>Ver já</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

}


const styles = {
    notificacao: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    foto: {
        height: 45,
        width: 45,
        borderRadius: 45/2,
        marginRight: 15
    },
    textos: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#000'
    },
    descricao: {
        fontSize: 11,
        color: '#000'
    },
    nome: {
        fontSize: 13.5,
        fontWeight: 'bold',
        marginRight: 2,
        color: '#000'
    },
    texto: {
        fontSize: 13,
        color: '#000',
        fontWeight: 'normal'
    },
    tempo: {
        fontSize: 11,
        color: '#777',
    },
    viewFinal: {
        paddingHorizontal: 10
    },
    botaoVerJa: {
        paddingVertical: 5,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#28b657',
        marginVertical: 2
    },
    textoBotaoVerJa: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12
    },
    botaoTimer: {
        paddingVertical: 3,
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: '#FF0000',
        alignSelf: 'flex-end',
        marginVertical: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4
    },
    textoBotaoTimer: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 8,
    }
}