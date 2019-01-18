import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Post = (props) => {
    let larguraImagem = imageWidth;
    let { foto, nome, curtidas, descricao, conteudo } = props.data;
    let { index } = props;
    return (
        <View style={styles.container}>
            <View style={[styles.viewInfo, styles.wrapper]}>
                <View style={styles.fotoETexto}>
                    <View style={styles.viewFoto}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Perfil')} style={{height: 38, width: 38, borderRadius: 38/2}}>
                            <Image style={{height: 38, width: 38, borderRadius: 38/2, position: 'absolute', left: 0, top: 0}} source={{uri: foto}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewInfoTexto}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Perfil')}>
                            <Text style={styles.nome}>{nome}</Text>
                        </TouchableOpacity>
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
                
                <View style={[styles.wrapper, styles.viewComentarios]}>
                    <View style={styles.viewComentario}>
                        <View style={styles.bolinhaComentario}>
                        </View>
                        <Text style={styles.comentario}><Text onPress={() => props.navigation.navigate('Perfil')} style={styles.nomeComentario}>Joesley Freitas</Text>  <Text onPress={() => props.navigation.navigate('Comentarios')}>Wow! Parece delicipica E sempre vou comprar acoes na deep web.</Text></Text>
                    </View>
                </View>
                <View style={styles.wrapper}>
                        <Text onPress={() => props.navigation.navigate('Comentarios')} style={styles.verMais}>Ver mais 15 comentários</Text>
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
        // paddingTop: 3
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
        marginBottom: 5,
        fontSize: 16,
        color: '#000'
    },
    viewImagem: {
        marginTop: 5,
        flexDirection: 'row'
    },
    viewComentarios: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10
    },
    viewComentario: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    bolinhaComentario: {
        height: 8,
        width: 8,
        borderRadius: 8/2,
        backgroundColor: '#20b351',
        marginRight: 7,
        alignSelf: 'flex-start',
        marginTop: 8
    },
    nomeComentario: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 10
    },
    comentario: {
        fontSize: 14,
        color: '#000'
    },
    verMais: {
        color: '#aaa',
        marginTop: 5,
        fontSize: 15
    },
}