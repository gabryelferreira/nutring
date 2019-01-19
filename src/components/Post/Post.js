import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Post = (props) => {

    function returnTopComentario() {
        if (props.data.top_comment){
            return (
                <View style={[styles.wrapper, styles.viewComentarios]}>
                    <View style={styles.viewComentario}>
                        <View style={styles.bolinhaComentario}>
                        </View>
                        <Text style={styles.comentario}><Text onPress={() => props.navigation.navigate('Perfil')} style={styles.nomeComentario}>{props.data.nome_usuario_comentario}</Text>  <Text onPress={() => props.navigation.navigate('Comentarios')}>{props.data.top_comment}</Text></Text>
                    </View>
                </View>
            )
        } else return;
    }

    function returnNumeroComentarios() {
        if (props.data.comentarios > 1){
            return (
            <Text onPress={() => props.navigation.navigate('Comentarios')} style={styles.verMais}>{props.data.comentarios}</Text>
            )
        } else return;
    }

    let larguraImagem = imageWidth;
    let { foto, nome, curtidas, descricao, conteudo, tempo_postado, nome_usuario_comentario, top_comment, comentarios } = props.data;
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
                        <Text style={styles.tempo}>{tempo_postado} atrás</Text>
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
                <View style={styles.tabs}>
                    <View style={styles.tab}>
                        <Icon name="heart" color="#ccc" size={20}/>
                        <Text style={{fontSize: 15, marginLeft: 5}}>Curtir</Text>
                    </View>
                    <View style={styles.tab}>
                        <Icon name="comment" color="#ccc" size={20}/>
                        <Text style={{fontSize: 15, marginLeft: 5}}>Comentar</Text>
                    </View>
                </View>
                
                
                    {returnTopComentario()}
                <View style={styles.wrapper}>
                        {returnNumeroComentarios()}
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
    tabs: {
        flexDirection: 'row'
    },
    tab: {
        flex: .5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5
    }
}