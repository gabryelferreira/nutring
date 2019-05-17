import React, { Component } from 'react';
import { View, Animated, ScrollView, TouchableOpacity, Text, Image, Button, Modal, FlatList, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import SearchBar from '../../../components/SearchBar/SearchBar';
import SearchButton from '../../../components/SearchBar/SearchBarButton';
import CardTwo from '../../../components/Card/CardTwo';
import SemDadosPerfil from '../../../components/SemDadosPerfil/SemDadosPerfil';
import SemDados from '../../../components/SemDados/SemDados';
import Item from '../../../components/Item/Item';
import ScrollViewWithAnimatedHeader from '../../../components/ScrollViewWithAnimatedHeader/ScrollViewWithAnimatedHeader';


const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;

HEADER_HEIGHT = 50;
PICTURE_MAX_HEIGHT = 240;
PICTURE_MIN_HEIGHT = 50;

export default class TodasPromocoes extends Network {

    static navigationOptions = () => ({
        title: 'Promoções',
        headerBackTitle: "",
        header: (
            <View></View>
        )
    });

    limit = 10;
    promocoesDoDia = [];
    promocoesDaSemana = [];


    constructor(props){
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            loadingInitial: true,
            promocoesDoDia: [],
            promocoesDaSemana: []
        }
    }

    componentDidMount(){
        // this.getNotificacoes();
        this.getPromocoesDoDia();
    }

    async getPromocoesDoDia(){
        let result = await this.callMethod('getPromocoesDoDia', { limit: this.limit, offset: 0 });
        if (result.success){
            this.promocoesDoDia = result.result;
            this.getPromocoesDaSemana();
        }
    }

    async getPromocoesDaSemana(){
        let result = await this.callMethod('getPromocoesDaSemana', { limit: this.limit, offset: 0 });
        if (result.success){
        this.promocoesDaSemana = result.result;
        this.setState({
            promocoesDoDia: this.promocoesDoDia,
            promocoesDaSemana: this.promocoesDaSemana,
            loadingInitial: false
        });
        }
    }

    renderPromocoesDoDia(){
        return this.state.promocoesDoDia.map(promocao => {
            return <CardTwo onPress={() => this.props.navigation.navigate("Promocao", { id_promocao: promocao.id_promocao })} key={promocao.id_promocao.toString()} imagem={promocao.foto_promocao} nome={promocao.nome} descricao={promocao.descricao}/>
        })
    }

    renderPromocoesDaSemana(){
        return this.state.promocoesDaSemana.map(promocao => {
            return <CardTwo key={promocao.id_promocao.toString()} imagem={promocao.foto_promocao} nome={promocao.nome} descricao={promocao.descricao}/>
        })
    }

    renderFullLoader(){
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
                <ActivityIndicator size="small" color="#777" />
            </View>
        );
    }

    renderContent(){
        if (this.state.loadingInitial) return this.renderFullLoader();

        return (
            <>
                <Text style={[styles.titulo, styles.paddingHorizontal]}>De Hoje</Text>
                <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
                    {this.renderPromocoesDoDia()}
                </ScrollView>

                <Text style={[styles.titulo, styles.paddingHorizontal]}>Da Semana</Text>
                <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
                    {this.renderPromocoesDaSemana()}
                </ScrollView>

                <Text style={[styles.titulo, styles.paddingHorizontal]}><Text style={{fontWeight: 'normal'}}>Restaurante</Text> Destaque</Text>
                <View style={{flex: 1, paddingHorizontal: 15, paddingVertical: 10}}>
                    <TouchableOpacity style={{flex: 1, borderRadius: 10, elevation: 1, overflow: 'hidden'}}>
                        <Image resizeMethod="resize" style={{flex: 1, width: undefined, height: 200}} source={require('../../../assets/imgs/promocoes.jpg')}/>
                        <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>Obba Gastronomia Saudável</Text>
                            <Text style={{fontSize: 14, fontWeight: 'normal', color: '#000'}}>Parabéns por ser o restaurante destaque da semana!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    render() {
        
        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollViewWithAnimatedHeader title={"Promoções"} onGoBack={() => this.props.navigation.goBack(null)}>
                    {this.renderContent()}
                </ScrollViewWithAnimatedHeader>
            </SafeAreaView> 
        );

    }


}

const styles = {
    titulo: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 25,
    },
    paddingHorizontal: {
        paddingHorizontal: 20
    }
}