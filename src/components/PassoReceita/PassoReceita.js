import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class PassoReceita extends Component {

    constructor(props){
        super(props);
        this.state = {
            carregandoImagem: true,
            altura: 0
        }
        
    }

    componentDidMount(){
        this.setState({
            carregandoImagem: true,
            altura: 0
        }, this.calcularHeight)
    }

    calcularHeight(){
        console.log("calculando altura fdp")
        this.setState({
            altura: 0
        })
        Image.getSize(this.props.data.foto, (width, height) => {
            let alturaIdeal = imageWidth * height / width;
            this.setState({altura: alturaIdeal}, console.log("aaaaaaa", alturaIdeal))
        });
    }

    renderFoto(foto){
        if (this.state.altura || !this.state.carregandoImagem){
            return (
                <View style={{flexDirection: 'row', flex: 1}}>
                    <ShimmerPlaceHolder
                        style={{flex: 1, height: this.state.altura}}
                        autoRun={true}
                        visible={!this.state.carregandoImagem}
                    >
                        <Image  onLoad={() => this.setState({ carregandoImagem: false })} resizeMethod="resize" source={{uri: foto}} style={{width: imageWidth, height: this.state.altura}}/>
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
        let { foto, titulo, descricao } = this.props.data;
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                <View style={styles.viewImagem}>
                    {this.renderFoto(foto)}
                </View>
                <View style={styles.container}>
                    <Text style={styles.passo}>Passo {this.props.index + 1}</Text>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={styles.descricao}>{descricao}</Text>
                </View>
            </ScrollView>
        );
    }

}

const styles = {
    viewImagem: {
        flexDirection: 'row',
        maxHeight: 250,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee'
    },
    container: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        flexDirection: 'column',
        alignItems: 'center'
    },
    passo: {
        fontSize: 18,
        color: '#000'
    },
    titulo: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center'
    },
    descricao: {
        fontSize: 16,
        color: '#000',
        marginTop: 20,
        textAlign: 'center'
    },
}