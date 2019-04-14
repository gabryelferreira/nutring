import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import Modalzin from '../Modal/Modal';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';


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
            excluindo: false,
            hideShimmer: false,
            altura: 0,
            carregandoImagem: true,
            parandoDeSeguir: false,
            seguindo: false
        }
        this.calcularHeight(this.props.data.conteudo);
    }

    calcularHeight(conteudo){
        let img = "";
        if (!Array.isArray(conteudo)) return null;
        img = conteudo[0].url_conteudo;
        Image.getSize(img, (width, height) => {
            let alturaIdeal = imageWidth * height / width;
            this.setState({altura: alturaIdeal})
        });
        
    }

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
        if (this.props.data.comentario){
            return (
                <View style={styles.viewComentarios}>
                    <View style={styles.viewComentario}>
                        <View style={styles.bolinhaComentario}>
                        </View>
                        <Text style={styles.comentario}><Text onPress={() => this.props.navigation.push('Perfil', { id_usuario_perfil: this.state.data.id_usuario_comentario })} style={styles.nomeComentario}>{this.props.data.pessoa_comentario}</Text>  <Text onPress={() => this.props.navigation.push('Comentarios', { id_post: this.state.data.id_post })}>{this.props.data.comentario}</Text></Text>
                    </View>
                </View>
            )
        } else return;
    }

    returnNumeroComentarios(){
        if (this.props.data.comentarios > 1){
            return (
            <Text onPress={() => this.props.navigation.push('Comentarios', { id_post: this.state.data.id_post })} style={styles.verMais}>Ver mais {this.props.data.comentarios - 1} {(this.props.data.comentarios - 1) > 1 ? 'comentários' : 'comentário'}</Text>
            )
        } else return;
    }

    returnGostei(){
        if (!this.state.data.gostei)
            return <Icon name="heart" color="#444" size={22}/>
        return <Icon name="heart" color="#27ae60" solid size={22}/>
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
            return <Text style={{fontSize: 12, color: '#444'}}>{curtidas}</Text>;
        } else {
            return null;
        }
    }

    returnTextoComentario(comentarios){
        if (comentarios > 0){
            return <Text style={{fontSize: 12, marginLeft: 7, color: '#444'}}>{comentarios}</Text>
        } else {
            return null;
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

    renderBotaoSeguir(is_seguindo, color = "#000"){
        if (this.state.parandoDeSeguir || this.state.seguindo)
            return this.renderBotaoCarregandoSeguindo(is_seguindo, color);
        if (this.state.data.is_seguindo){
            return (
                <View style={[styles.justifyFlexEnd, styles.flexRow, styles.flex3, styles.alignCenter]}>
                    <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                        <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguindo</Text>
                        <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon name="check" color="#28b657" size={13} />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View style={[styles.justifyFlexEnd, styles.flexRow, styles.flex3, styles.alignCenter]}>
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.seguir()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguir</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderBotaoCarregandoSeguindo(is_seguindo, color = "#000"){
        if (is_seguindo){
            return (
                <View style={[styles.justifyFlexEnd, styles.flexRow, styles.flex3, styles.alignCenter]}>
                    <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                        <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguindo</Text>
                        <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator color="#ccc" size="small" />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        if (this.state.parandoDeSeguir ||this.state.seguindo){
            return (
                <View style={[styles.justifyFlexEnd, styles.flexRow, styles.flex3, styles.alignCenter]}>
                    <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                        <Text style={[styles.textoBotaoEditar, {color: color}]}>{this.state.parandoDeSeguir ? 'Seguir' : 'Seguindo'}</Text>
                        <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator color="#ccc" size="small" />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    async pararDeSeguir(){
        let id_seguido = this.state.data.id_usuario;
        await this.setState({
            parandoDeSeguir: true
        })
        let result = await this.callMethod("followUnfollow", { id_seguido });
        if (result.success){
            let user = this.state.data;
            user.is_seguindo = false;
            user.seguidores = user.seguidores - 1;
            await this.setState({
                user: user
            })
        }
        await this.setState({
            parandoDeSeguir: false
        })
    }

    async seguir(){
        let id_seguido = this.state.data.id_usuario;
        await this.setState({
            seguindo: true
        })
        let result = await this.callMethod("followUnfollow", { id_seguido });
        if (result.success){
            let user = this.state.data;
            user.is_seguindo = true;
            user.seguidores = user.seguidores + 1;
            await this.setState({
                user: user
            })
        }
        await this.setState({
            seguindo: false
        })
    }

    returnDots(meu_post, is_seguindo){
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
        return this.renderBotaoSeguir(is_seguindo);
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
            this.setState({
                excluindo: false
            })
            this.props.onDelete(this.state.data.id_post);
        }
    }
    
    renderDescricao(nome, descricao){
        if (nome && descricao){
            return (
                <View style={styles.viewInfoDescricao}>
                    <Text style={styles.texto}><Text onPress={() => this.props.navigation.push('Perfil', { id_usuario_perfil: this.state.data.id_usuario })} style={styles.bold}>{nome} </Text><Text onPress={() => this.props.navigation.push('Postagem', { id_post: this.state.data.id_post })}>{descricao}</Text></Text>
                </View>
            );
        }
        return null;
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

    renderTextoCurtidas(curtidas){
        if (curtidas == 0){
            return (
                <Text onPress={() => this.likeUnlikePost(this.state.data.id_post)} style={{flex: .7, fontSize: 14, fontWeight: 'bold', color: '#000', maxHeight: 24, marginLeft: 7}}>
                    Seja o primeiro a curtir!
                </Text>
            );
        } else if (curtidas == 1){
            return (
                <TouchableOpacity style={{flex: .7, marginLeft: 7}} onPress={() => this.props.navigation.navigate("Curtidas", { id_post: this.state.data.id_post })}>
                    <Text onPress={() => this.props.navigation.navigate("Curtidas", { id_post: this.state.data.id_post })} style={{fontSize: 14, fontWeight: 'bold', color: '#000', maxHeight: 24}}>
                        1 curtida
                    </Text>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={{flex: .7, marginLeft: 7}} onPress={() => this.props.navigation.navigate("Curtidas", { id_post: this.state.data.id_post })}>
                <Text onPress={() => this.props.navigation.navigate("Curtidas", { id_post: this.state.data.id_post })} style={{fontSize: 14, fontWeight: 'bold', color: '#000', maxHeight: 24}}>
                    {curtidas} curtidas
                </Text>
            </TouchableOpacity>
        );
    }

    renderShimmer(){
        return (
            <View style={{paddingVertical: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ShimmerPlaceHolder
                        style={{height: 50, width: 50, borderRadius: 50/2, marginHorizontal: 15}}
                        autoRun={true}
                        visible={false}
                    ></ShimmerPlaceHolder>
                    <View style={{flexDirection: 'column', flex: 1}}>
                        <View style={{flexDirection: 'row'}}>
                            <ShimmerPlaceHolder
                                style={{flex: .7, height: 18, marginBottom: 5}}
                                autoRun={true}
                                visible={false}
                            ></ShimmerPlaceHolder>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <ShimmerPlaceHolder
                                style={{height: 13, flex: .4}}
                                autoRun={true}
                                visible={false}
                            ></ShimmerPlaceHolder>
                        </View>
                    </View>
                    <View style={{width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 15}}>
                        <ShimmerPlaceHolder
                            style={{height: 18, width: 140}}
                            autoRun={true}
                            visible={false}
                        ></ShimmerPlaceHolder>
                    </View>
                </View>
                <View style={{flexDirection: 'row', flex: 1, marginTop: 10}}>
                    <ShimmerPlaceHolder
                        style={{flex: 1, height: 220}}
                        autoRun={true}
                        visible={false}
                    ></ShimmerPlaceHolder>
                </View>
                <View style={{flexDirection: 'row', flex: 1, marginHorizontal: 15, marginVertical: 10}}>
                    <View style={{flexDirection: 'row', flex: .7}}>
                        <ShimmerPlaceHolder
                            style={{height: 19, width: 19, marginRight: 7}}
                            autoRun={true}
                            visible={false}
                        ></ShimmerPlaceHolder>
                        <ShimmerPlaceHolder
                            style={{height: 19, flex: .68}}
                            autoRun={true}
                            visible={false}
                        ></ShimmerPlaceHolder>
                    </View>
                    <View style={{flexDirection: 'row', flex: .3, alignItems: 'center', justifyContent: 'flex-end'}}>
                        <ShimmerPlaceHolder
                            style={{height: 19, width: 19}}
                            autoRun={true}
                            visible={false}
                        ></ShimmerPlaceHolder>
                    </View>
                </View>
            </View>
        );
    }

    renderConteudo(conteudo){
        if (this.state.altura || !this.state.carregandoImagem){
            return (
                <View style={{flexDirection: 'row', flex: 1}}>
                    <ShimmerPlaceHolder
                        style={{flex: 1, height: this.state.altura}}
                        autoRun={true}
                        visible={!this.state.carregandoImagem}
                    >
                        <Image onLoad={() => this.setState({ carregandoImagem: false })} resizeMethod="resize" source={{uri: this.formatarConteudo(conteudo)}} style={{width: imageWidth, height: this.state.altura}}/>
                    </ShimmerPlaceHolder>
                </View>
            );
        }
        return (
            <View style={{flexDirection: 'row', flex: 1}}>
                <ShimmerPlaceHolder
                    style={{flex: 1, height: 220}}
                    autoRun={true}
                    visible={false}>
                </ShimmerPlaceHolder>
            </View>
        );
    }

    render(){
        let larguraImagem = imageWidth;
        let { id_usuario, id_post, foto, is_restaurante, nome, gostei, curtidas, descricao, conteudo, tempo_postado, nome_usuario_comentario, top_comment, comentarios, meu_post, curtidores, comentaristas, is_seguindo } = this.state.data;
        let { index } = this.props;
        if (this.props.shimmer){
            return this.renderShimmer();
        }
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
                            <TouchableOpacity onPress={() => this.props.navigation.push('Perfil', { id_usuario_perfil: id_usuario })} style={{height: 38, width: 38, borderRadius: 38/2, backgroundColor: '#000', marginRight: 15}}>
                                <Image resizeMethod="resize" style={{height: 38, width: 38, borderRadius: 38/2}} source={{uri: foto}}/>
                            </TouchableOpacity>
                            <View style={styles.viewInfoTexto}>
                                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.props.navigation.push('Perfil', { id_usuario_perfil: id_usuario })}>
                                    <Text style={styles.nome}>{nome}</Text>
                                    {this.returnFolhinha(is_restaurante)}
                                </TouchableOpacity>
                                {this.returnTextoPostedAgo(tempo_postado)}
                            </View>
                        </View>
                        {this.returnDots(meu_post, is_seguindo)}
                    </View>
                    <View style={styles.viewInfoEConteudo}>
                        
                        <TouchableOpacity activeOpacity={0.9} onPress={this.props.onClickFoto} style={styles.viewImagem}>
                        
                            {this.renderConteudo(conteudo)}
                            {/* {this.renderBotaoMultiplasImagens(conteudo)} */}
                        </TouchableOpacity>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 10, marginHorizontal: 15}}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => this.likeUnlikePost(this.state.data.id_post)} style={[styles.botaoGostei]}>
                                {this.returnGostei()}
                                {/* {this.returnTextoCurtidas(curtidas)} */}
                            </TouchableOpacity>
                            {this.renderTextoCurtidas(curtidas)}
                            <View style={styles.viewGostei}>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.push('Comentarios', { id_post })} style={[styles.botaoGostei]}>
                                    <Icon name="comment" size={22} color="#444"/>
                                    {this.returnTextoComentario(comentarios)}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.renderDescricao(nome, descricao)}
                        <View style={styles.wrapper}>
                            {this.returnNumeroComentarios()}
                            {this.returnTopComentario()}
                        </View>
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
    wrapper: {
        paddingHorizontal: 15
    },
    bold: {
        fontWeight: 'bold'
    },
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
        flexDirection: 'row',
        marginHorizontal: 15,
        alignItems: 'center'
    },
    viewInfoTexto: {
        flexDirection: 'column'
    },
    nome: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        maxHeight: 24,
        marginRight: 5,
        marginBottom: 2
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
        flexDirection: 'column',
        flex: 1,
        paddingHorizontal: 15,
        marginTop: 5,
    },
    texto: {
        fontSize: 14,
        color: '#000'
    },
    viewImagem: {
        flexDirection: 'row',
        maxHeight: 300,
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
        alignSelf: 'center'
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
        fontSize: 14
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
        flex: .3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    botaoGostei: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    textoBotaoGostei: {
        color: '#444',
        fontSize: 16,
        marginLeft: 5
    },
    botaoEditar: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        flexDirection: 'row',
        width: 140
    },
    textoBotaoEditar: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold'
    },
    justifyFlexEnd: {
        justifyContent: 'flex-end',
    },
    flexRow: {
        flexDirection: 'row'
    },
    alignCenter: {
        alignItems: 'center'
    },
    flex3: {
        flex: .3
    }
    
}