import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Input = (props) => {

    function doNothing(){

    }

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <Icon name={props.icone} solid color="#000" size={16}/>
                <Text style={styles.label}>{props.label}</Text>
            </View>
            <View style={styles.viewInput}>
                <TextInput
                    style={styles.input}
                    onChangeText={props.onChangeText}
                    value={props.value ? props.value : ''}
                    returnKeyType={props.returnKeyType}
                    onSubmitEditing={props.onSubmitEditing}
                    blurOnSubmit={props.blurOnSubmit}
                    secureTextEntry={props.secureTextEntry}
                    autoCapitalize={props.autoCapitalize}
                    ref={props.inputRef}
                    />
            </View>
        </View>
    );
}

export default Input;

const styles = {
    container: {
        paddingVertical: 5,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    label: {
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 5
    },
    viewInput: {
        height: 40,
        flexDirection: 'row'
    },
    input: {
        flex: .7,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#f2f2f2'
    }
}