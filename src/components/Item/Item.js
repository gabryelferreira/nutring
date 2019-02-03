import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';


export default class Item extends Network {

    constructor(props){
        super(props);
        this.state = {
            icone: ""
        }
    }
    
    componentDidMount(){
        this.setIcone();
    }

    setIcone(){
        let icone;
        if (this.props.acao == "CURTIU_POST" || this.props.acao == "CURTIU_COMENTARIO"){
            this.setState({
                icone: "thumbs-up"
            })
        } else if (this.props.acao == "SEGUIU"){
            this.setState({
                icone: "user-friends"
            })
        } else if (this.props.acao == "COMENTOU_POST" || this.props.acao == "COMENTOU_RECEITA"){
            this.setState({
                icone: "comment"
            })
        }
    }



    renderBolinha = () => {
        if (this.props.promo){
            return (
                <View style={[styles.bola, styles.bolaMaior]}>
                    <Text style={styles.textoBola}>{this.props.quantidade}</Text>
                </View>
            );
        } else if (this.state.icone){
            return (
                <View style={[styles.bola, styles.bolaMenor]}>
                    <Icon name={this.state.icone} color="#fff" size={7} solid />
                </View>
            );
        }
        return null;
    }
    
    returnDescricao = (descricao) => {
        if (descricao){
            return  <Text style={styles.texto}>{this.props.descricao}</Text>;
        }
        return null;
    }
    

    renderTexto = () => {
        if (this.props.promo || this.props.tipo == "BUSCANDO"){
            return (
                <View>
                    <Text style={styles.titulo}>{this.props.titulo}</Text>
                    <Text style={styles.descricao}>{this.props.descricao}</Text>
                </View>
            );
        } else {
            return (
                <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={styles.nome}>{this.props.titulo} {this.returnDescricao(this.props.descricao)}</Text>
                    {this.returnTextoPostedAgo(this.props.tempoAtras)}
                </View>
            );
        }
    }

    returnTextoPostedAgo = (tempoAtras) => {
        if (tempoAtras == "agora"){
            return <Text style={styles.tempo}>{tempoAtras}</Text>;
        } else if (tempoAtras) {
            return <Text style={styles.tempo}>{tempoAtras} atrás</Text>;
        }
        return null;
    }

    renderFinal = () => {
        if (this.props.promo)
        {
            return <View style={styles.bolinhaVerde}></View>
        }
        else if (this.props.fotoPost)
        {
            return <Image resizeMethod="resize" style={{flex: 1, height: 45, width: 45}} source={{uri: this.props.fotoPost}}/>
        } 
        else if (this.props.tipo == "SEGUIU")
        {
            return <Icon name="exchange-alt" color='#000' size={18}/>
        }
        return null;
    }

    renderFoto = () => {
        if (this.props.foto){
            return <Image resizeMethod="resize" style={{flex: 1, height: 45, width: 45, borderRadius: 45/2}} source={{uri: this.props.foto}}/>
        }
        return null;
    }


    render(){
        return (
            <TouchableOpacity onPress={this.props.onPress} style={[styles.notificacao, [this.props.promo ? {marginBottom: 20} : {}]]}>
                <TouchableOpacity style={styles.foto} onPress={this.props.onPressFoto}>
                    {this.renderFoto()}
                    {this.renderBolinha()}
                </TouchableOpacity>
                <TouchableOpacity style={styles.textos} onPress={this.props.onPress}>
                    {this.renderTexto()}
                </TouchableOpacity>
                <TouchableOpacity style={styles.icone} onPress={this.props.onPressFinal}>
                    {this.renderFinal()}
                </TouchableOpacity>
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
    icone: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        elevation: 5
    },
    bolinhaVerde: {
        width: 10,
        height: 10,
        borderRadius: 10/2,
        backgroundColor: '#28b657'
    },
    bola: {
        position: 'absolute',
        right: -3,
        bottom: -3,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3
    },
    bolaMaior: {
        width: 23,
        height: 23,
        borderRadius: 23/2,
        backgroundColor: '#28b657'
    },
    bolaMenor: {
        width: 15,
        height: 15,
        borderRadius: 15/2,
        backgroundColor: '#28b657'
    },
    textoBola: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 11
    },
    tempo: {
        fontSize: 11,
        color: '#777',
    },
}