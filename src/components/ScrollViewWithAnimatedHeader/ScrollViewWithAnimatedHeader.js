import React, { Component } from 'react';
import { View, Animated, ScrollView, TouchableOpacity, Text, Image, Button, Modal, FlatList, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;

HEADER_HEIGHT = 50;
PICTURE_MAX_HEIGHT = 240;
PICTURE_MIN_HEIGHT = 50;

export default class ScrollViewWithAnimatedHeader extends Component {

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
        }
    }


    render() {

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
            <>
                <Animated.View style={{position: 'absolute', paddingHorizontal: 5, zIndex: 9999, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', left: 0, top: 0, right: 0, height: HEADER_HEIGHT, width: imageWidth, backgroundColor: headerBackgroundColor, elevation}}>
                    <AnimatedIcon name="chevron-left" size={22} style={{paddingLeft: 10, paddingRight: 10}} color={headerColor} onPress={this.props.onGoBack}/>
                    <Animated.Text style={{fontSize: 16, fontWeight: 'bold', color: headerColor, opacity: headerColorOpacity}}>Promoções</Animated.Text>
                    <AnimatedIcon name="search" size={22} style={{paddingLeft: 10, paddingRight: 10}} color="transparent" onPress={() => navigation.goBack(null)}/>
                </Animated.View>
                <Animated.View style={{width: imageWidth, height: PICTURE_MAX_HEIGHT, position: 'absolute', left: 0, right: 0, top: 0, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, .2)'}}>
                    <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#eee', zIndex: 1}}></View>
                    <Image resizeMethod="resize" style={{flex: 1, width: undefined, height: undefined, zIndex: 2}} source={this.props.image ? {uri: this.props.image} : require('../../assets/imgs/promocoes.jpg')}/>
                </Animated.View>
                <ScrollView style={{zIndex: 3}}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                y: this.state.scrollY
                            }
                        }
                    }]
                    )}>
                    <View style={{marginTop: PICTURE_MAX_HEIGHT, paddingBottom: 15, backgroundColor: '#fff'}}>
                        <Animated.Text style={{position: 'absolute', left: 20, top: -55, color: '#fff', fontSize: 30, fontWeight: 'bold', opacity: textOpacity}}>{this.props.title}</Animated.Text>
                        {this.props.children}
                    </View>
                
                </ScrollView>
            </>
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