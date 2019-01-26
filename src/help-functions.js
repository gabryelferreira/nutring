export function removerCaracteresEspeciais(valor, caracteres) {
    for (var i = 0; i < caracteres.length; i++){
        valor = removerCaracter(valor, caracteres[i]);
    }
    return valor;
}

export function removerCaracter(valor, caracter) {
    let existe = true;
    while (existe == true){
        if (valor.indexOf(caracter) != -1){
            valor = valor.replace(caracter, "");
        } else {
            existe = false;
        }
    }
    return valor;
}

export function formatarCNPJ(cnpj){
    cnpj = removerCaracteresEspeciais(cnpj, ["/", ".", "-"]);
    if (cnpj.length <= 2)
        cnpj = cnpj.replace(/(\d{2})/g,"\$1.")
    else if (cnpj.length <= 3)
        cnpj = cnpj.replace(/(\d{2})(\d{1})/g,"\$1.\$2")
    else if (cnpj.length <= 4)
        cnpj = cnpj.replace(/(\d{2})(\d{2})/g,"\$1.\$2")
    else if (cnpj.length <= 5)
        cnpj = cnpj.replace(/(\d{2})(\d{3})/g,"\$1.\$2.")
    else if (cnpj.length <= 6)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{1})/g,"\$1.\$2.\$3")
    else if (cnpj.length <= 7)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{2})/g,"\$1.\$2.\$3")
    else if (cnpj.length <= 8)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})/g,"\$1.\$2.\$3/")
    else if (cnpj.length <= 9)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/g,"\$1.\$2.\$3/\$4")
    else if (cnpj.length <= 10)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3/\$4")
    else if (cnpj.length <= 11)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/g,"\$1.\$2.\$3/\$4")
    else if (cnpj.length <= 12)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/g,"\$1.\$2.\$3/\$4-")
    else if (cnpj.length <= 13)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/g,"\$1.\$2.\$3/\$4-\$5")
    else if (cnpj.length <= 14)
        cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3/\$4-\$5")
    return cnpj;
}

export function formatarData(data){
    data = removerCaracteresEspeciais(data, ["/"]);
    if (data.length <= 2)
        data = data.replace(/(\d{2})/g,"\$1/")
    else if (data.length <= 3)
        data = data.replace(/(\d{2})(\d{1})/g,"\$1/\$2")
    else if (data.length <= 4)
        data = data.replace(/(\d{2})(\d{2})/g,"\$1/\$2/")
    else if (data.length <= 5)
        data = data.replace(/(\d{2})(\d{2})(\d{1})/g,"\$1/\$2/\$3")
    else if (data.length <= 6)
        data = data.replace(/(\d{2})(\d{2})(\d{2})/g,"\$1/\$2/\$3")
    else if (data.length <= 7)
        data = data.replace(/(\d{2})(\d{2})(\d{3})/g,"\$1/\$2/\$3")
    else if (data.length <= 8)
        data = data.replace(/(\d{2})(\d{2})(\d{4})/g,"\$1/\$2/\$3")
    return data;
}

export function formatarCep(cep){
    cep = removerCaracteresEspeciais(cep, ["-"]);
    if (cep.length <= 5)
        cep = cep.replace(/(\d{5})/g,"\$1-")
    else if (cep.length <= 6)
        cep = cep.replace(/(\d{5})(\d{1})/g,"\$1-\$2")
    else if (cep.length <= 7)
        cep = cep.replace(/(\d{5})(\d{2})/g,"\$1-\$2")
    else if (cep.length <= 8)
        cep = cep.replace(/(\d{5})(\d{3})/g,"\$1-\$2")
    return cep;
}
