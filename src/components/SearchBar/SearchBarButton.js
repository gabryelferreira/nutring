import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SearchBarButton = ({onPress, onChangeText, value}) => {
    return (
        <View style={styles.container}>
            <Icon name="search" size={18} style={{marginLeft: 10, marginRight: 26}} />
            <TouchableOpacity
                style={styles.caixaDeTexto}
                onPress={onPress}
            >
                <Text>Procure pessoas e restaurantes</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SearchBarButton;

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    caixaDeTexto: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
    }
}