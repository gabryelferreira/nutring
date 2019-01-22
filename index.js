/** @format */
import React, { Component } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import Login from './src/screens/Login/Login';
import Principal from './src/screens/Principal/Principal';

import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { name as appName } from './app.json';
import Cadastro from './src/screens/Cadastro/Cadastro';

import Feed from './src/screens/Tabs/Feed/Feed';
import Perfil from './src/screens/Tabs/Perfil/Perfil';
import Comentarios from './src/screens/Tabs/Comentarios/Comentarios';
import Configuracoes from './src/screens/Tabs/Configuracoes/Configuracoes';

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

const InsideTabs = {
    Feed: {
        screen: Feed,
        navigationOptions: NavigationOptions
    },
    Perfil: {
        screen: Perfil,
        navigationOptions: NavigationOptions
    },
    Configuracoes: {
        screen: Configuracoes,
        navigationOptions: NavigationOptions
    }
}

function addNewPage(_initialRouteName){
    return createStackNavigator(
        InsideTabs, {
            initialRouteName: _initialRouteName
        }
    )
}

const _Feed = addNewPage('Feed');
const _Perfil = addNewPage('Perfil');
const _Configuracoes = addNewPage('Configuracoes');

const Tabs = createBottomTabNavigator({
    TabFeed: {
        screen: _Feed,
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
        screen: _Perfil,
        navigationOptions: {
            tabBarLabel: "Perfil",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    name="user-secret"
                    solid
                    size={22}
                    color={tintColor} />
            )
        }
    },
},
{
    tabBarOptions: {
        showLabel: false,
        inactiveTintColor: '#c7c7c7',
        activeTintColor: '#28b657',
        style: {
            backgroundColor: '#fff',
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
    },
    Comentarios: {
        screen: Comentarios,
        navigationOptions: NavigationOptions
    }
}, {
    initialRouteName: 'Principal'
}
);

const App = createAppContainer(AppNavigator);

export default App;

AppRegistry.registerComponent(appName, () => App);
