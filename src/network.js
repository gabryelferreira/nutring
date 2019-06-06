import React, { Component } from 'react';
import urlencode from './url';
import { AsyncStorage, Platform } from 'react-native';
export default class Network extends Component {

    // url = "http://nutring.com.br/api/";
    // url = "http://beta.nutring.com.br/api/";
    // url = "http://10.0.2.2:8100/";
    url = "http://api.nutring.com.br/";

    constructor(props){
        super(props);
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"};

    async callMethod(_function, args = undefined){
        let options = {};
        await this.setAuthorization();
        options.headers = this.headers;

        options.method = 'post';
        let data = [];

        for (let i in args) {
        data[i] = args[i];
        }
        options.body = urlencode(data);

        console.log("function = " + _function)
        if (Platform.OS !== 'ios'){
            console.log("body = ", options.body);
        }
        try {
            let result = await fetch(this.url + _function, options);
            result = await result.json();
            console.log("RESULT", result)
            let error = await this.treatError(result);
            if (error)
                await this.logoutUser();
            return result;
        } catch(error){
            console.error(error);
            return {success: false, error: error}
        }
    }

    treatError(result){
        if (result && result.error){
          if (result.error == "NOT_AUTHORIZED"){
            return true;
          } else {
            return false;
          }
        }
      }

    async setAuthorization(){
        let user = await this.getUsuarioLogado();
        if (user && user.token){
          this.headers["Authorization"] = user.token;
        } else {
          this.headers["Authorization"] = "";
        }
    }

    async getUsuarioLogado(){
        try {
            let value = await AsyncStorage.getItem("userData");
            console.log("value = ", value)
            value = await JSON.parse(value);
            return value;
        } catch (error) {
            console.error(error);
        }
    }

    async removerUsuario(){
        try {
            await AsyncStorage.removeItem("userData");
        } catch(error){
            console.error(error);
        }
    }

    async logoutUser(){
        await this.removerUsuario();
        this.props.navigation.navigate("Principal");
    }

    //GERAR DADOS DE UM CEP
    async viaCepMethod(cep){
        let options = {};

        options.method = 'get';

        try {
            let result = await fetch("http://viacep.com.br/ws/" + cep + "/json/ ", options);
            result = await result.json();
            console.log("VIACEP RESULT", result)
            return result;
        } catch(error){
            console.error(error);
            return {success: false, error: error}
        }
    }

}