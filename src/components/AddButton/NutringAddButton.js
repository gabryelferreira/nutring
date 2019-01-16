import React, {Component} from 'react';
import {Animated, TouchableHighlight, View} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
const SIZE = 45;
class NutringAddButton extends Component {

    render() {
        return (
            <View style={{
                position: 'absolute',
                top: -22,
                backgroundColor: '#27ae60',
                paddingVertical: 7,
                paddingHorizontal: 10,
                borderRadius: 40
            }}>
                <View style={{
                    alignItems: 'center',
                }}>
                    <TouchableHighlight
                        onPress={this.toggleView}
                        underlayColor="#2882D8"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE,
                            height: SIZE,
                            borderRadius: SIZE / 2,
                            backgroundColor: '#fff',
                            elevation: 4
                        }}
                    >
                        <View>
                            <Icon name="plus" size={20} color="#27ae60"/>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
export default NutringAddButton;