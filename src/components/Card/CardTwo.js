import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {BoxShadow} from 'react-native-shadow';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CardTwo = ({onPress, imagem, nome, seguidores, curtidas, descricao, hoje}) => {

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
            return <Text numberOfLines={3} style={styles.qtdCurtidas}>{seguidores} <Text style={styles.textoCurtidas}>{textoSeguindo}</Text></Text>
        } else if (curtidas){
            let textoCurtida = "Curtidas";
            if (curtidas == 1)
                textoCurtida = "Curtida";
            return <Text numberOfLines={3} style={styles.qtdCurtidas}>{curtidas} <Text style={styles.textoCurtidas}>{textoCurtida}</Text></Text>
        } else if (descricao){
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* <View style={styles.bolinhaVerde}></View> */}
                    <Text numberOfLines={3} style={styles.textoCurtidas}>{descricao}</Text>
                </View>
            );
        }
        return null;
    }

    renderViewHoje = () =>{
        if (hoje){
            return (
                <View style={styles.contentImagem}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <Icon name="bolt" color="#eccc68" size={16}/>
                        <View style={styles.botaoTimer}>
                            <Text style={styles.textoBotaoTimer}>HOJE</Text>
                        </View>
                    </View>
                </View>
            );
        }
        return null;
    }

    return (
        <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.2}>
            <View style={styles.imagemDeFundo}>
                <Image resizeMethod="resize" source={{uri: imagem}} style={{flex: 1, width: null, height: null}}/>
                {/* <View style={{position: 'absolute', left: 0, bottom: 0, right: 0, top: 0, backgroundColor: 'rgba(0, 0, 0, .3)', zIndex: 3}}></View> */}
                {renderViewHoje()}
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

export default CardTwo;

const styles = {
    contentImagem: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        zIndex: 2,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    botaoTimer: {
        paddingVertical: 5,
        borderRadius: 7,
        paddingHorizontal: 10,
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
        fontSize: 10,
    },
    card: {
        flexDirection: 'column',
        overflow: 'hidden',
        width: 180,
        height: 210,
        borderRadius: 5,
        marginRight: 5,
        elevation: 1,
        backgroundColor: '#eee'
    },
    imagemDeFundo: {
        width: 180,
        height: 130,
        overflow: 'hidden'
    },
    container: {
        flex: 1,
        paddingVertical: 7,
        paddingHorizontal: 15,
        zIndex: 999,
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#fff'
    },
    info: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    nome: {
        fontSize: 15,
        color: '#000',
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
        color: '#000',
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