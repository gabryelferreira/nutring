import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const Card = ({onPress, item, imagem}) => {


    return (
        <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
            <View style={styles.imagemDeFundo}>
                <Image source={{uri: imagem}} style={{flex: 1, width: undefined, height: undefined, zIndex: 2}}/>
                <View style={{position: 'absolute', left: 0, bottom: 0, right: 0, top: 0, backgroundColor: 'rgba(0, 0, 0, .3)', zIndex: 3}}></View>
            </View>
            <View style={styles.container}>
                <View style={styles.info}>
                    <Text style={styles.nome}>Outback Santos</Text>
                    <View style={styles.infoBaixo}>
                        <Text style={styles.qtdCurtidas}>776 <Text style={styles.textoCurtidas}>Curtidas</Text></Text>
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
    }

}