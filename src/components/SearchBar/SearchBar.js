import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { HeaderBackButton } from 'react-navigation';


const SearchBar = ({onPress, onChangeText, value, navigation}) => {
    return (
        <View style={styles.container}>
            <Icon name="chevron-left" size={22} style={{paddingLeft: 10, paddingRight: 26}} onPress={() => navigation.goBack(null)}/>
            <TextInput 
                autoFocus={true}
                onChangeText={onChangeText}
                value={value}
                placeholder="Procure pessoas e restaurante"
                style={styles.caixaDeTexto}
                returnKeyType="search"
                />
            {/* <TouchableOpacity onPress={onPress}>
                <Icon name="times-circle" size={18} solid style={{marginHorizontal: 5}} />
            </TouchableOpacity> */}
        </View>
    );
}

export default SearchBar;

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    caixaDeTexto: {
        flex: 1,
        alignSelf: 'stretch',
    }
}