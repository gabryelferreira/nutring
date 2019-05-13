import React, { Component } from 'react';
import { View, Animated, ScrollView, TouchableOpacity, Text, Image, Button, Modal, FlatList, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../../network';
import SearchBar from '../../../components/SearchBar/SearchBar';
import SearchButton from '../../../components/SearchBar/SearchBarButton';
import Card from '../../../components/Card/Card';
import SemDadosPerfil from '../../../components/SemDadosPerfil/SemDadosPerfil';
import SemDados from '../../../components/SemDados/SemDados';
import Item from '../../../components/Item/Item';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
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
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 1, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    });


    const headerBackgroundColor = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 1, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']
    });

    const headerColorOpacity = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 1, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: [0, 0, 1]
    });

    const headerColor = this.state.scrollY.interpolate({
        inputRange: [0, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT - 1, PICTURE_MAX_HEIGHT - PICTURE_MIN_HEIGHT],
        outputRange: ['#fff', '#fff', '#000']
    });

    const AnimatedIcon = Animated.createAnimatedComponent(Icon)
    
        return (
            <SafeAreaView style={{flex: 1}}>
                <Animated.View style={{position: 'absolute', paddingHorizontal: 5, zIndex: 9999, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', left: 0, top: 0, right: 0, height: HEADER_HEIGHT, width: imageWidth, backgroundColor: headerBackgroundColor, elevation}}>
                    <AnimatedIcon name="chevron-left" size={22} style={{paddingLeft: 10, paddingRight: 10}} color={headerColor} onPress={() => this.props.navigation.goBack(null)}/>
                    <Animated.Text style={{fontSize: 16, fontWeight: 'bold', color: headerColor, opacity: headerColorOpacity}}>Promoções</Animated.Text>
                    <AnimatedIcon name="search" size={22} style={{paddingLeft: 10, paddingRight: 10}} color={headerColor} onPress={() => navigation.goBack(null)}/>
                </Animated.View>
                
                <ScrollView style={{height: 1000}}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                y: this.state.scrollY
                            }
                        }
                    }]
                    )}>
                    <Animated.View style={{width: imageWidth, height: PICTURE_MAX_HEIGHT}}>
                        <Image resizeMethod="resize" style={{flex: 1, width: undefined, height: undefined}} source={{uri: 'https://www.almanac.com/sites/default/files/styles/primary_image_in_article/public/image_nodes/winter-solstice.jpg?itok=9iEebU2H'}}/>
                        <Text style={{position: 'absolute', left: 30, bottom: 20, color: '#fff', fontSize: 26, fontWeight: 'bold'}}>Promoções</Text>
                    </Animated.View>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                    <Text>eae caraio</Text>
                </ScrollView>
            </SafeAreaView> 
        );

  }


}

const styles = {
}