

export function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g,'');
    
    if(cnpj == '') return false;
        
    if (cnpj.length != 14)
        return false;
    
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
            
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
            
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
            return false;
            
    return true;
}

export function validarData(data) {
    var date = null;
    var fullDate = data;
    var length = fullDate.length;
    var count = 0;
    for (var i = 0; i < fullDate.length; i++){
        if (fullDate[i] == "/")
            count++;
    }
    if (count == 2 && length == 10){
        var replace = true;
        while (replace == true){
            if (fullDate.indexOf("/") != -1){
                fullDate = fullDate.replace("/", "");
            } else {
                replace = false;
            }
        }
        var day = fullDate.substring(0, 2);
        var month = fullDate.substring(2, 4);
        var year = fullDate.substring(4, 8);
        return isDataValida(day, month, year);
    }
    return false;
}



export function isDataValida(dia, mes, ano){
    let datas = gerarDatas();
    if (datas.dias.indexOf(dia) != -1 && datas.meses.indexOf(mes) != -1 && datas.anos.indexOf(ano) != -1){
        let anoBissexto = isAnoBissexto(parseInt(ano));
        if (anoBissexto){
            for (var i = 0; i < datas.mesesDias.length; i++){
                if (datas.mesesDias[i].mes == "02") {
                    datas.mesesDias[i].dias = "29";
                    break;
                }
            }
        }
        for (var i = 0; i < datas.mesesDias.length; i++){
            if (mes == datas.mesesDias[i].mes){
                if (parseInt(dia) <= parseInt(datas.mesesDias[i].dias))
                    return true;
                return false;
            }
        }
    }
    return false;
}

export function isAnoBissexto(ano){
    if (ano % 400 == 0)
        return true;
    if (ano % 100 == 0)
        return false;
    if (ano % 4 == 0)
        return true;
    return false;
}

export function gerarDatas(){
    let datas = {
        dias: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", 
               "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
               "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
        meses: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        anos: [],
        mesesDias: [
            {mes: "01", dias: "31"},
            {mes: "02", dias: "28"},
            {mes: "03", dias: "31"},
            {mes: "04", dias: "30"},
            {mes: "05", dias: "31"},
            {mes: "06", dias: "30"},
            {mes: "07", dias: "31"},
            {mes: "08", dias: "31"},
            {mes: "09", dias: "30"},
            {mes: "10", dias: "31"},
            {mes: "11", dias: "30"},
            {mes: "12", dias: "31"}
        ]
    }
    for (var i = 1900; i < new Date().getFullYear(); i++){
        datas.anos.push(i.toString());
    }
    return datas;
}