import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Input from '../../../components/Input/Input';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const InicioHeader = () => {
    return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderWidth: 1, borderColor: '#eee', height: 30, width: 30, borderRadius: 30/2}}>
                <Image style={{height: 30, width: 30, borderRadius: 30/2, borderWidth: 1, borderColor: '#eee'}} source={require('../../../assets/imgs/eu.jpg')}/>
            </View>
            <AutoHeightImage style={{alignSelf: 'center'}} source={require('../../../assets/imgs/nutring-color.png')} width={110}/>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Icon style={{marginRight: 20}}
                    name="search"
                    size={17}
                    color='#27ae60' />
                <Icon
                    name="ellipsis-v"
                    size={17}
                    color='#27ae60' />
            </View>
        </View>
    );
}

export default class Inicio extends Component {

    static navigationOptions = {
        headerTitle: (
            <InicioHeader/>
        )
    };

    constructor(props){
        super(props);
    }

    cadastrar(){
        console.log("opa")
    }

    irParaLogin(){
        console.log("indo")
    }

    render(){
        let larguraImagem = imageWidth - 15*2 - imageWidth*0.2;
        return (
            <FlatList
                data={[{key: 'a'}, {key: 'b'}]}
                renderItem={({item}) => (
                    // <Text>{item.key}</Text>

                    <View style={styles.container}>
                        <View style={styles.viewFoto}>
                            <Image style={{height: 52, width: 52, borderRadius: 52/2}} source={require('../../../assets/imgs/eu.jpg')}/>
                        </View>
                        <View style={styles.viewInfoEConteudo}>
                            <View style={styles.viewInfo}>
                                <View style={styles.viewInfoTexto}>
                                    <Text style={styles.nome}>Gabryel Ferreira</Text>
                                    <Text style={styles.tempo}>30 min atrás</Text>
                                </View>
                                <View style={styles.viewInfoCurtidas}>
                                    <AutoHeightImage style={{marginRight: 7}} source={require('../../../assets/imgs/folha_nutring.png')} width={27}/>
                                    <Text style={styles.curtidas}>125</Text>
                                </View>
                            </View>
                            <View style={styles.viewInfoDescricao}>
                                <Text style={styles.texto}>Ela tira o pau da tcheca pra bota na boca, ela tira o pau da boca pra bota na tcheca</Text>
                            </View>
                            <View style={styles.viewImagem}>
                                <AutoHeightImage style={{borderRadius: 5}} source={require('../../../assets/imgs/foods/food4.jpg')} width={larguraImagem}/>
                            </View>
                        </View>
                    </View>

                )}
                />
        );
    }
}

const styles = {
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    viewFoto: {
        flex: .2,
        flexDirection: 'column',
        alignItems: 'center'
    },
    viewInfoEConteudo: {
        flex: .8,
        flexDirection: 'column',
    },
    viewInfo: {
        flexDirection: 'row'
    },
    viewInfoTexto: {
        flex: .7,
        flexDirection: 'column'
    },
    nome: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold'
    },
    tempo: {
        fontSize: 13,
        color: '#aaa'
    },
    viewInfoCurtidas: {
        flex: .3,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 3
    },
    curtidas: {
        fontSize: 17,
        color: '#aaa',
        fontWeight: 'bold'
    },
    viewInfoDescricao: {
        flexDirection: 'column'
    },
    texto: {
        marginTop: 15,
        fontSize: 15,
        color: '#000'
    },
    viewImagem: {
        marginTop: 10,
        flexDirection: 'row'
    }
}