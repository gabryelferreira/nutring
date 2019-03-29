import React, {Component} from 'react';
import { TouchableHighlight, View, Modal, ScrollView, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Camera from '../../components/Camera/Camera';
import Network from '../../network';


class PostarPrato extends Component {

    state = {
        visible: false
    }


    render() {
        return (
            <View>
                
                <Modal 
                visible={this.state.visible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() => {
                    this.setState({visible: false})
                }}
                >
                    <Camera onClose={() => this.setState({visible: false})}/>
                </Modal>
                    <View style={{
                        alignItems: 'center',
                    }}>
                        <TouchableHighlight>
                            <Icon onPress={() => this.setState({visible: true})} style={{paddingHorizontal: 25, paddingVertical: 10}} name="plus" size={22} color="#c7c7c7"/>
                        </TouchableHighlight>
                    </View>
            </View>
        );
    }
}

const styles = {

    bold: {
        // fontWeight: 'bold'
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },

    opcao: {
        paddingVertical: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    foto: {
        width: 140,
        height: 140,
        borderRadius: 140/2,
        marginLeft: -50
    },
    textos: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20
    },
    titulo: {
        fontSize: 21,
        marginBottom: 7,
        fontWeight: 'bold',
        color: '#000'
    },
    descricao: {
        color: '#000',
        fontSize: 14,
        marginBottom: 7,
        lineHeight: 20
    },
    botao: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#666',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
        marginTop: 8,
        alignSelf: 'flex-start'
    },
    textoBotao: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 7
    },


}

export default PostarPrato;