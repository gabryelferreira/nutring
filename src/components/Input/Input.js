import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

const Input = (props) => {

    function doNothing(){

    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label}</Text>
            <View style={styles.viewInput}>
                <TextInput
                    style={styles.input}
                    onChangeText={props.onChangeText ? props.onChangeText : doNothing()}
                    value={props.value ? props.value : ''}
                    returnKeyType={props.returnKeyType ? props.returnKeyType : 'next'}
                    onSubmitEditing={props.onSubmitEditing ? props.onSubmitEditing : doNothing()}
                    blurOnSubmit={props.blurOnSubmit ? props.blurOnSubmit : true}
                    />
            </View>
        </View>
    );
}

const styles = {
    container: {
        
    },
    label: {
        paddingVertical: 10,
        fontWeight: 'bold',
        color: '#222'
    },
    viewInput: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        alignSelf: 'stretch',
        height: 50,
    },
    input: {
        flex: 1,
        alignSelf: 'stretch',
        borderRadius: 20,
        elevation: 1
        
    }
}

export default Input;