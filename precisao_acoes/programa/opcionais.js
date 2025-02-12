const { Erro } =  require('./modelo.js')

function ajustarDataCotacaoAPI(data){
    // É necessário ajustar o formato da data
    let data_ajustada = {
        data_inicial: data.data_inicial.split('-'),
        data_final: data.data_final.split('-')
    }

    // Transição: yyyy/mm/dd -> mm/dd/yyyy
    data_ajustada.data_inicial = data_ajustada.data_inicial[1] + '/' + data_ajustada.data_inicial[2] + '/' + data_ajustada.data_inicial[0];
    data_ajustada.data_final = data_ajustada.data_final[1] + '/' + data_ajustada.data_final[2] + '/' + data_ajustada.data_final[0];

    return data_ajustada;
}

function verificacaoCotacaoResultado(lista_cotacao) {
    let erro_codigo = 5;

    if (lista_cotacao.value.length == 0){        
        let erro = new Erro(erro_codigo);
        return erro
    } else {
        return '';
    }
}

function ajustarDataConversaoDolar(dicionario_cotacao, codigo_dicionario_cotacao, lista_cotacao){ 
    // Ajustar o formato da data
    for(let i = 0; i < lista_cotacao.value.length; i++){
            
        let data_tratada = String(lista_cotacao.value[i].dataHoraCotacao).split(' ')[0].split('-');
        data_tratada = data_tratada[2] + '-' +  data_tratada[1] + '-' + data_tratada[0];

        item_cotacao = {
            dolar: String(lista_cotacao.value[i].cotacaoCompra),
            data: data_tratada
        }
        dicionario_cotacao[item_cotacao.data] = item_cotacao;
        codigo_dicionario_cotacao.push(item_cotacao.data);
    }
}

function encontrarDataDolar(dicionario_cotacao, codigo_dicionario_cotacao){
    let data_cotacao = '';

    for(let i = 0; i < codigo_dicionario_cotacao.length; i++){
        if(dicionario_cotacao[dados_tratados[i].data] != undefined){
            data_cotacao = dicionario_cotacao[dados_tratados[i].data];
            return data_cotacao;
        }
    }
    return '';
}

async function cotacaoDolar(dados_tratados, data) {
    let erro = '';

    try{
        let data_ajustada = ajustarDataCotacaoAPI(data);

        // Pesquisa API
        let pesquisa_cotacao = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${data_ajustada.data_inicial}'&@dataFinalCotacao='${data_ajustada.data_final}'&$top=100&$format=json&$select=cotacaoCompra,dataHoraCotacao`);
    
        let lista_cotacao = await pesquisa_cotacao.json();
    
        // Situação que não há nenhum resultado provido pela API dentro do espaço dado;
        erro = verificacaoCotacaoResultado(lista_cotacao);
        if(typeof erro === 'object'){
            throw new Error(erro);
        }
    
        let dicionario_cotacao = {};
        let codigo_dicionario_cotacao = [];

        ajustarDataConversaoDolar(dicionario_cotacao, codigo_dicionario_cotacao, lista_cotacao);

        let data_cotacao = encontrarDataDolar(dicionario_cotacao, codigo_dicionario_cotacao);

        // Caso não encontre nenhun igual
        if(data_cotacao == ''){
            data_cotacao = lista_cotacao.value[0].cotacaoCompra;
        }

        for(let i = 0; i < dados_tratados.length; i++){
            dados_tratados[i].alta = (Number(dados_tratados[i].alta) * Number(data_cotacao.dolar));
            dados_tratados[i].baixa = (Number(dados_tratados[i].baixa) * Number(data_cotacao.dolar));
            dados_tratados[i].abertura = (Number(dados_tratados[i].abertura) * Number(data_cotacao.dolar));
            dados_tratados[i].fechamento = (Number(dados_tratados[i].fechamento) * Number(data_cotacao.dolar));
        }
    } catch {
        console.log(erro.lancarMensagem());
    }
}
module.exports = { cotacaoDolar }