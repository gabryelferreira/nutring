import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList } from 'react-native';
import Network from '../../../network';
import Item from '../../../components/Item/Item';
import SemDados from '../../../components/SemDados/SemDados';

export default class Curtidas extends Network {

    static navigationOptions = {
        title: 'Curtidas',
        tabBarVisible: false
    };

    constructor(props){
        super(props);
        this.state = {
            curtidores: [],
            carregando: true,
            offset: 0,
            limit: 30,
            semMaisCurtidores: false,
            id_post: this.props.navigation.getParam("id_post", "0"),
            carregandoInicial: false
        }
    }

    componentDidMount(){
        this.getCurtidores();
    }

    async getCurtidores(){
        this.setState({
            carregando: true
        })
        if (!this.state.semMaisCurtidores){
            let result = await this.callMethod("getCurtidores", { id_post: this.state.id_post, offset: this.state.offset, limit: this.state.limit });
            if (result.success){
                let curtidores = this.state.curtidores;
                for (var i = 0; i < result.result.length; i++){
                    curtidores.push(result.result[i]);
                }
                if (result.result.length < this.state.limit){
                    await this.setState({
                        semMaisCurtidores: true
                    })
                }
                await this.setState({
                    curtidores,
                    carregandoInicial: false,
                    carregando: false
                })
            }
        }
    }

    async pegarDados(){
        if (!this.state.carregando){
            await this.setState({
                offset: this.state.offset + this.state.limit
            });
            await this.carregarDados();
        }
    }

    returnLoader(index, campo){
            if (index == this.state.curtidores.length-1 && !this.state.semMaisCurtidores)
                return <ActivityIndicator color="#777" size="large" style={{  marginTop: 15, marginBottom: 35 }}/>
        return;
    }

    carregarDadosIniciais() {
        this.setState({
            offset: 0,
            semMaisCurtidores: false,
            curtidores: [],
            carregandoInicial: true
        }, this.getCurtidores)
    }

    render(){
        if (this.state.carregando && this.state.curtidores){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#777" />
                </View>
            );
        }
        if (this.state.curtidores.length == 0){
            return <SemDados titulo={"Nenhuma curtida"} texto={"Esse post não tem curtidores."}/>
        }
        return (
            <FlatList
                data={this.state.curtidores}
                keyExtractor={(item, index) => item.id_usuario.toString()}
                renderItem={({item, index}) => (
                    
                    <View>
                        
                        <Item titulo={item.nome} 
                                foto={item.foto}
                                onPress={() => this.props.navigation.push("Perfil", { id_usuario_perfil: item.id_usuario })}
                                onPressFoto={() => this.props.navigation.push("Perfil", { id_usuario_perfil: item.id_usuario })}
                                />
                        {this.returnLoader(index)}
                    </View>

                )}
                refreshing={this.state.carregandoInicial}
                onRefresh={async () => await this.carregarDadosIniciais()}
                onEndReached={async () => await this.pegarDados()}
                onEndReachedThreshold={0.5}
                legacyImplementation={true}
                enableEmptySections={true}
                />
        );
    }

}