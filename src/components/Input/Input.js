import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Label from '../Label/Label';

const Input = (props) => {

    returnLabel = () => {
        if (props.label){
            return (
                <Label label={props.label} icone={props.icone}/>
            );
        }
        return null;
    }

    return (
        <View style={styles.container}>
            {returnLabel()}
            <View style={styles.viewInput}>
                <TextInput
                    style={[props.small ? [props.multiline ? [styles.input, styles.inputPequeno] : [styles.input, styles.inputPequeno, styles.inputSuperPequeno]] : [styles.input, styles.inputGrande]]}
                    onChangeText={props.onChangeText}
                    value={props.value ? props.value : ''}
                    returnKeyType={props.returnKeyType}
                    onSubmitEditing={props.onSubmitEditing}
                    blurOnSubmit={props.blurOnSubmit}
                    secureTextEntry={props.secureTextEntry}
                    autoCapitalize={props.autoCapitalize}
                    ref={props.inputRef}
                    maxLength={props.maxLength}
                    placeholderTextColor={props.placeholderTextColor}
                    keyboardType={props.keyboardType}
                    multiline={props.multiline}
                    numberOfLines={props.numberOfLines}
                    autoCorrect={false}
                    autoComplete={false}
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
    viewInput: {
        flexDirection: 'row'
    },
    input: {
        borderRadius: 30,
        color: '#000',
        paddingHorizontal: 25,
        fontSize: 14,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 7,
        marginBottom: 7
    },
    inputPequeno: {
        flex: .7,
    },
    inputSuperPequeno: {
        height: 40
    },
    inputGrande: {
        flex: 1,
        paddingVertical: 5,
    }
}