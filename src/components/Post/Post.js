import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

class Post extends Network {

    constructor(props){
        super(props);
        this.state = {
            data: this.props.data
        }
        // console.log("state = ", this.state.data)
    }

    // componentWillReceiveProps(props){
    //     this.setState({data: props.data});
    //     // console.log("props = ", props)
    // }

    async likeUnlikePost(id_post){
        let id_usuario = await this.getIdUsuarioLogado();
        let result = await this.callMethod("likeUnlikePost", { id_post, id_usuario });
        if (result.success){
            let data = this.state.data;
            if (data.gostei){
                data.curtidas -= 1;
            } else {
                data.curtidas += 1;
            }
            data.gostei = !data.gostei;
            this.setState({data: data})
        }
    }

    returnTopComentario(){
        if (this.props.data.top_comment){
            return (
                <View style={[styles.wrapper, styles.viewComentarios]}>
                    <View style={styles.viewComentario}>
                        <View style={styles.bolinhaComentario}>
                        </View>
                        <Text style={styles.comentario}><Text onPress={() => this.props.navigation.navigate('Perfil', { id_usuario_perfil: this.state.data.id_usuario_comentario })} style={styles.nomeComentario}>{this.props.data.nome_usuario_comentario}</Text>  <Text onPress={() => this.props.navigation.navigate('Comentarios', { id_post: this.state.data.id_post })}>{this.props.data.top_comment}</Text></Text>
                    </View>
                </View>
            )
        } else return;
    }

    returnNumeroComentarios(){
        if (this.props.data.comentarios > 1){
            return (
            <Text onPress={() => this.props.navigation.navigate('Comentarios', { id_post: this.state.data.id_post })} style={styles.verMais}>Ver todos os {this.props.data.comentarios} comentários</Text>
            )
        } else return;
    }

    returnGostei(){
        if (!this.state.data.gostei)
            return <Icon name="heart" color="#444" size={25}/>
        return <Icon name="heart" color="#27ae60" solid size={25}/>
    }

    returnTextoPostedAgo(tempo_postado){
        if (tempo_postado == "agora"){
            return <Text style={styles.tempo}>{tempo_postado}</Text>;
        } else {
            return <Text style={styles.tempo}>{tempo_postado} atrás</Text>;
        }
    }

    returnTextoCurtidas(curtidas){
        if (curtidas > 0){
            return <Text style={{fontSize: 13, marginLeft: 7, color: '#444'}}>{curtidas}</Text>;
        } else {
            return <Text style={{fontSize: 13, marginLeft: 7, color: '#444'}}>Curtir</Text>;
        }
    }

    returnTextoComentar(comentarios){
        if (comentarios > 0){
            return <Text style={{fontSize: 13, marginLeft: 7, color: '#444'}}>{comentarios}</Text>
        } else {
            return <Text style={{fontSize: 13, marginLeft: 7, color: '#444'}}>Comentar</Text>
        }
    }

    render(){
        let larguraImagem = imageWidth;
        let { id_usuario, id_post, foto, nome, gostei, curtidas, descricao, conteudo, tempo_postado, nome_usuario_comentario, top_comment, comentarios } = this.state.data;
        let { index } = this.props;
        return (
            <View style={styles.container}>
                <View style={[styles.viewInfo, styles.wrapper]}>
                    <View style={styles.fotoETexto}>
                        <View style={styles.viewFoto}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Perfil', { id_usuario_perfil: id_usuario })} style={{height: 38, width: 38, borderRadius: 38/2}}>
                                <Image style={{height: 38, width: 38, borderRadius: 38/2, position: 'absolute', left: 0, top: 0}} source={{uri: foto}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewInfoTexto}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Perfil', { id_usuario_perfil: id_usuario })}>
                                <Text style={styles.nome}>{nome}</Text>
                            </TouchableOpacity>
                            {this.returnTextoPostedAgo(tempo_postado)}
                        </View>
                    </View>
                    <View style={styles.viewInfoCurtidas}>
                        <AutoHeightImage source={require('../../assets/imgs/folha_nutring.png')} width={27}/>
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
                        <TouchableOpacity style={styles.tab} onPress={() => this.likeUnlikePost(id_post)}>
                            {this.returnGostei()}
                            {this.returnTextoCurtidas(curtidas)}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tab} onPress={() => this.props.navigation.navigate('Comentarios', { id_post: id_post })}>
                            <Icon name="comment" color="#444" size={25}/>
                            {this.returnTextoComentar(comentarios)}
                        </TouchableOpacity>
                    </View>
                    
                    
                        {this.returnTopComentario()}
                    <View style={styles.wrapper}>
                            {this.returnNumeroComentarios()}
                    </View>
                </View>
            </View>
        );
    }

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
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 5
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    viewComentarios: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 5
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