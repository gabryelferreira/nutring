import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, FlatList } from 'react-native';
import Network from '../../../../network';
import Item from '../../../../components/Item/Item';
import SemDados from '../../../../components/SemDados/SemDados';

export default class Seguidores extends Network {

    static navigationOptions = {
        title: 'Seguindo',
        tabBarVisible: false
    };

    constructor(props){
        super(props);
        this.state = {
            seguindo: [],
            carregando: true,
            offset: 0,
            limit: 30,
            semMaisSeguindo: false,
            id_usuario_perfil: this.props.navigation.getParam("id_usuario_perfil", "0"),
            carregandoInicial: true
        }
    }

    componentDidMount(){
        this.getSeguindo();
    }

    async getSeguindo(){
        this.setState({
            carregando: true
        })
        if (!this.state.semMaisSeguindo){
            let result = await this.callMethod("getSeguindo", { id_usuario_perfil: this.state.id_usuario_perfil, offset: this.state.offset, limit: this.state.limit });
            if (result.success){
                let seguindo = this.state.seguindo;
                for (var i = 0; i < result.result.length; i++){
                    seguindo.push(result.result[i]);
                }
                if (result.result.length < this.state.limit){
                    await this.setState({
                        semMaisSeguindo: true
                    })
                }
                await this.setState({
                    seguindo,
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
            await this.getSeguindo();
        }
    }

    returnLoader(index, campo){
            if (index == this.state.seguindo.length-1 && !this.state.semMaisSeguindo)
                return <ActivityIndicator color="#777" size="small" style={{  marginTop: 15, marginBottom: 35 }}/>
        return;
    }

    carregarDadosIniciais() {
        this.setState({
            offset: 0,
            semMaisSeguindo: false,
            seguindo: [],
            carregandoInicial: true
        }, this.getSeguindo)
    }

    render(){
        if (this.state.carregando && this.state.carregandoInicial){
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color="#777" />
                </View>
            );
        }
        if (this.state.seguindo.length == 0){
            return <SemDados titulo={"Aqui parece vazio"} texto={"O usuário não segue ninguém."}/>
        }
        return (
            <FlatList
                data={this.state.seguindo}
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