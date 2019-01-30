import React, {Component} from 'react';
import {Animated, TouchableHighlight, View, Modal, StatusBar} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Camera from '../Camera/Camera';
const SIZE = 45;

class NutringAddButton extends Component {

    state = {
        visible: false
    }


    abrirCamera(){

    }


    render() {
        return (
            // <View style={{
            //     position: 'absolute',
            //     top: -22,
            //     backgroundColor: '#27ae60',
            //     paddingVertical: 7,
            //     paddingHorizontal: 10,
            //     borderRadius: 80
            // }}>
            <View>
                
                <Modal
                visible={this.state.visible}
                onRequestClose={() => {
                    this.setState({visible: false})
                }}
                
                >
                <StatusBar hidden />
                    <Camera onClose={() => this.setState({visible: false})}/>
                </Modal>
                    <View style={{
                        alignItems: 'center',
                    }}>
                        <View>
                            <Icon onPress={() => this.setState({visible: true})} style={{paddingHorizontal: 25, paddingVertical: 10}} name="camera" size={22} color="#c7c7c7"/>
                        </View>
                    </View>
            </View>
        );
    }
}
export default NutringAddButton;