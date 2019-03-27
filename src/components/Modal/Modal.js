import React, {Component} from 'react';
import { Modal, Text, View, TouchableOpacity, Animated } from 'react-native';

/* Modal parameters:

    titulo: "Título do modal",
    subTitulo: "SubTítulo do modal",
    onClick: this.funcaoAoFecharModal(),
    botoes?: [
        {texto: 'Texto do primeiro botão', onPress?: this.funcaoAoClicar(), color?: '#27ae60', fontWeight?: 'bold'},
        {texto: 'Texto do segundo botão', onPress: this.funcaoAoClicar()}
    ]



*/
export default class Modalzin extends Component {

    renderBotoes(){
        if (this.props.botoes && this.props.botoes.length > 0){
            return this.props.botoes.map((botao, index) => {
                let color = botao.color ? botao.color : '#444';
                let fontWeight = botao.fontWeight ? botao.fontWeight : 'normal';
                let key = botao.chave ? botao.chave : index;
                return (
                    <TouchableOpacity key={key} activeOpacity={0.4} style={styles.botao}
                        onPress={() => {
                            this.props.onClick(key);
                        }}>
                        <Text style={[styles.textoBotao,  {color, fontWeight}]}>{botao.texto}</Text>
                    </TouchableOpacity>
                );
            })
        } else {
            let textoBotao = this.props.textoBotao ? this.props.textoBotao : 'Ok';
            return (
                <TouchableOpacity activeOpacity={0.4} style={styles.botao}
                    onPress={() => {
                    this.props.onClose();
                    }}>
                    <Text style={styles.textoBotao}>{textoBotao}</Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <View >
                <Modal
                    onPress={() => {this.props.onClose()}}
                  animationType="fade"
                    transparent={true}
                    visible={this.props.visible}
                    onRequestClose={() => {
                        this.props.onClose()
                    }}
                    >
                    <Animated.View style={[styles.inside]}>
                        <Animated.View style={[styles.modal]}>
                            <View style={[styles.viewTitulo, styles.paddingHorizontal]}>
                                <Text style={styles.titulo}>{this.props.titulo}</Text>
                            </View>
                            <View style={[styles.viewInfo, styles.paddingHorizontal]}>
                                <Text style={styles.info}>{this.props.subTitulo}</Text>
                            </View>

                            <View style={styles.viewBotoes}>
                                {this.renderBotoes()}
                            </View>


                        </Animated.View>
                    </Animated.View>
                </Modal>
            </View>
        );
    }
}

const styles = {
    inside: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)',
        paddingHorizontal: 45,
    },
    modal: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        backgroundColor: '#fff',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
        borderRadius: 5
    },
    paddingHorizontal: {
        paddingHorizontal: 15
    },
    viewTitulo: {
        paddingTop: 20,
        paddingBottom: 5
    },
    titulo: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 7,
        textAlign: 'center'
    },
    viewInfo: {
        paddingBottom: 20,
    },
    info: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center'
    },
    viewBotoes: {
        flexDirection: 'column',
    },
    botao: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    },
    textoBotao: {
        fontSize: 17,
        textAlign: 'center',
        color: '#444'
    },
    corPadrao: {
        color: '#27ae60'
    },
    bold: {
        fontWeight: 'bold'
    }
}