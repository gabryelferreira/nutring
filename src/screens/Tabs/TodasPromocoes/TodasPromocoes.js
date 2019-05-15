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

  constructor(props){
    super(props);
    this.state = {
        scrollY: new Animated.Value(0)
    }
  }

  componentDidMount(){
    // this.getNotificacoes();
  }

  render() {

    // const headerHeight = this.state.scrollY.interpolate({
    //     inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    //     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    //     extrapolate: 'clamp'
    // });

    // const headerColor = this.state.scrollY.interpolate({
    //     inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    //     outputRange: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)']
    // });

    const pictureOpacity = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: [1, 0]
    });

    const elevation = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 0.01, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    });


    const headerBackgroundColor = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 0.01, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']
    });

    const headerColorOpacity = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 0.01, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: [0, 0, 1]
    });

    const headerColor = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 0.01, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: ['#fff', '#fff', '#000']
    });
    
    const textOpacity = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: [1, 0.2],
        extrapolate: 'clamp'
    });

    const AnimatedIcon = Animated.createAnimatedComponent(Icon)
    
        return (
            <SafeAreaView style={{flex: 1}}>
                <Animated.View style={{position: 'absolute', paddingHorizontal: 5, zIndex: 9999, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', left: 0, top: 0, right: 0, height: HEADER_HEIGHT, width: imageWidth, backgroundColor: headerBackgroundColor, elevation}}>
                    <AnimatedIcon name="chevron-left" size={22} style={{paddingLeft: 10, paddingRight: 10}} color={headerColor} onPress={() => this.props.navigation.goBack(null)}/>
                    <Animated.Text style={{fontSize: 16, fontWeight: 'bold', color: headerColor, opacity: headerColorOpacity}}>Promoções</Animated.Text>
                    <AnimatedIcon name="search" size={22} style={{paddingLeft: 10, paddingRight: 10}} color={headerColor} onPress={() => navigation.goBack(null)}/>
                </Animated.View>
                <Animated.View style={{width: imageWidth, height: PICTURE_MAX_HEIGHT, position: 'absolute', left: 0, right: 0, top: 0, zIndex: 1}}>
                    <Image resizeMethod="resize" style={{flex: 1, width: undefined, height: undefined}} source={require('../../../assets/imgs/promocoes.jpg')}/>
                    {/* <Text style={{position: 'absolute', left: 30, bottom: textBottom, color: '#fff', fontSize: 30, fontWeight: 'bold'}}>Promoções</Text> */}
                </Animated.View>
                
                <ScrollView style={{height: 1000, zIndex: 3}}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                y: this.state.scrollY
                            }
                        }
                    }]
                    )}>
                    <View style={{marginTop: PICTURE_MAX_HEIGHT, paddingBottom: 15, backgroundColor: '#fff'}}>
                        <Animated.Text style={{position: 'absolute', left: 20, top: -55, color: '#fff', fontSize: 30, fontWeight: 'bold', opacity: textOpacity}}>Promoções</Animated.Text>
                        <Text style={[styles.titulo, styles.paddingHorizontal]}>De Hoje</Text>
                        <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                        </ScrollView>

                        <Text style={[styles.titulo, styles.paddingHorizontal]}>Da Semana</Text>
                        <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 10}} showsHorizontalScrollIndicator={false}>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
                            <CardTwo key={"restaurante1"} imagem={'https://img.itdg.com.br/tdg/images/blog/uploads/2017/01/shutterstock_283021049.jpg'} nome={"Let's Wok"} descricao={'10% de DESCONTO no filé de frango + acompanhamentos, SÓ HOJE'}/>
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


                    </View>


                </ScrollView>
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