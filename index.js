/** @format */
import React from 'react';
import { AppRegistry, View, Text, Animated, Easing, Platform } from 'react-native';
import Login from './src/screens/Login/Login';
import Principal from './src/screens/Principal/Principal';

import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import StackViewStyleInterpolator from "react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { name as appName } from './app.json';
import Cadastro from './src/screens/Cadastro/Cadastro';
import EsqueciSenha from './src/screens/EsqueciSenha/EsqueciSenha';
import InserirCodigoRecuperacao from './src/screens/EsqueciSenha/InserirCodigoRecuperacao';
import RecuperarSenha from './src/screens/EsqueciSenha/RecuperarSenha';
import BuscarEspecifico from './src/screens/BuscarEspecifico/BuscarEspecifico';

import Feed from './src/screens/Tabs/Feed/Feed';
import Perfil from './src/screens/Tabs/Perfil/Perfil';
import Comentarios from './src/screens/Tabs/Comentarios/Comentarios';
import Curtidas from './src/screens/Tabs/Curtidas/Curtidas';
import Configuracoes from './src/screens/Tabs/Configuracoes/Configuracoes';
import Buscar from './src/screens/Tabs/Buscar/Buscar';
import Receitas from './src/screens/Tabs/Receitas/Receitas';

import NutringAddButton from './src/components/AddButton/NutringAddButton';
import Notificacoes from './src/screens/Tabs/Notificacoes/Notificacoes';
import NovaPostagem from './src/screens/Tabs/NovaPostagem/NovaPostagem';
import EditarConta from './src/screens/Tabs/Configuracoes/EditarConta/EditarConta';
import Ajuda from './src/screens/Tabs/Configuracoes/Ajuda/Ajuda';
import Privacidade from './src/screens/Tabs/Configuracoes/Privacidade/Privacidade';
import AlterarUsuario from './src/screens/Tabs/Configuracoes/EditarConta/Alterar/AlterarUsuario';
import AlterarEmail from './src/screens/Tabs/Configuracoes/EditarConta/Alterar/AlterarEmail';
import AlterarSenha from './src/screens/Tabs/Configuracoes/EditarConta/Alterar/AlterarSenha';
import NovaPromocao from './src/screens/Tabs/Configuracoes/NovaPromocao/NovaPromocao';
import EnviarNotificacao from './src/screens/Tabs/Configuracoes/EnviarNotificacao/EnviarNotificacao';
import EditarPerfil from './src/screens/Tabs/Perfil/EditarPerfil/EditarPerfil';
import Postagem from './src/screens/Tabs/Postagem/Postagem';
import Seguidores from './src/screens/Tabs/Perfil/Seguidores/Seguidores';
import Seguindo from './src/screens/Tabs/Perfil/Seguindo/Seguindo';
import Promocoes from './src/screens/Tabs/Notificacoes/Promocoes/Promocoes';
import Promocao from './src/screens/Tabs/Notificacoes/Promocoes/Promocao/Promocao';
import MeuPlano from './src/screens/Tabs/Configuracoes/MeuPlano/MeuPlano';
import Plano from './src/screens/Tabs/Configuracoes/MeuPlano/Plano/Plano';
import NovaReceita from './src/screens/Tabs/NovaReceita/NovaReceita';
import EditarReceita from './src/screens/Tabs/EditarReceita/EditarReceita';
import EditarPasso from './src/screens/Tabs/EditarReceita/EditarPasso/EditarPasso';
import VerReceita from './src/screens/Tabs/Receitas/VerReceita/VerReceita';

const NavigationOptions = {
    headerStyle: {
        borderBottom: 1,
        borderColor: '#ddd',
        elevation: 1,
        shadowOpacity: 0,
        height: 50,
    },
    headerBackTitle: null
}

const InsideTabs = {
    Feed: {
        screen: Feed,
        navigationOptions: NavigationOptions
    },
    Buscar: {
        screen: Buscar,
        navigationOptions: NavigationOptions
    },
    Perfil: {
        screen: Perfil,
    },
    Configuracoes: {
        screen: Configuracoes,
        navigationOptions: NavigationOptions
    },
    Notificacoes: {
        screen: Notificacoes,
        navigationOptions: NavigationOptions
    },
    EditarConta: {
        screen: EditarConta,
        navigationOptions: NavigationOptions
    },
    Ajuda: {
        screen: Ajuda,
        navigationOptions: NavigationOptions
    },
    Privacidade: {
        screen: Privacidade,
        navigationOptions: NavigationOptions
    },
    NovaPostagem: {
        screen: NovaPostagem,
        navigationOptions: NavigationOptions
    },
    Postagem: {
        screen: Postagem,
        navigationOptions: NavigationOptions
    },
    Seguidores: {
        screen: Seguidores,
        navigationOptions: NavigationOptions
    },
    Curtidas: {
        screen: Curtidas,
        navigationOptions: NavigationOptions
    },
    Seguindo: {
        screen: Seguindo,
        navigationOptions: NavigationOptions
    },
    Promocoes: {
        screen: Promocoes,
        navigationOptions: NavigationOptions
    },
    Promocao: {
        screen: Promocao,
        navigationOptions: NavigationOptions
    },
    Receitas: {
        screen: Receitas,
        navigationOptions: NavigationOptions
    },
    VerReceita: {
        screen: VerReceita,
        navigationOptions: NavigationOptions
    },
    MeuPlano: {
        screen: MeuPlano,
        navigationOptions: NavigationOptions
    },
    Plano: {
        screen: Plano,
        navigationOptions: NavigationOptions
    },
}

function addNewPage(_initialRouteName){
    return createStackNavigator(
        InsideTabs, {
            initialRouteName: _initialRouteName,
            transitionConfig : () => (Platform.OS === 'ios' ? {
                
                screenInterpolator: props => {
                    // Transitioning to search screen (navigate)
                    // if (props.scene.route.routeName === 'Search') {
                    //   return StackViewStyleInterpolator.forFade(props);
                    // }
              
                    // const last = props.scenes[props.scenes.length - 1];
              
                    // // Transitioning from search screen (goBack)
                    // if (last.route.routeName === 'Search') {
                    //   return StackViewStyleInterpolator.forFade(props);
                    // }
                    // if (Platform.OS === 'ios') {
                    if (props.scene.route.routeName == 'Principal'){
                        return StackViewStyleInterpolator.forFade(props);
                    }
                      return StackViewStyleInterpolator.forHorizontal(props);
                    // }
              
                    // return;
                  },
                } : {
                    transitionSpec: {
                        duration: 0,
                        timing: Animated.timing,
                        easing: Easing.step0,
                    },
                }
            ),

        },
        
    )
}

const _Feed = addNewPage('Feed');
const _Buscar = addNewPage('Buscar');
const _Perfil = addNewPage('Perfil');
const _Notificacoes = addNewPage('Notificacoes');

const Tabs = createBottomTabNavigator({
    TabFeed: {
        screen: _Feed,
        navigationOptions: {
            tabBarLabel: "Início",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    name="leaf"
                    size={20}
                    color={tintColor} />
            )
        }
    },
    TabBuscar: {
        screen: _Buscar,
        navigationOptions: {
            tabBarLabel: "Buscar",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    name="search"
                    size={20}
                    color={tintColor} />
            )
        }
    },
    TabAdd: {
        screen: () => null, // Empty screen
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({  }) => <NutringAddButton navigation={navigation}/> // Plus button component
        })
    },
    TabNotificacoes: {
        screen: _Notificacoes,
        navigationOptions: {
            tabBarLabel: "Notificacoes",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    name="bell"
                    solid
                    size={20}
                    color={tintColor} />
            )
        }
    },
    TabPerfil: {
        screen: _Perfil,
        navigationOptions: {
            tabBarLabel: "Perfil",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    name="user-circle"
                    solid
                    size={20}
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
      },
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
    EsqueciSenha: {
        screen: EsqueciSenha,
        navigationOptions: NavigationOptions
    },
    InserirCodigoRecuperacao: {
        screen: InserirCodigoRecuperacao,
        navigationOptions: NavigationOptions
    },
    RecuperarSenha: {
        screen: RecuperarSenha,
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
    },
    AlterarUsuario: {
        screen: AlterarUsuario,
        navigationOptions: NavigationOptions
    },
    AlterarEmail: {
        screen: AlterarEmail,
        navigationOptions: NavigationOptions
    },
    AlterarSenha: {
        screen: AlterarSenha,
        navigationOptions: NavigationOptions
    },
    EditarPerfil: {
        screen: EditarPerfil,
        navigationOptions: NavigationOptions
    },
    NovaPromocao: {
        screen: NovaPromocao,
        navigationOptions: NavigationOptions
    },
    EnviarNotificacao: {
        screen: EnviarNotificacao,
        navigationOptions: NavigationOptions
    },
    NutringAddButton: {
        screen: NutringAddButton,
        navigationOptions: NavigationOptions
    },
    BuscarEspecifico: {
        screen: BuscarEspecifico,
        navigationOptions: NavigationOptions
    },
    NovaReceita: {
        screen: NovaReceita,
        navigationOptions: NavigationOptions
    },
    EditarReceita: {
        screen: EditarReceita,
        navigationOptions: NavigationOptions
    },
    EditarPasso: {
        screen: EditarPasso,
        navigationOptions: NavigationOptions
    }
}, {
    initialRouteName: 'Principal',
    transitionConfig : () => (Platform.OS === 'ios' ? {
                
        screenInterpolator: props => {
            // Transitioning to search screen (navigate)
            // if (props.scene.route.routeName === 'Search') {
            //   return StackViewStyleInterpolator.forFade(props);
            // }
      
            
            // // Transitioning from search screen (goBack)
            // if (Platform.OS === 'ios') {
                if (props.scene.route.routeName == 'BuscarEspecifico'){
                    return;
                }
                if (props.scene.route.routeName == 'EditarPasso'){
                    return StackViewStyleInterpolator.forFade(props);
                }
                if (props.scene.route.routeName == 'Principal'){
                    return StackViewStyleInterpolator.forFade(props);
                }
                const last = props.scenes[props.scenes.length - 1];
                if (last.route.routeName === 'EditarPasso') {
                    return StackViewStyleInterpolator.forFade(props);
                }
            return StackViewStyleInterpolator.forHorizontal(props);
            // }
      
            // return;
          },
        } : {
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0,
            },
        }
    ),
}
);

const App = createAppContainer(AppNavigator);

export default App;

AppRegistry.registerComponent(appName, () => App);
