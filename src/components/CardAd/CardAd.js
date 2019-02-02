import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const CardAd = ({onPress, item}) => {


    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <View style={styles.imagemDeFundo}>
                <Image resizeMethod="resize" source={{uri: 'https://pbs.twimg.com/media/CIreT36WwAA2ofe.jpg'}} style={{flex: 1, width: undefined, height: undefined, zIndex: 2}}/>
                <View style={{position: 'absolute', left: 0, bottom: 0, right: 0, top: 0, backgroundColor: 'rgba(0, 0, 0, .3)', zIndex: 3}}></View>
            </View>
            <View style={styles.container}>
                <View style={styles.info}>
                    <Text style={styles.nome}>Outback Santos</Text>
                    <View style={styles.infoBaixo}>
                        <Text style={styles.qtdCurtidas}>776</Text>
                        <Text style={styles.textoCurtidas}>Curtidas</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

}

export default CardAd;

const styles = {
    card: {
        flexDirection: 'column',
        overflow: 'hidden',
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
        zIndex: 999
    },
    info: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    nome: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold'
    },
    infoBaixo: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    qtdCurtidas: {
        fontSize: 13,
        marginRight: 5,
        color: '#27ae60'
    },
    textoCurtidas: {
        fontSize: 11,
        color: '#fff'
    }

}