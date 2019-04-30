import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {BoxShadow} from 'react-native-shadow'

const Card = ({onPress, imagem, nome, seguidores, curtidas, descricao}) => {

    const shadowOpt = {
        width:100,
        height:100,
        color:"#000",
        border:2,
        radius:3,
        opacity:0.2,
        x:0,
        y:3,
        style:{marginVertical:5}
    }

    renderSeguidoresCurtidas = () => {
        if (seguidores){
            let textoSeguindo = "Seguidores";
            if (seguidores == 1)
                textoSeguindo = "Seguidor";
            return <Text numberOfLines={1} style={styles.qtdCurtidas}>{seguidores} <Text style={styles.textoCurtidas}>{textoSeguindo}</Text></Text>
        } else if (curtidas){
            let textoCurtida = "Curtidas";
            if (curtidas == 1)
                textoCurtida = "Curtida";
            return <Text numberOfLines={1} style={styles.qtdCurtidas}>{curtidas} <Text style={styles.textoCurtidas}>{textoCurtida}</Text></Text>
        } else if (descricao){
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.bolinhaVerde}></View>
                    <Text numberOfLines={1} style={styles.textoCurtidas}>{descricao}</Text>
                </View>
            );
        }
        return null;
    }

    return (
        <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.2}>
            <View style={styles.imagemDeFundo}>
                <Image resizeMethod="resize" source={{uri: imagem}} style={{flex: 1, width: null, height: null, zIndex: 2}}/>
                <View style={{position: 'absolute', left: 0, bottom: 0, right: 0, top: 0, backgroundColor: 'rgba(0, 0, 0, .3)', zIndex: 3}}></View>
            </View>
            <View style={styles.container}>
                <View style={styles.info}>
                    <Text numberOfLines={1} style={styles.nome}>{nome}</Text>
                    <View style={styles.infoBaixo}>
                        {renderSeguidoresCurtidas()}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

}

export default Card;

const styles = {
    card: {
        flexDirection: 'column',
        overflow: 'hidden',
        width: 180,
        height: 110,
        borderRadius: 5,
        marginRight: 2
    },
    imagemDeFundo: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    },
    container: {
        paddingBottom: 10,
        paddingHorizontal: 15,
        zIndex: 999,
        justifyContent: 'flex-end',
        flex: 1,
    },
    info: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 10
    },
    nome: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold'
    },
    infoBaixo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    qtdCurtidas: {
        fontSize: 13,
        color: '#27ae60',
        fontWeight: 'bold'
    },
    textoCurtidas: {
        fontSize: 11,
        color: '#fff',
        fontWeight: 'normal'
    },
    bolinhaVerde: {
        height: 6,
        width: 6,
        borderRadius: 6/2,
        backgroundColor: '#20b351',
        marginRight: 5,
        alignSelf: 'center'
    },

}