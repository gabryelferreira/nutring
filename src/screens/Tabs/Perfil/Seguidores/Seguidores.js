import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList } from 'react-native';
import Network from '../../../../network';
import Item from '../../../../components/Item/Item';
import SemDados from '../../../../components/SemDados/SemDados';

export default class Seguidores extends Network {

    static navigationOptions = {
        title: 'Seguidores',
        tabBarVisible: false
    };

    constructor(props){
        super(props);
        this.state = {
            seguidores: [],
            carregando: true,
            offset: 0,
            limit: 30,
            semMaisSeguidores: false,
            id_usuario_perfil: this.props.navigation.getParam("id_usuario_perfil", "0"),
            carregandoInicial: true
        }
    }

    componentDidMount(){
        this.getSeguidores();
    }

    async getSeguidores(){
        this.setState({
            carregando: true
        })
        if (!this.state.semMaisSeguidores){
            let result = await this.callMethod("getSeguidores", { id_usuario_perfil: this.state.id_usuario_perfil, offset: this.state.offset, limit: this.state.limit });
            if (result.success){
                let seguidores = this.state.seguidores;
                for (var i = 0; i < result.result.length; i++){
                    seguidores.push(result.result[i]);
                }
                if (result.result.length < this.state.limit){
                    await this.setState({
                        semMaisSeguidores: true
                    })
                }
                await this.setState({
                    seguidores,
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
            await this.getSeguidores();
        }
    }

    returnLoader(index, campo){
            if (index == this.state.seguidores.length-1 && !this.state.semMaisSeguidores)
                return <ActivityIndicator color="#777" size="large" style={{  marginTop: 15, marginBottom: 35 }}/>
        return;
    }

    carregarDadosIniciais() {
        this.setState({
            offset: 0,
            semMaisSeguidores: false,
            seguidores: [],
            carregandoInicial: true
        }, this.getSeguidores)
    }

    render(){
        if (this.state.carregando && this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#777" />
                </View>
            );
        }
        if (this.state.seguidores.length == 0){
            return <SemDados titulo={"Nenhum seguidor"} texto={"Você ainda não possui seguidores."}/>
        }
        return (
            <FlatList
                data={this.state.seguidores}
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