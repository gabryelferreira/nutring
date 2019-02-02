import React from 'react';
import { View, TouchableOpacity, Image, Dimensions, Modal, Platform, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

const dimensions = Dimensions.get('window');
const imageHeight = dimensions.height;
const imageWidth = dimensions.width;

const Galeria = ({fotos, onPress, onClose}) => {

    handleOnPress = (foto) => {
        onPress(foto)
    }

    returnFotos = () => {
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
        <Modal
            visible={true}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => {
                this.setState({visible: false})
            }}
            >
            <View style={{
                borderBottom: 1,
                borderColor: '#ddd',
                elevation: 1,
                shadowOpacity: 0,
                height: 50,
                overflow: 'hidden',
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                <TouchableOpacity style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center', zIndex: 2}}
                        onPress={onClose}>
                    <Icon name="times" 
                        size={18} 
                        color="#000" 
                        />
                </TouchableOpacity>
                <View style={[Platform.OS == "ios" ? {justifyContent: 'center'} : {justifyContent: 'flex-start', paddingLeft: 50}, 
                        {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center'}]}>
                    <Text style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>Galeria</Text>
                </View>
            </View>        
            <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}} keyboardShouldPersistTaps={"handled"}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {returnFotos()}
                </View>
            </ScrollView>
        </Modal>
    );
}

export default Galeria;