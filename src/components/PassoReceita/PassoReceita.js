import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class PassoReceita extends Component {

    renderFoto(foto){
        return <Image resizeMethod="resize" source={{uri: foto}} style={styles.imagem}/>
    }

    render(){
        console.log("passo atual = ", this.props.data);
        let { foto, titulo, descricao } = this.props.data;
        return (
            // <View style={{flex: 1}}>
            //     <View style={styles.viewImagem}>
            //         {this.renderFoto(foto)}
            //     </View>
            //     <View style={styles.container}>
            //         <Text style={styles.passo}>Passo {this.props.index + 1}</Text>
            //         <Text style={styles.titulo}>{titulo}</Text>
            //         <Text style={styles.descricao}>{descricao}</Text>
            //     </View>
            // </View>

            <View style={{flex: 1, zIndex: 9999}}>
                <View style={styles.container}>
                    <View style={styles.viewImagem}>
                        {this.renderFoto(foto)}
                    </View>
                    {/* <View style={styles.viewTextos}>
                        <Text style={styles.titulo}>{titulo}</Text>
                        <Text style={styles.passo}>Passo {this.props.index + 1}</Text>
                        <Text style={styles.descricao}>{descricao}</Text>
                    </View> */}
                </View>
            </View>
        );
    }

}

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    viewImagem: {
        flex: 1,
        backgroundColor: '#eee'
    },
    imagem: {
        flex: 1,
        width: null,
        height: null
    },
    viewTextos: {
        flex: .3,
        paddingHorizontal: 20,
        paddingTop: 20,
        transform: [
            {translateY: -25}
        ],
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#fff',
    },
    passo: {
        fontSize: 18,
        color: '#000'
    },
    titulo: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    descricao: {
        fontSize: 14,
        color: '#777',
        marginTop: 20,
        textAlign: 'left'
    },
}