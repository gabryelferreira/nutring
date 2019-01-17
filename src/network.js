import React, { Component } from 'react';
import urlencode from './url';
export default class Network extends Component {

    url = "http://www.nutring.com.br/api/";
    // url = "http://10.0.2.2/nutring-api/";

    constructor(props){
        super(props);
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"};

    async callMethod(_function, args = undefined){
        let options = {};

        options.headers = this.headers;

        options.method = 'post';
        let data = [];

        for (let i in args) {
        data[i] = args[i];
        }
        options.body = urlencode(data);

        console.log("body = ", options.body);
        try {
            let result = await fetch(this.url + _function, options);
            result = await result.json();
            console.log("RESULT", result)
            return result;
        } catch(error){
            console.error(error);
            return {success: false, error: error}
        }
    }

}