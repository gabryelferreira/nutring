import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Sugestoes = () => {


    return (
        <View style={styles.flexRow}>
            <Text style={[styles.fontSize, styles.titulo]}>Sugestões: <Text style={styles.sugestao}>@nutring1, @nutring2, @nutring3</Text></Text>
        </View>
    );
}

const styles = {
    flexRow: {
        flexDirection: 'row'
    },
    fontSize: {
        fontSize: 12,
    },
    titulo: {
        color: '#000'
    },
    sugestao: {
        color: '#28b657',
        fontWeight: 'bold'
    }
}

export default Sugestoes;