import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, FlatList, PermissionsAndroid, CameraRoll, Linking, Modal, Platform } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../components/ImagemNutring/ImagemNutring';
import Loader from '../../components/Loader/Loader';
import Modalzin from '../../components/Modal/Modal';
import Network from '../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FotoPerfil from '../../components/FotoPerfil/FotoPerfil';
import SemDadosPerfil from '../../components/SemDadosPerfil/SemDadosPerfil';
import Galeria from '../../components/Galeria/Galeria';
import RNFetchBlob from 'react-native-fetch-blob';
import ModalPostagemViewer from '../../components/ModalPostagemViewer/ModalPostagemViewer';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class PerfilComponent extends Network {

    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            infoRestauranteVisible: false,
            modal: {
                visible: false,
                titulo: "Foto de Perfil",
                subTitulo: "O que deseja fazer com sua foto de perfil?",
                botoes: this.criarBotoes()
            },
            modalFotoVisible: false
        }
    }

    criarBotoes(){
        let botoes = [
            {chave: "ALTERAR", texto: "Alterar", color: '#27ae60', fontWeight: 'bold'},
            {chave: "VER_FOTO", texto: "Visualizar", color: '#27ae60', fontWeight: 'bold'},
            {chave: "TENTAR", texto: "Cancelar"},
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
        if (key == "ALTERAR"){
            this.props.abrirGaleriaFoto();
        } else if (key == "VER_FOTO"){
            this.setState({
                modalFotoVisible: true
            })
        }
    }

    renderBotaoAlterarCapa(sou_eu){
        if (sou_eu){
            console.log("aqui sou eu sim")
            return (
                <TouchableOpacity onPress={this.props.abrirGaleriaCapa}
                    style={{
                    paddingHorizontal: 10, 
                    paddingVertical: 3, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderWidth: 1, 
                    borderColor: '#eee',
                    backgroundColor: 'rgba(0, 0, 0, .3)',
                    marginRight: 10,
                    marginTop: 10,
                    borderRadius: 20
                }}>
                    <Text style={{fontSize: 10, color: '#eee', fontWeight: 'bold'}}>Alterar capa</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderCamerazinha(sou_eu){
        if (sou_eu){
            console.log("sou euuuu")
            return (
                <View style={styles.camerazinhaFoto}>
                    <Icon name="camera" size={15} color="#fff"/>
                </View>
            );
        }
        return null;
    }

    async seguir(){
        let id_seguido = this.props.navigation.getParam('id_usuario_perfil', "");
        await this.setState({
            seguindo: true
        })
        let result = await this.callMethod("followUnfollow", { id_seguido });
        if (result.success){
            let user = this.props.user;
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

    async pararDeSeguir(){
        let id_seguido = this.props.navigation.getParam('id_usuario_perfil', "");
        await this.setState({
            parandoDeSeguir: true
        })
        let result = await this.callMethod("followUnfollow", { id_seguido });
        if (result.success){
            let user = this.props.user;
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

    renderBotaoSeguir(color = "#000"){
        if (this.state.parandoDeSeguir || this.state.seguindo)
            return this.renderBotaoCarregandoSeguindo(color);
        if (this.props.user.sou_eu){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={this.props.editarPerfilClick}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Editar Perfil</Text>
                </TouchableOpacity>
            );
        }
        if (this.props.user.is_seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="check" color="#28b657" size={13} />
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={styles.botaoEditar} onPress={() => this.seguir()}>
                <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguir</Text>
            </TouchableOpacity>
        );
    }

    renderBotaoCarregandoSeguindo(color = "#000"){
        if (this.state.seguindo){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguindo</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
        if (this.state.parandoDeSeguir){
            return (
                <TouchableOpacity style={styles.botaoEditar} onPress={() => this.pararDeSeguir()}>
                    <Text style={[styles.textoBotaoEditar, {color: color}]}>Seguir</Text>
                    <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color="#ccc" size="small" />
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderLocalizacao(){
        if (this.props.user.endereco && this.props.user.endereco.cidade && this.props.user.endereco.estado){
            return (
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Icon name="map-marker-alt" color="#fff" size={14} style={{marginRight: 5}}/>
                    <Text style={styles.localizacao}>{this.props.user.endereco.cidade} - {this.props.user.endereco.estado}</Text>
                </View>
            );
        }
        return null;
    }

    renderDescricao(){
        if (this.props.user.descricao){
            return <Text style={styles.descricao}>{this.props.user.descricao}</Text>;
        }
        return null;
    }

    formatarImagemViewer(foto){
        return [foto]
    }

    returnPerfil(){
        if (this.props.user.is_restaurante){
            return (
                <View>
                    {this.renderInfoPerfilRestaurante()}
                    {this.renderModalRestaurante()}
                </View>
            );
        }
        return this.renderInfoPerfil();

    }

    render(){
        return (
            <View>
                <Modalzin 
                    titulo={this.state.modal.titulo} 
                    subTitulo={this.state.modal.subTitulo} 
                    visible={this.state.modal.visible} 
                    onClick={(key) => this.getModalClick(key)}
                    onClose={() => this.setState({modal: {visible: false}})}
                    botoes={this.state.modal.botoes}
                />
                <ModalPostagemViewer visible={this.state.modalFotoVisible}
                        foto={this.props.user.foto}
                        titulo={this.props.user.nome}
                        imagens={this.formatarImagemViewer(this.props.user.foto)}
                        onSwipeDown={() => this.setState({modalFotoVisible: false})}
                        onClose={() => this.setState({modalFotoVisible: false})}
                />

                {this.returnPerfil()}

            </View>
        );
    }

    renderCriarReceita(){
        if (this.props.user.sou_eu){
            return (
                <TouchableOpacity onPress={() => this.props.navigation.navigate("NovaReceita")} style={styles.botaoCriarReceita}>
                    <Text style={styles.textoCriarReceita}>Criar Receita</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderReceitas(receitas){
        return receitas.map((receita, index) => {
            if (index > 6) return null;
            return (
                <View key={receita.id_receita} style={styles.receita}>
                        {/* <Icon name="plus" size={15} color="#000"/> */}
                    <Image resizeMethod="resize" source={{uri: receita.foto ? receita.foto : ""}} style={styles.fotoReceita}/>
                </View>
            );
        })
    }

    renderViewReceitas(receitas){
        if (receitas.length > 0){
            return (
                <TouchableOpacity style={styles.viewReceitas} onPress={() => this.props.navigation.push("Receitas", { receitas, id_usuario_perfil: this.props.user.id_usuario })}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <View style={styles.viewInfoReceitas}>
                            <Text style={styles.tituloReceitas}>Receitas</Text>
                            <Text style={styles.subTituloReceitas}>{receitas.length} {receitas.length == 1 ? 'prato' : 'pratos'}</Text>
                        </View>
                        <View style={styles.receitas}>
                            {this.renderReceitas(receitas)}
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <Icon name="chevron-right" solid size={15} color="#000"/>
                    </View>
                </TouchableOpacity>
            );
        } else if (this.props.user.sou_eu){
            return (
                <View style={styles.viewReceitas}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <View style={styles.viewInfoReceitas}>
                            <Text style={styles.tituloReceitas}>Receitas</Text>
                            <Text style={styles.subTituloReceitas}>Você não possui receitas</Text>
                        </View>
                    </View>
                    {this.renderCriarReceita()}
                </View>
            );
        }
        return null;
    }

    renderInfoPerfil(){
        let { nome, descricao, seguidores, seguindo, sou_eu, is_seguindo_voce, is_seguindo, idade, id_usuario, posts, foto, capa, receitas } = this.props.user;
        return (
            <View style={styles.viewPerfil}>
                <View style={styles.capaUsuario}>
                    <View style={[styles.capaUsuario, {backgroundColor: 'rgba(0, 0, 0, .4)',  zIndex: 2, alignItems: 'flex-end'}]}>
                        {this.renderBotaoAlterarCapa(sou_eu)}
                    </View>
                    <Image resizeMethod="resize" source={{uri: capa ? capa : ""}} style={{flex: 1, zIndex: 1, height: undefined, width: undefined}}/>
                </View>
                <View style={styles.viewInfo}>
                    <TouchableOpacity style={styles.viewFoto} onPress={() => this.validarAlteracaoFoto()}>
                        <Image resizeMethod="resize" style={styles.foto} source={{uri: foto ? foto : ""}}/>
                        {this.renderCamerazinha(sou_eu)}
                    </TouchableOpacity>
                    <Text style={styles.nome}>{nome}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 30}}>
                        {this.renderDescricao()}
                    </View>
                    {this.renderBotaoSeguir()}
                    <View style={styles.tabs}>
                        <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="utensils" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>PRATOS</Text>
                            </View>
                            <Text style={styles.tabTexto}>{posts}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.push("Seguidores", { id_usuario_perfil: id_usuario})} style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="chart-line" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUIDORES</Text>
                            </View>
                            <Text style={styles.tabTexto}>{seguidores}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.push("Seguindo", { id_usuario_perfil: id_usuario})} style={styles.tab}>
                            <View style={styles.infoTab}>
                                {/* <Icon name="running" size={15} color="#aaa"/> */}
                                <Text style={styles.tabTitulo}>SEGUINDO</Text>
                            </View>
                            <Text style={styles.tabTexto}>{seguindo}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {this.renderViewReceitas(receitas)}

                <View style={styles.fotos}>
                    <View style={styles.tabsFotos}>
                        <TouchableOpacity style={styles.tabFotos} activeOpacity={1}>
                            <Icon name="grip-horizontal" solid size={22} style={[this.state.tabSelecionada == 0 ? {color: '#000'} : {color: '#000'}]}/>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 1})}>
                            <Icon name="star" solid size={22} style={[this.state.tabSelecionada == 1 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 2})}>
                            <Icon name="user" solid size={22} style={[this.state.tabSelecionada == 2 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        );
    }

    validarAlteracaoFoto(){
        if (this.props.user.sou_eu){
            this.setState({
                modal: {
                    visible: true,
                    titulo: "Foto de Perfil",
                    subTitulo: "O que deseja fazer com sua foto de perfil?",
                    botoes: this.criarBotoes()
                }
            })
        } else {
            this.setState({
                modalFotoVisible: true
            })
        }
    }

    renderDescricaoRestaurante(color = '#000'){
        if (this.props.user.descricao){
            return <Text style={[styles.descricaoRestaurante, {color: color}]}>{this.props.user.descricao}</Text>;
        }
        return <Text style={[styles.descricaoRestaurante, {color: color}]}>Conheça o {this.props.user.nome}!</Text>;
    }

    renderInfoPerfilRestaurante(){
        let { nome, descricao, seguidores, seguindo, sou_eu, is_seguindo_voce, is_seguindo, id_usuario, posts, foto, cor_texto, cor_fundo, capa, telefone, ddd } = this.props.user;
        let background = cor_fundo ? '#' + cor_fundo : '#fff';
        let color = cor_texto ? '#' + cor_texto : '#000';
        return (
            <View key={id_usuario} style={styles.viewPerfilRestaurante}>
                {/* <StatusBar backgroundColor={background} /> */}
                <View style={styles.capa}>
                    <View style={[styles.capa, {backgroundColor: 'rgba(0, 0, 0, .4)',  zIndex: 2, alignItems: 'flex-end'}]}>
                        {this.renderBotaoAlterarCapa(sou_eu)}
                    </View>
                    <Image resizeMethod="resize" source={{uri: capa ? capa : ""}} style={{flex: 1, zIndex: 1, height: undefined, width: undefined}}/>
                </View>

                {/*começo do perfil*/}
                <View style={styles.viewInfoRestaurante}>
                
                    <View style={styles.viewInfoContato}>
                        <TouchableOpacity onPress={() => this.setState({infoRestauranteVisible: true})} style={styles.infoContato}><Icon name="info" size={18} solid color="#fff"/></TouchableOpacity>
                        <TouchableOpacity style={{height: 105, width: 105, borderRadius: 105/2, overflow: 'hidden'}} onPress={() => this.validarAlteracaoFoto()}>
                            <Image resizeMethod="resize" style={{height: 105, width: 105, borderRadius: 105/2, backgroundColor: '#eee'}} source={{uri: foto ? foto : ""}}/>
                            {this.renderCamerazinha(sou_eu)}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${ddd}${telefone}`)} style={styles.infoContato}><Icon name="phone" size={18} solid color="#fff"/></TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{position: 'absolute', top: -10, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <AutoHeightImage source={require('../../assets/imgs/folhinha_da_macunha.png')}  width={30}/>
                        </View>
                    </View>

                    <Text style={styles.tituloRestaurante}>{nome}</Text>
                    {this.renderLocalizacao()}

                    <View style={[styles.modalInfoRestaurante, {backgroundColor: background}, [background ? {borderColor: background} : {}]]}>
                        <View style={[styles.barraDescricaoRestaurante, [background ? {borderBottomColor: background} : {}]]}>
                            {this.renderDescricaoRestaurante(color)}
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            {this.renderBotaoSeguir(color)}
                        </View>
                        <View style={styles.tabs}>
                            <View style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                                <View style={styles.infoTab}>
                                    {/* <Icon name="utensils" size={15} color="#aaa"/> */}
                                    <Text style={[styles.tabTitulo, {color: color}]}>PRATOS</Text>
                                </View>
                                <Text style={[styles.tabTexto, {color: color}]}>{posts}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.push("Seguidores", { id_usuario_perfil: id_usuario})} style={[styles.tab, {borderRightColor: '#ddd', borderRightWidth: 1}]}>
                                <View style={styles.infoTab}>
                                    {/* <Icon name="chart-line" size={15} color="#aaa"/> */}
                                    <Text style={[styles.tabTitulo, {color: color}]}>SEGUIDORES</Text>
                                </View>
                                <Text style={[styles.tabTexto, {color: color}]}>{seguidores}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.push("Seguindo", { id_usuario_perfil: id_usuario})} style={styles.tab}>
                                <View style={styles.infoTab}>
                                    {/* <Icon name="running" size={15} color="#aaa"/> */}
                                    <Text style={[styles.tabTitulo, {color: color}]}>SEGUINDO</Text>
                                </View>
                                <Text style={[styles.tabTexto, {color: color}]}>{seguindo}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                
                </View>


                <View style={styles.fotos}>
                    <View style={styles.tabsFotos}>
                        <TouchableOpacity style={styles.tabFotos} activeOpacity={1}>
                            <Icon name="grip-horizontal" solid size={22} style={[this.state.tabSelecionada == 0 ? {color: '#000'} : {color: '#000'}]}/>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 1})}>
                            <Icon name="star" solid size={22} style={[this.state.tabSelecionada == 1 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabFotos} onPress={() => this.setState({tabSelecionada: 2})}>
                            <Icon name="user" solid size={22} style={[this.state.tabSelecionada == 2 ? {color: '#27ae60'} : {color: '#777'}]}/>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        );
    }

    renderBolinha(status_funcionamento){
        if (!this.props.user.tem_horario) return null;
        if (status_funcionamento == 'ABERTO'){
            return <View style={[styles.bola, styles.bolaVerde]}></View>
        } else if (status_funcionamento == 'FECHOU' || status_funcionamento == 'NAO_ABRIU'){
            return <View style={[styles.bola, styles.bolaVermelha]}></View>
        } else return null;

    }

    renderStatusFuncionamento(status_funcionamento){
        if (!this.props.user.tem_horario) return null;
        if (status_funcionamento == 'ABERTO'){
            return <Text style={[styles.textoStatus, styles.textoAberto]}>Aberto</Text>
        } else if (status_funcionamento == 'FECHOU' || status_funcionamento == 'NAO_ABRIU'){
            return <Text style={[styles.textoStatus, styles.textoFechado]}>Fechado</Text>
        } else return null;
    }

    renderTextoHorario(status_funcionamento){
        if (!this.props.user.tem_horario) return <Text style={styles.horarioRestaurante}>Sem informação de horário</Text>
        if (status_funcionamento == 'ABERTO'){
            return <Text style={styles.horarioRestaurante}>Fecha às {this.props.user.horario_fechamento}</Text>
        } else if (status_funcionamento == 'FECHOU'){
            return <Text style={styles.horarioRestaurante}>Fechou às {this.props.user.horario_fechamento}</Text>
        } else if (status_funcionamento == 'NAO_ABRIU'){
            return <Text style={styles.horarioRestaurante}>Abre às {this.props.user.horario_abertura}</Text>
        } else {
            return <Text style={styles.horarioRestaurante}>Sem informação de horário</Text>
        }
    }

    renderModalRestaurante(){
        if (this.props.user.is_restaurante){
            return (
                <Modal
                    
                  animationType="slide"
                    transparent={true}
                    visible={this.state.infoRestauranteVisible}
                    onRequestClose={() => {
                        this.setState({infoRestauranteVisible: false})
                    }}
                    >
                    <TouchableOpacity onPress={() => this.setState({infoRestauranteVisible: false})} style={{flex: 1}}>
                    
                    </TouchableOpacity>
                    <View style={styles.informacoesRestaurante}>
                        <View style={[styles.row, styles.paddingInfoRestaurante, styles.headerInfoRestaurante]}>
                            <View style={[styles.column, {flex: 1}]}>
                                <View style={[styles.row, styles.alignCenter]}>
                                    <Text style={styles.tituloHeaderRestaurante}>{this.props.user.nome}</Text>
                                    {this.renderBolinha(this.props.user.status_funcionamento)}
                                    {this.renderStatusFuncionamento(this.props.user.status_funcionamento)}
                                </View>
                                <View style={[styles.row, styles.alignCenter, {marginTop: 10}]}>
                                    <Icon name="clock" size={15} color="#222" solid/>
                                    {this.renderTextoHorario(this.props.user.status_funcionamento)}
                                </View>
                                <View style={[styles.row, styles.alignCenter, {marginTop: 5}]}>
                                    <Icon name="map-marker-alt" size={15} color="#222" solid/>
                                    <Text style={styles.enderecoRestaurante}>{this.props.user.endereco.logradouro}{this.props.user.endereco.numero ? ',' : ''} {this.props.user.endereco.numero}</Text>
                                </View>
                            </View>
                            {/* <View style={styles.viewFotoRestauranteInfo}>
                                <Image resizeMethod="resize" source={{uri: this.props.user.foto ? this.props.user.foto : ""}} style={styles.imagemRestauranteInfo}/>
                            </View> */}
                            <View style={styles.botaoFecharInfoRestaurante}>
                                <TouchableOpacity onPress={() => this.setState({infoRestauranteVisible: false})}>
                                    <Icon name="times" color="#222" size={24}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.column, styles.paddingInfoRestaurante, styles.viewSobreRestaurante]}>
                            <Text style={styles.tituloSobreRestaurante}>Sobre</Text>
                            <Text style={styles.sobreRestaurante}>{this.props.user.sobre}</Text>
                        </View>
                    </View>
                </Modal>
            );
        }
        return null;
    }

}

const styles = {

    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column'
    },
    bola: {
        height: 6,
        width: 6,
        borderRadius: 6/2,
        marginHorizontal: 7
    },
    bolaVerde: {
        backgroundColor: '#28b657',
    },
    bolaVermelha: {
        backgroundColor: '#DC143C'
    },
    paddingInfoRestaurante: {
        paddingHorizontal: 25,
        paddingVertical: 15
    },
    alignCenter: {
        alignItems: 'center'
    },

    viewPerfil: {
        paddingTop: 20
    },
    viewInfo: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 55,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    viewFoto: {
        height: 85,
        width: 85,
        borderRadius: 85/2,
        elevation: 30,
        backgroundColor: '#eee',
        overflow: 'hidden'
    },
    foto: {
        height: 85,
        width: 85,
        borderRadius: 85/2
    },
    camerazinhaFoto: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, height: 30,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10
    },
    descricao: {
        marginTop: 5,
        color: '#000',
        fontSize: 13,
        textAlign: 'center'
    },
    botaoEditar: {
        marginTop: 10,
        width: 140,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        flexDirection: 'row'
    },
    textoBotaoEditar: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold'
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tab: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
    },
    infoTab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3
    },
    tabTitulo: {
        fontSize: 9,
        color: '#aaa',
        marginLeft: 5,
        letterSpacing: 1.1
    },
    tabTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222'
    },
    viewReceitas: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewInfoReceitas: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 25
    },
    tituloReceitas: {
        fontSize: 20,
        color: '#333',
    },
    subTituloReceitas: {
        fontSize: 12,
        color: '#aaa',
    },
    receitas: {
        flex: 1,
        flexDirection: 'row',
    },
    receita: {
        flexDirection: 'column',
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bolaReceita: {
        height: 30,
        width: 30,
        borderRadius: 30/2,
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fotoReceita: {
        height: 30,
        width: 30,
        borderRadius: 30/2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff'
    },
    textoReceita: {
        fontSize: 12,
        color: '#000',
        marginTop: 5
    },
    botaoCriarReceita: {
        backgroundColor: '#28b657',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 7,
        borderRadius: 4
    },
    textoCriarReceita: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold'
    },
    fotos: {
        flexDirection: 'column',
    },
    tabsFotos: {
        flex: 1,
        flexDirection: 'row',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    tabFotos: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },










    //RESTAURANTE

    viewPerfilRestaurante: {
        paddingTop: 30
    },
    capa: {
        position: 'absolute',
        height: 250,
        left: 0,
        top: 0,
        right: 0,
        backgroundColor: '#fff'
    },
    capaUsuario: {
        position: 'absolute',
        height: 120,
        left: 0,
        top: 0,
        right: 0,
        backgroundColor: '#fff'
    },
    viewInfoRestaurante: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    viewInfoContato: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoContato: {
        width: 35,
        height: 35,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, .4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    tituloRestaurante: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 15
    },
    localizacao: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    modalInfoRestaurante: {
        flexDirection: 'column',
        marginVertical: 10,
        paddingBottom: 10,
        width: imageWidth/10 * 9,
        borderWidth: 1,
        elevation: 5,
        shadowOffset:{  width: .5,  height: .5,  },
        shadowColor: 'black',
        shadowOpacity: .2,
        
    },
    barraDescricaoRestaurante: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderBottomWidth: 1,
        elevation: 5,
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
    },
    descricaoRestaurante: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },






    //INFO BAIXO RESTAURANTE
    informacoesRestaurante: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, backgroundColor: '#fff',
        zIndex: 9999,
        borderTopLeftRadius: 35, borderTopRightRadius: 35,
        elevation: 30,
        shadowOffset:{  width: .5,  height: .5,  },
        shadowColor: 'black',
        shadowOpacity: .5,
    },
    headerInfoRestaurante: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    tituloHeaderRestaurante: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000'
    },
    textoStatus: {
        fontWeight: 'bold',
        fontSize: 14
    },
    textoAberto: {
        color: '#28b657',
    },
    textoFechado: {
        color: '#DC143C',
    },
    horarioRestaurante: {
        fontSize: 14,
        marginLeft: 10,
        color: '#222'
    },
    enderecoRestaurante: {
        fontSize: 14,
        marginLeft: 10,
        color: '#222'
    },
    viewFotoRestauranteInfo: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    imagemRestauranteInfo: {
        height: 60,
        width: 60,
        borderRadius: 4
    },
    botaoFecharInfoRestaurante: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingLeft: 25
    },
    viewSobreRestaurante: {
        paddingBottom: 50,
        paddingTop: 10
    },
    tituloSobreRestaurante: {
        fontSize: 22,
        color: '#222',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sobreRestaurante: {
        color: '#777',
        fontSize: 13,
        lineHeight: 20
    }



}