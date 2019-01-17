import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Post = (props) => {
    let larguraImagem = imageWidth;
    let { foto, nome, curtidas, descricao, conteudo } = props.data;
    return (
        <View style={styles.container}>
            <View style={[styles.viewInfo, styles.wrapper]}>
                <View style={styles.fotoETexto}>
                    <View style={styles.viewFoto}>
                        <Image style={{height: 38, width: 38, borderRadius: 38/2}} source={{uri: foto}}/>
                    </View>
                    <View style={styles.viewInfoTexto}>
                        <Text style={styles.nome}>{nome}</Text>
                        <Text style={styles.tempo}>30 min atrás</Text>
                    </View>
                </View>
                <View style={styles.viewInfoCurtidas}>
                    <AutoHeightImage style={{marginRight: 7}} source={require('../../assets/imgs/folha_nutring.png')} width={27}/>
                    <Text style={styles.curtidas}>{curtidas}</Text>
                </View>
            </View>
            <View style={styles.viewInfoEConteudo}>
                <View style={[styles.viewInfoDescricao, styles.wrapper]}>
                    <Text style={styles.texto}>{descricao}</Text>
                </View>
                <View style={styles.viewImagem}>
                    <AutoHeightImage source={{uri: conteudo}} width={larguraImagem}/>
                </View>
            </View>
        </View>
    );
}

export default Post;

const styles = {
    container: {
        flexDirection: 'column',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    wrapper: {
        paddingHorizontal: 15
    },
    viewFoto: {
        width: 52,
        alignItems: 'flex-start'
    },
    fotoETexto: {
        flex: .7,
        flexDirection: 'row'
    },
    viewInfo: {
        flex: 1,
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
    viewInfoCurtidas: {
        flex: .3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 3
    },
    curtidas: {
        fontSize: 17,
        color: '#aaa',
        fontWeight: 'bold'
    },
    viewInfoEConteudo: {
        marginTop: 15,
        flexDirection: 'column'
    },
    viewInfoDescricao: {
        flexDirection: 'column'
    },
    texto: {
        marginBottom: 12,
        fontSize: 16,
        color: '#000'
    },
    viewImagem: {
        marginTop: 10,
        flexDirection: 'row'
    }
}