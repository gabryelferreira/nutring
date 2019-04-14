export default function urlencode(data){
    let url = "";
    for (let key in data){
        data[key] == undefined ? data[key] = "" : data[key] = data[key]
        url = url + key + "=" + data[key].toString() + "&";
    }
    url = url.slice(0, url.length - 1);
    // console.log("url = " + url)
    return url;
}

//id_usuario=2&dt_consumo=2018-12-18