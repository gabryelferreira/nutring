import React, { Component } from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Network from '../../network';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class FotoPerfil extends Network {

    constructor(props){
        super(props);
        this.state = {
            index: this.props.index,
            data: this.props.data,
            carregando: this.props.carregando
        }
    }

    render(){
        return this.returnFoto();
    }

    returnFoto(){
        if (this.state.carregando){
            return null;
        }
        let index = this.props.index;
        let { url_conteudo, id_post } = this.state.data;
        if (index % 3 == 0){
            return (
                <TouchableOpacity style={{width: imageWidth / 3, height: imageWidth / 3, flexWrap: 'wrap', marginBottom: 2}} onPress={this.props.onPress}>
                    <View style={{flex: 1, backgroundColor: '#eee'}}>
                        <Image resizeMethod="resize" source={{uri: url_conteudo}} style={{flex: 1, height: undefined, width: undefined}}/>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={{width: imageWidth / 3, height: imageWidth / 3, flexWrap: 'wrap', paddingLeft: 2, marginBottom: 2}} onPress={this.props.onPress}>
                <View style={{flex: 1, backgroundColor: '#eee'}}>
                    <Image resizeMethod="resize" source={{uri: url_conteudo}} style={{flex: 1, height: undefined, width: undefined}}/>
                </View>
            </TouchableOpacity>
        );
    }

}