import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';
import { ScrollView } from 'react-native-gesture-handler';
import Novidade from './Novidade';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Novidades extends Network {

    constructor(props){
        super(props);
        this.state = {
            data: this.props.data,
            navigation: this.props.navigation,
            novidades: [
                {titulo: 'Café da Manhã', filtro: 'cafedamanha', selecionado: false},
                {titulo: 'Almoço', filtro: 'almoco', selecionado: false},
                {titulo: 'Jantar', filtro: 'jantar', selecionado: false},
                {titulo: 'Salada', filtro: 'salada', selecionado: false},
                {titulo: 'Legumes', filtro: 'legumes', selecionado: false},
            ]
        }
    }

    async getNovidades(){
        let result = await this.callMethod("getNovidades");
        if (result.success){
            this.setState({
                novidades: result.result
            })
        }
    }

    renderNovidades(){
        return this.state.novidades.map((novidade) => {
            return (
                <Novidade key={novidade.filtro} novidade={novidade}/>
            );
        })
    }

    render(){
        let larguraImagem = imageWidth;
        let { navigation } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ScrollView horizontal={true} contentContainerStyle={{flexGrow: 1}} style={{paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
                    <Text style={{alignSelf: 'flex-start', color: '#000', fontSize: 25, fontWeight: 'bold', marginHorizontal: 10}}>Filtrar</Text>
                    {this.renderNovidades()}
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    container: {
        flexDirection: 'column',
        borderBottomColor: '#e4e4e4',
        borderBottomWidth: 1,
    },
}