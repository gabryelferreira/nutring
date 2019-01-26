import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Label = ({label, icone}) => {
    return (
        <View style={styles.flexRow}>
            <Icon name={icone} solid color="#000" size={16}/>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

export default Label;

const styles = {
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    label: {
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 7
    },
}