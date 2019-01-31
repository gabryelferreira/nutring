import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Notificacao = ({ promo, quantidade, icone, tipo, foto, titulo }) => {

    let texto = "";

    renderBolinha = () => {
        if (promo){
            return (
                <View style={[styles.bola, styles.bolaMaior]}>
                    <Text style={styles.textoBola}>{quantidade}</Text>
                </View>
            );
        } else {
            return (
                <View style={[styles.bola, styles.bolaMenor]}>
                    <Icon name={icone} color="#fff" size={7} solid />
                </View>
            );
        }
    }

    renderTexto = () => {
        if (promo){
            return (
                <View>
                    <Text style={styles.titulo}>Promoções</Text>
                    <Text style={styles.descricao}>Promoções dos restaurantes que você segue.</Text>
                </View>
            );
        } else {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.nome}>Gabryel Marinho <Text style={styles.texto}>mencionou você em um comentário.</Text></Text>
                </View>
            );
        }
    }


    return (
        <TouchableOpacity style={[styles.notificacao, [promo ? {marginBottom: 20} : {}]]}>
            <TouchableOpacity style={styles.foto}>
                <Image style={{flex: 1, height: 45, width: 45, borderRadius: 45/2}} source={require('../../assets/imgs/eu.jpg')}/>
                {renderBolinha()}
            </TouchableOpacity>
            <View style={styles.textos}>
                {renderTexto()}
            </View>
            <View style={styles.icone}>
                <View style={styles.bolinhaVerde}></View>
            </View>
        </TouchableOpacity>
    );

}

export default Notificacao;

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
        alignItems: 'flex-start'
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
        color: '#777',
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
    }
}