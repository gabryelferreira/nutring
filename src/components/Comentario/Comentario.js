import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Comentario = (props) => {
    let larguraImagem = imageWidth;
    return (
        <View style={styles.container}>
            <View style={styles.viewFoto}>
                <Image source={require('../../assets/imgs/eu.jpg')} style={{height: 38, width: 38, borderRadius: 38/2}}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', borderBottomColor: '#e5e5e4', borderBottomWidth: 1, paddingBottom: 20}}>
                <View style={styles.viewInfo}>
                    <View style={styles.viewInfoTexto}>
                        <TouchableOpacity>
                            <Text style={styles.nome}>Gabryel Marinho Moreira Ferreira</Text>
                        </TouchableOpacity>
                        <Text style={styles.tempo}>30 min atrás</Text>
                        <Text style={styles.comentario}>Caralho, velho... MUITO FODA! Você merece isso e muito mais!!!</Text>
                    </View>
                </View>
                <View style={styles.opcaoComentario}>
                    <AutoHeightImage style={{marginRight: 7}} source={require('../../assets/imgs/folha_nutring.png')} width={27}/>
                    <Text style={styles.curtidas}>22</Text>
                </View>
            </View>
        </View>
    );
}

export default Comentario;

const styles = {
    container: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingLeft: 10,
        
    },
    viewFoto: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    viewInfo: {
        flex: .8,
        flexDirection: 'row'
    },
    viewInfoTexto: {
        flexDirection: 'column'
    },
    nome: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        maxHeight: 20
    },
    tempo: {
        fontSize: 13,
        color: '#aaa'
    },
    comentario: {
        fontSize: 15,
        color: '#000',
        marginTop: 10
    },
    opcaoComentario: {
        flex: .2,
        flexDirection: 'row',
        paddingRight: 5,
    },
    curtidas: {
        fontSize: 13,
        color: '#aaa',
        fontWeight: 'bold'
    },
}