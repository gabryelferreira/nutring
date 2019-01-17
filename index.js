/** @format */
import React, { Component } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import Login from './src/screens/Login/Login';
import Principal from './src/screens/Principal/Principal';
import Inicio from './src/screens/Tabs/Inicio/Inicio';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { name as appName } from './app.json';
import Cadastro from './src/screens/Cadastro/Cadastro';
import AddButton from './src/components/AddButton/AddButton';
import NutringAddButton from './src/components/AddButton/NutringAddButton';

const NavigationOptions = {
    headerStyle: {
        borderBottom: 1,
        borderColor: '#ddd',
        elevation: 1,
        shadowOpacity: 0,
    },
}


const _Inicio = createStackNavigator({
    Home: {
        screen: Inicio,
        navigationOptions: NavigationOptions
    }
})

const Tabs = createBottomTabNavigator({
    TabInicio: {
        screen: _Inicio,
        navigationOptions: {
            tabBarLabel: "Início",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    name="home"
                    size={22}
                    color={tintColor} />
            )
        }
    },
    TabAdd: {
        screen: () => null, // Empty screen
        navigationOptions: () => ({
            tabBarIcon: <NutringAddButton /> // Plus button component
        })
    },
    TabPerfil: {
        screen: Inicio,
        navigationOptions: {
            tabBarLabel: "Perfil",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    name="user"
                    size={22}
                    color={tintColor} />
            )
        }
    },
},
{
    tabBarOptions: {
        showLabel: false,
        inactiveTintColor: 'rgba(255, 255, 255, .55)',
        activeTintColor: '#fff',
        style: {
            backgroundColor: '#20b351', // TabBar background
            height: 48
        },
      }
})

const AppNavigator = createStackNavigator({
    Principal: {
        screen: Principal,
        navigationOptions: NavigationOptions
    },
    Login: {
        screen: Login,
        navigationOptions: NavigationOptions
    },
    Cadastro: {
        screen: Cadastro,
        navigationOptions: NavigationOptions
    },
    Tabs: {
        screen: Tabs,
        navigationOptions: {
            header: (
                <View></View>
            )
        }
    }
}, {
    initialRouteName: 'Principal'
}
);

const App = createAppContainer(AppNavigator);

export default App;

AppRegistry.registerComponent(appName, () => App);
