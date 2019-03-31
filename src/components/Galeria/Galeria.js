import React from 'react';
import { View, TouchableOpacity, Image, Dimensions, Modal, Platform, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Header = ({onCloseClick}) => {
    return (
        <View style={{
            elevation: 1,
            shadowOpacity: 0,
            height: 50,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            left: 0, right: 0, top: 0,
            zIndex: 9999,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
        }}>
            <View style={{position: 'relative', flex: 1, zIndex: 9999, flexDirection: 'row', alignItems: 'center', justifyContent: Platform.OS === 'ios' ? 'space-between' : 'flex-start'}}>
                <Icon onPress={onCloseClick} name="times" color="#000" size={24}/>
                <Text style={{color: '#000', fontWeight: 'bold', fontSize: 22, marginLeft: Platform.OS === 'ios' ? 0 : 30}}>Escolha</Text>
                <Icon name="times" color="#fff" size={24}/>
            </View>
        </View>
    );
}

const Galeria = ({fotos, onPress, onClose}) => {

    handleOnPress = (foto) => {
        onPress(foto)
    }

    returnFotos = () => {
        if (fotos.length > 0){
            return fotos.map((foto, index) => {
                console.log("index = ", index)
                if (index % 3 == 0){
                    console.log("eh fera")
                    return (
                        <TouchableOpacity key={foto} style={{width: imageWidth / 3, height: imageWidth / 3, flexWrap: 'wrap', marginBottom: 2}} onPress={() => handleOnPress(foto)}>
                            <Image resizeMethod="resize" source={{uri: foto}} style={{flex: 1, height: undefined, width: undefined}}/>
                        </TouchableOpacity>
                    );
                }
                console.log("passei, n eh fera")
                return (
                    <TouchableOpacity key={foto} style={{width: imageWidth / 3, height: imageWidth / 3, flexWrap: 'wrap', paddingLeft: 2, marginBottom: 2}} onPress={() => handleOnPress(foto)}>
                        <Image resizeMethod="resize" source={{uri: foto}} style={{flex: 1, height: undefined, width: undefined}}/>
                    </TouchableOpacity>
                );
            })
        }
        return (
            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 15}}>
                <Text style={{fontSize: 14, color: '#777', fontWeight: 'bold'}}>Sua galeria está vazia.</Text>
            </View>
        );
    }

    return (
        <Modal
            visible={true}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
            >
            <Header onCloseClick={onClose}/>       
            <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {returnFotos()}
                </View>
            </ScrollView>
        </Modal>
    );
}

export default Galeria;