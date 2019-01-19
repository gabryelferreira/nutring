import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ImagemNutring from '../../../components/ImagemNutring/ImagemNutring';
import Loader from '../../../components/Loader/Loader';
import Modalzin from '../../../components/Modal/Modal';
import Network from '../../../network';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Comentario from '../../../components/Comentario/Comentario';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class Comentarios extends Network {


    static navigationOptions = {
        title: 'Comentários',
        tabBarVisible: false
    };

    render(){
        return (      
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
                    <Comentario/>
                    <Comentario/>
                    <Comentario/>
                    
                </ScrollView>
                <View style={styles.caixaTexto}>
                        <TextInput
                            placeholder="Escreva um comentário"
                            placeholderTextColor="rgb(153, 153, 153)"
                            style={styles.caixaTextoComentario}
                        />
                    <View style={styles.botaoEnviar}>
                        <Icon name="rocket" size={16} color="#F8F8F8"/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    caixaTexto: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 10,
        alignItems: 'center',
        background: '#fff',
    },
    caixaTextoComentario: {
        height: 40,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
    },
    botaoEnviar: {
        backgroundColor: '#27ae60',
        height: 40,
        width: 40,
        borderRadius: 40/2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    }
}