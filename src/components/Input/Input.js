import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Label from '../Label/Label';

const Input = (props) => {

    returnLabel = () => {
        if (props.label){
            return (
                <View style={styles.row}>
                    <Label label={props.label + renderRestante()} icone={props.icone}/>
                </View>
            );
        }
        return null;
    }

    renderHashtag = () => {
        if (props.hashtag){
            return (
                <View style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 30, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 14, color: '#777'}}>#</Text>
                </View>
            );
        }
        return null;
    }

    renderRestante = () => {
        if (props.maxLength){
            return ` (${props.value ? props.maxLength - props.value.length : props.maxLength})`;
        }
        return null;
    }

    return (
        <View style={styles.container}>
            {returnLabel()}
            <View style={styles.viewInput}>
                <TextInput
                    style={[props.multiline ? [styles.input, styles.inputPequeno, styles.multiline] : [styles.input, styles.inputPequeno, styles.inputSuperPequeno], props.disabled ? {backgroundColor: '#eee'} : {}, props.hashtag ? styles.bigPaddingLeft : {}]}
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
                    autoCompleteType="off"
                    editable={!props.disabled}
                    selectTextOnFocus={!props.disabled}
                    placeholder={props.placeholder}
                    />
                    {renderHashtag()}
            </View>
        </View>
    );
}

export default Input;

const styles = {
    row: {
        flexDirection: 'row'
    },
    container: {
        paddingVertical: 5,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    viewInput: {
        flexDirection: 'row'
    },
    input: {
        borderRadius: 5,
        color: '#000',
        paddingHorizontal: 10,
        fontSize: 14,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 7,
        marginBottom: 7,
        
    },
    multiline: {
        textAlignVertical: 'top',
        height: 100
    },
    bigPaddingLeft: {
        paddingLeft: 25
    },
    inputPequeno: {
        flex: 1,
    },
    inputSuperPequeno: {
        height: 50
    },
    inputGrande: {
        flex: 1,
        paddingVertical: 5,
        height: 50
    }
}