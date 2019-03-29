import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import Modalzin from '../Modal/Modal';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

class Post extends Network {

    constructor(props){
        super(props);
        this.state = {
            data: this.props.data,
            modal: {
                visible: false,
                titulo: "",
                subTitulo: "",
                botoes: []
            },
            excluindo: false
        }
        // console.log("state = ", this.state.data)
    }

    // componentWillReceiveProps(props){
    //     this.setState({data: props.data});
    //     // console.log("props = ", props)
    // }

    async likeUnlikePost(id_post){
        let data = this.state.data;
        if (data.gostei){
            data.curtidas -= 1;
        } else {
            data.curtidas += 1;
        }
        data.gostei = !data.gostei;
        this.setState({data: data})
        let result = await this.callMethod("likeUnlikePost", { id_post });
        if (!result.success){
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
                <View style={styles.viewComentarios}>
                    <View style={styles.viewComentario}>
                        <View style={styles.bolinhaComentario}>
                        </View>
                        <Text style={styles.comentario}><Text onPress={() => this.props.navigation.push('Perfil', { id_usuario_perfil: this.state.data.id_usuario_comentario })} style={styles.nomeComentario}>{this.props.data.nome_usuario_comentario}</Text>  <Text onPress={() => this.props.navigation.push('Comentarios', { id_post: this.state.data.id_post })}>{this.props.data.top_comment}</Text></Text>
                    </View>
                </View>
            )
        } else return;
    }

    returnNumeroComentarios(){
        if (this.props.data.comentarios > 1){
            return (
            <Text onPress={() => this.props.navigation.push('Comentarios', { id_post: this.state.data.id_post })} style={styles.verMais}>Ver todos os {this.props.data.comentarios} comentários</Text>
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

    returnFolhinha(is_restaurante){
        if (is_restaurante)
            return (
                <View style={styles.viewInfoCurtidas}>
                    <AutoHeightImage source={require('../../assets/imgs/folha_nutring.png')} width={20}/>
                </View>
            );
    }

    returnDots(meu_post){
        if (this.state.excluindo){
            return (
                <View style={styles.viewInfoDots}>
                    <ActivityIndicator size="small" color="#777" />
                </View>
            );
        }
        if (meu_post){
            return (
                <TouchableOpacity style={styles.viewInfoDots} onPress={() => this.abrirModalExclusao()}>
                    <Icon name="ellipsis-v" color="#000" size={18} />
                </TouchableOpacity>
            );
        }
        return null;
    }

    abrirModalExclusao(){
        this.setState({
            modal: {
                visible: true,
                titulo: "Postagem",
                subTitulo: "Deseja excluir sua postagem?",
                botoes: this.criarBotoesExclusao()
            }
        })
    }

    criarBotoesExclusao(){
        let botoes = [
            {chave: "EXCLUIR", texto: "Excluir postagem", color: '#DC143C', fontWeight: 'bold'},
            {chave: "CANCELAR", texto: "Cancelar"},
        ]
        return botoes;
    }

    setModalState(visible){
        this.setState({
            modal: {
                visible: visible
            }
        })
    }

    getModalClick(key){
        this.setModalState(false);
        console.log("clicando no " + key)
        if (key == "EXCLUIR"){
            this.excluirPost();
        }
    }

    async excluirPost(){
        this.setState({
            excluindo: true
        })
        let result = await this.callMethod("excluirPost", { id_post: this.state.data.id_post });
        if (result.success){
            this.props.onDelete(this.state.data.id_post);
        }
    }
    
    returnDescricao(descricao){
        if (descricao){
            return (
                <View style={styles.viewInfoDescricao}>
                    <Text style={styles.texto}>{descricao}</Text>
                </View>
            );
        }
        return null;
    }

    renderCurtidores(curtidores){
        if (!curtidores) return null;
        return curtidores.map(curtidor => {
            return (
                <View key={curtidor.id_usuario} style={styles.pessoaCurtida}>
                    <View style={{width: 20, height: 20, borderRadius: 20/2, backgroundColor: '#000'}}>
                        <Image source={{uri: curtidor.foto}} style={{width: 20, height: 20, borderRadius: 20/2, borderWidth: 2, borderColor: '#fff'}}/>
                    </View>
                </View>
            );
        })
    }

    renderComentaristas(comentaristas){
        if (!comentaristas) return null;
        return comentaristas.map(comentarista => {
            console.log("comentarista aqui = ", comentarista)
            return (
                <View key={comentarista.id_usuario} style={styles.pessoaComentario}>
                    <View style={{width: 20, height: 20, borderRadius: 20/2, backgroundColor: '#000'}}>
                        <Image source={{uri: comentarista.foto}} style={{width: 20, height: 20, borderRadius: 20/2, borderWidth: 2, borderColor: '#fff'}}/>
                    </View>
                </View>
            );
        })
    }

    renderBotaoMultiplasImagens(conteudo){
        if (Array.isArray(conteudo) && conteudo.length > 1){
            return (
                <View style={styles.iconeMultiplasFotos}>
                    {/* <Icon name="images" solid size={11} color="#fff"/> */}
                    <Text style={styles.textoMultiplasFotos}>{conteudo.length} fotos</Text>
                </View>
            );
        }
        return null;
    }

    returnBotaoGostei(gostei){
        if (gostei){
            return (
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.likeUnlikePost(this.state.data.id_post)} style={[styles.botaoGostei, {backgroundColor: '#28b657'}]}>
                    <Icon name="heart" size={20} color="#fff"/>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.likeUnlikePost(this.state.data.id_post)} style={[styles.botaoGostei, {backgroundColor: '#fff'}]}>
                <Icon name="heart" size={20} color="#28b657"/>
            </TouchableOpacity>
        );
    }

    render(){
        let larguraImagem = imageWidth;
        let { id_usuario, id_post, foto, is_restaurante, nome, gostei, curtidas, descricao, conteudo, tempo_postado, nome_usuario_comentario, top_comment, comentarios, meu_post, curtidores, comentaristas } = this.state.data;
        let { index } = this.props;
        return (
            <View style={styles.container}>
            <Modalzin 
                titulo={this.state.modal.titulo} 
                subTitulo={this.state.modal.subTitulo} 
                visible={this.state.modal.visible} 
                onClick={(key) => this.getModalClick(key)}
                onClose={() => this.setState({modal: {visible: false}})}
                botoes={this.state.modal.botoes}
                />
                <View style={styles.viewInfoAll}>
                    <View style={styles.viewInfo}>
                        <View style={styles.fotoETexto}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('Perfil', { id_usuario_perfil: id_usuario })} style={{height: 50, width: 50, borderRadius: 50/2, backgroundColor: '#000', marginHorizontal: 15}}>
                                <Image resizeMethod="resize" style={{height: 50, width: 50, borderRadius: 50/2}} source={{uri: foto}}/>
                            </TouchableOpacity>
                            <View style={styles.viewInfoTexto}>
                                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.props.navigation.push('Perfil', { id_usuario_perfil: id_usuario })}>
                                    <Text style={styles.nome}>{nome}</Text>
                                    {this.returnFolhinha(is_restaurante)}
                                </TouchableOpacity>
                                {this.returnTextoPostedAgo(tempo_postado)}
                            </View>
                        </View>
                        {this.returnDots(meu_post)}
                    </View>
                    <View style={styles.viewInfoEConteudo}>
                        
                        <TouchableOpacity onPress={this.props.onClickFoto} style={styles.viewImagem}>
                            <AutoHeightImage source={{uri: this.formatarConteudo(conteudo)}} width={larguraImagem}/>
                            <View style={styles.viewGostei}>
                                {this.returnBotaoGostei(gostei)}
                                <Text style={styles.textoBotaoGostei}>{curtidas}</Text>
                            </View>
                            {/* {this.renderBotaoMultiplasImagens(conteudo)} */}
                        </TouchableOpacity>
                        {this.returnDescricao(descricao)}
                            {/* {this.returnTopComentario()}
                        <View style={styles.wrapper}>
                                {this.returnNumeroComentarios()}
                        </View> */}
                    </View>
                </View>
            </View>
        );
    }

    formatarConteudo(conteudo){
        if (Array.isArray(conteudo)) return conteudo[0].url_conteudo;
        return conteudo;
    }

}

export default Post;

const styles = {
    container: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomColor: '#eee',
        // borderBottomWidth: 1
    },
    labelCurtidas: {
        position: 'absolute',
        right: -10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#28b657',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 5
    },
    labelCurtidasTop: {
        top: 5
    },
    labelCurtidasBottom: {
        bottom: 0
    },
    textoLabelCurtidas: {
        color: '#fff',
        fontSize: 10
    },
    pessoasCurtidas: {
        marginTop: 10,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pessoaCurtida: {
        width: 10,
        elevation: 2,
    },
    pessoasComentarios: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 52,
        marginBottom: 10
    },
    pessoasComentariosFull: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 52,
    },
    pessoaComentario: {
        height: 10,
        elevation: 2
    },
    tracoCurtidas: {
        flex: 1,
        height: 1,
        marginLeft: 20,
        backgroundColor: '#ddd'
    },
    tracoCurtidasFull: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd'
    },
    tracoComentarios: {
        flex: 1,
        width: 2,
        marginVertical: 10,
        backgroundColor: '#ddd'
    },
    tracoComentariosFull: {
        flex: 1,
        width: 2,
        marginTop: 10,
        backgroundColor: '#ddd'
    },
    viewInfoAll: {
        flex: 1,
        flexDirection: 'column',
    },
    viewFoto: {
        width: 58,
        alignItems: 'center'
    },
    fotoETexto: {
        flex: .7,
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewInfo: {
        flex: 1,
        flexDirection: 'row'
    },
    viewInfoTexto: {
        flexDirection: 'column'
    },
    nome: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        maxHeight: 24,
        marginRight: 5
    },
    tempo: {
        fontSize: 13,
        color: '#aaa'
    },
    viewInfoDots: {
        flex: .3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 10
    },
    viewInfoFolha: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    curtidas: {
        fontSize: 17,
        color: '#aaa',
        fontWeight: 'bold'
    },
    viewInfoEConteudo: {
        marginTop: 10,
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
        flexDirection: 'row',
        maxHeight: 400,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    tabs: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
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
    iconeMultiplasFotos: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        bottom: 0,
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        borderTopLeftRadius: 10
    },
    textoMultiplasFotos: {
        color: '#fff',
        fontSize: 10
    },


    viewGostei: {
        position: 'absolute',
        left: 10,
        bottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    botaoGostei: {
        height: 40,
        width: 40,
        borderRadius: 40/2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5
    },
    textoBotaoGostei: {
        color: '#fff',
        fontSize: 16
    }
    
}