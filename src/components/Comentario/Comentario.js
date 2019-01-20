import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Network from '../../network';


const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

class Comentario extends Network {

    constructor(props){
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    async likeUnlikeComment(id_comentario){
        let id_usuario = await this.getIdUsuarioLogado();
        let result = await this.callMethod("likeUnlikeComment", { id_comentario, id_usuario });
        if (result.success){
            let data = this.state.data;
            if (data.gostei){
                data.curtidas -= 1;
            } else {
                data.curtidas += 1;
            }
            data.gostei = !data.gostei;
            this.setState({data: data})
        }
    }

    returnGostei(){
        if (!this.state.data.gostei)
            return <Icon name="heart" color="#444" size={15}/>
        return <Icon name="heart" color="#27ae60" solid size={15}/>
    }

    returnTextoPostedAgo(tempo_postado){
        if (tempo_postado == "agora"){
            return <Text style={styles.tempo}>{tempo_postado}</Text>;
        } else {
            return <Text style={styles.tempo}>{tempo_postado} atrás</Text>;
        }
    }

    returnTextoCurtidas(curtidas){
        if (curtidas > 0){
            return <Text style={{fontSize: 13, marginLeft: 7, color: '#444'}}>{curtidas}</Text>;
        } else {
            return <Text style={{fontSize: 13, marginLeft: 7, color: '#444'}}>Curtir</Text>;
        }
    }

    render(){
        let larguraImagem = imageWidth;
        let { id_comentario, id_post, comentario, curtidas, foto, nome, tempo_postado } = this.state.data;
        return (
            <View style={styles.container}>
                <View style={styles.viewFoto}>
                    <Image source={{uri: 'https://noticiasdetv.com/wp-content/uploads/2017/11/Marcela-Fetter-2.png'}} style={{height: 38, width: 38, borderRadius: 38/2}}/>
                </View>

                <View style={styles.viewInfo}>
                    <View style={styles.viewInfoTexto}>
                        <TouchableOpacity>
                            <Text style={styles.nome}>{nome}</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize: 13, color: '#555'}}>-</Text>
                        {this.returnTextoPostedAgo(tempo_postado)}
                    </View>
                    <Text style={styles.comentario}>{comentario}</Text>
                    <View style={styles.tabs}>
                        <TouchableOpacity style={styles.tab} onPress={() => this.likeUnlikeComment(id_comentario)}>
                            {this.returnGostei()}
                            {this.returnTextoCurtidas(curtidas)}
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.tab} onPress={() => this.props.navigation.navigate('Comentarios', { id_post: id_post })}>
                            <Icon name="comment" color="#444" size={15}/>
                            <Text style={{fontSize: 13, marginLeft: 7, color: '#444'}}>{comentarios}</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>

            </View>
        );
    }
}

export default Comentario;

const styles = {
    container: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomColor: '#e4e4e4',
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        
    },
    viewFoto: {
        width: 52,
        alignItems: 'flex-start'
    },
    viewInfo: {
        flex: 1,
        flexDirection: 'column'
    },
    viewInfoTexto: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        
    },
    nome: {
        fontSize: 13,
        color: '#555',
        maxHeight: 17,
        marginRight: 3
    },
    tempo: {
        fontSize: 12,
        color: '#555',
        marginLeft: 3
    },
    comentario: {
        fontSize: 15,
        color: '#000',
        marginTop: 5
    },
    opcaoComentario: {
        flex: .2,
        flexDirection: 'row',
        paddingRight: 5,
    },
    curtidas: {
        fontSize: 13,
        color: '#aaa',
        fontWeight: 'bold'
    },
    tabs: {
        flexDirection: 'row',
        marginTop: 5
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 8,
    },
}