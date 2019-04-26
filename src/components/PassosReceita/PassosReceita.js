import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, Image, TouchableOpacity, Animated, PanResponder } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import Icon from 'react-native-vector-icons/FontAwesome5';

import Swiper from 'react-native-swiper';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

export default class PassosReceita extends Component {

    //props
    swiperIndex = 0;

    constructor(props){
        super(props);
        this.position = new Animated.ValueXY();
        this.state = {
            titulo: "",
            descricao: ""
        }
    }

    componentWillMount(){
        this.panResponder = PanResponder.create({

            onStartShouldSetPanResponder: (e, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({ y: gestureState.dy })
            },
            onPanResponderRelease: (evt, gestureState) => {

            }

        })
    }

    componentDidMount(){
        this.setState({
            titulo: this.props.passos[0].titulo,
            descricao: this.props.passos[0].descricao,
        })
    }

    renderFoto = (foto) => {
        return <Image resizeMethod="resize" source={{uri: foto}} style={styles.imagem}/>
    }

    renderPassos = (passos) => {
        return passos.map((passo, index) => {
            return (
                <View key={index} style={{flex: 1, zIndex: 9999}}>
                    <View style={styles.container}>
                        <View style={styles.viewImagem}>
                            {this.renderFoto(passo.foto)}
                        </View>
                    </View>
                </View>
            );
        })
    }

    setSwiperIndex = (index) => {
        this.swiperIndex = index;
        this.setState({
            titulo: this.props.passos[index].titulo,
            descricao: this.props.passos[index].descricao,
        })
    }

    swipe = (targetIndex) => {
        const currentIndex = this.swiper.state.index;
        const offset = targetIndex- currentIndex;
        this.swiper.scrollBy(offset);
    }

    render(){
        let { passos, foto } = this.props;
        return (
            <View style={{flex: 1}}>
                <Swiper style={styles.wrapper}
                        ref={component => this.swiper = component}
                        onIndexChanged={(index) => this.setSwiperIndex(index)}
                        showsButtons={true}
                        loop={false}
                        dot={
                            <View style={styles.inactiveDot} />
                        }
                        activeDot={
                            <View style={styles.activeDot}/>
                        }
                        prevButton={
                            <TouchableOpacity style={styles.viewArrowSwiper} onPress={() => this.swipe(this.swiperIndex - 1)}>
                                <Icon name="chevron-left" color="#fff" solid size={26}/>
                            </TouchableOpacity>
                            // <View></View>
                        }
                        nextButton={
                            <TouchableOpacity style={styles.viewArrowSwiper} onPress={() => this.swipe(this.swiperIndex + 1)}>
                                <Icon name="chevron-right" color="#fff" solid size={26}/>
                            </TouchableOpacity>
                            // <View></View>
                        }>
                    {this.renderPassos(passos)}
                </Swiper>
                {/* 
                    ANIMAÇÃO AQUIII PANRESPONDER PAN RESPONDER GESTURE REACT-NATIVE GESTURE REACT NATIVE GESTURE PAN HANDLER PANHANDLER PAN-HANDLER
                <Animated.View style={[styles.viewTextos, this.position.getLayout()]} {...this.panResponder.panHandlers}>
                    <Text style={styles.titulo}>{this.state.titulo}</Text>
                    <Text style={styles.passo}>Passo {this.swiperIndex + 1}</Text>
                    <Text style={styles.descricao}>{this.state.descricao}</Text>
                </Animated.View> */}
                <View style={styles.viewTextos}>
                    <View style={[styles.row, styles.justifySpaceBetween]}>
                        <View style={[styles.flex, styles.paddingRight]}>
                            <Text numberOfLines={1} style={styles.titulo}>{this.state.titulo}</Text>
                            <Text style={styles.passo}>Passo {this.swiperIndex + 1}</Text>
                        </View>
                        <View style={styles.viewFotoReceita}>
                            <View style={styles.baixoFotoReceita}>
                                <Image resizeMethod="resize" style={styles.fotoReceita} source={{uri: foto}}/>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.descricao}>{this.state.descricao}</Text>
                </View>
            </View>
        );
    }

}

const styles = {
    row: {
        flexDirection: 'row'
    },
    justifySpaceBetween: {
        justifyContent: 'space-between'
    },
    viewFotoReceita: {
        width: 80,
    },
    baixoFotoReceita: {
        position: 'absolute',
        right: 0, top: -40,
        borderRadius: 15,
        height: 80,
        width: 80,
        elevation: 1,
        backgroundColor: '#eee'
    },
    fotoReceita: {
        width: 80, height: 80,
        borderRadius: 15
    },
    flex: {
        flex: 1,
    },
    paddingRight: {
        paddingRight: 10
    },
    wrapper: {
        position: 'absolute',
        left: 0, top: 0, right: 0, height: (imageHeight*8/10) - 50
    },
    activeDot: {
        backgroundColor:'#28b657',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#fff'
    },
    inactiveDot: {
        backgroundColor:'#fff',
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#fff'
    },
    viewArrowSwiper: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
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
        minHeight: (imageHeight*2.5/10) - 50,
        paddingHorizontal: 20,
        paddingTop: 12,
        transform: [
            {translateY: -25}
        ],
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#fff',
    },
    passo: {
        fontSize: 16,
        color: '#222',
    },
    titulo: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    descricao: {
        fontSize: 15,
        color: '#777',
        marginTop: 10,
        textAlign: 'left'
    },
}