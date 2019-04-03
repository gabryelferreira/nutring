import React, {Component} from 'react';
import { Modal, Text, View, TouchableOpacity, Image } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/FontAwesome5';

/* Modal parameters:

    titulo: "Título do modal",
    subTitulo: "SubTítulo do modal",
    onClick: this.funcaoAoFecharModal(),
    botoes?: [
        {texto: 'Texto do primeiro botão', onPress?: this.funcaoAoClicar(), color?: '#27ae60', fontWeight?: 'bold'},
        {texto: 'Texto do segundo botão', onPress: this.funcaoAoClicar()}
    ]



*/
export default class ModalPostagemViewer extends Component {

    formatImages(images){
        if (!images) return null;
        return images.map(image => {
            return {url: image}
        })
    }

    renderHeader(index){
        return (
            <View>
                <View style={{height: 38, width: 38, borderRadius: 38/2, backgroundColor: '#000'}}>
                    <Image resizeMethod="resize" style={{height: 38, width: 38, borderRadius: 38/2, position: 'absolute', left: 0, top: 0}} source={{uri: foto}}/>
                </View>
            </View>
        );
    }

    renderPessoas(pessoas){
        if (!pessoas) return null;
        return pessoas.map(pessoa => {
            return (
                <View key={pessoa.id_usuario} style={styles.pessoa}>
                    <View style={{width: 20, height: 20, borderRadius: 20/2, backgroundColor: '#000'}}>
                        <Image resizeMethod="resize" source={{uri: pessoa.foto}} style={{width: 20, height: 20, borderRadius: 20/2}}/>
                    </View>
                </View>
            );
        })
    }
    

    render() {
        return (
            <Modal visible={this.props.visible}
                    animationType="fade"
                    onRequestClose={() => {
                        this.props.onClose()
                    }}>
                    <View style={{flex: 1, backgroundColor: '#000'}}>
                        <View style={styles.detalhes}>
                            <View style={styles.viewTitulos}>
                                <View style={{height: 38, width: 38, borderRadius: 38/2, backgroundColor: '#000', marginRight: 10}}>
                                    <Image resizeMethod="resize" style={{height: 38, width: 38, borderRadius: 38/2, position: 'absolute', left: 0, top: 0}} source={{uri: this.props.foto}}/>
                                </View>
                                <Text style={styles.tituloDetalhes}>{this.props.titulo}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.onClose()} style={{alignItems: 'center', justifyContent: 'center', padding: 5}}>
                                <Icon name="times" solid color="#fff" size={18}/>
                            </TouchableOpacity>
                        </View>
                        <ImageViewer imageUrls={this.formatImages(this.props.imagens)}
                                    onSwipeDown={this.props.onSwipeDown}
                                    enableSwipeDown={true}
                                    enableImageZoom={true}
                                    swipeDownThreshold={230}
                                    renderIndicator={() => null}/>
                    </View>
            </Modal>
        );
    }

}

const styles = {
    tabs: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    tab: {
        marginRight: 10
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
        top: -10
    },
    labelCurtidasBottom: {
        bottom: 0
    },
    textoLabelCurtidas: {
        color: '#fff',
        fontSize: 10
    },
    pessoas: {
        marginTop: 10,
        marginRight: 30,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pessoa: {
        width: 10,
        elevation: 2
    },
    

    detalhes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    viewTitulos: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewFoto: {
        width: 58,
        alignItems: 'center'
    },
    tituloDetalhes: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
}