import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Network from '../../../network';
import Post from '../../../components/Post/Post';
import { ScrollView } from 'react-native-gesture-handler';

export default class Postagem extends Network {

    static navigationOptions = {
        title: 'Foto'
    };

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            post: {}
        }
    }

    componentDidMount(){
        this.getPostById();
    }

    async getPostById(){
        let id_post = this.props.navigation.getParam("id_post", "0");
        let result = await this.callMethod("getPostById", { id_post });
        if (result.success){
            result.result.conteudo = result.result.conteudo[0].url_conteudo;
            this.setState({
                post: result.result,
                loading: false
            })
        }
    }

    render(){
        if (this.state.loading){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color="#28b657" size="large" />
                </View>
            );
        }
        return (
            <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                    <Post data={this.state.post} navigation={this.props.navigation}/>
                </ScrollView>
            </View>
        );
    }

}