const { cotacaoDolar } = require('./funcoes_opcionais.js');
const { cotacaoDia, Erro } =  require('./classes.js')
const yahooFinance = require('yahoo-finance2').default;

function calcularProximoDia(data){
    
    // Ano, mês e dia
    const dataSeparada = data.data_inicial.split('-');

    // Caso o mês venha com 'leading zero'
    if(dataSeparada[1][0] == '0'){
        dataSeparada[1] = dataSeparada[1].slice(1);
    }

    const diaFinalMeses = {
        1: 31,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }

    // Caso não seja fevereiro
    if(diaFinalMeses[dataSeparada[1]] != undefined){

        // Dia não é o último do seu mês
        if(diaFinalMeses[dataSeparada[1]] != dataSeparada[2]){
            dataSeparada[2]++;
        }

        // Mudar de mês
        if(diaFinalMeses[dataSeparada[1]] == dataSeparada[2]){
            dataSeparada[2] = '1';
            dataSeparada[1]++;
        }

        // Mudar ano
        if(dataSeparada[1] > '12'){
            dataSeparada[1] = '1';
            dataSeparada[0]++;
        }

    } else {
        // Não é o último de um ano comum
        if(dataSeparada[2] != '28'){
            dataSeparada[2]++;
        } else if (dataSeparada[2] == '29'){
            // Obrigatoriamente é ano bissexto
            dataSeparada[2] = '1';
            dataSeparada[1]++;
        } else {
            
            // Verificação ano bissexto
            /* Regra
                Divisível por 4: É bissexto
                Divisível por 100: Não é bissexto
                Divisível por 400: É bissexto
            */

            let eBissexto = false;

            if(dataSeparada[0] % 4 == 0){
                eBissexto = true;
                if(dataSeparada[0] % 100 == 0){
                    eBissexto = false;
                    if(dataSeparada[0] % 400 == 0){
                        eBissexto = true;
                    }
                }
            }

            if(eBissexto) {
                dataSeparada[2]++;
            } else {
                dataSeparada[2] = '1';
                dataSeparada[1]++;
            }
        }
    }

    // Retornar leading '0'
    if(dataSeparada[1] < 10){
        dataSeparada[1] = '0' + dataSeparada[1]
    }

    if(dataSeparada[2] < 10){
        dataSeparada[2] = '0' + dataSeparada[2];
    }

    data.data_final = dataSeparada[0] + '-' + dataSeparada[1] + '-' + dataSeparada[2];
    return data.data_final;
}

function verificacaoData(data) {
    let codigo_erro;

    // Pega o dia de hoje
    let dia_atual = new Date().toLocaleString();

    // Transcrever a data comum dd/mm/yyyy -> yyyy/mm/dd
    dia_atual = dia_atual.split(',')[0].split('/');
    dia_atual = Number(dia_atual[2] + dia_atual[1] + dia_atual[0]);

    let primeira_data = Number(data.data_inicial.split('-').join(''));
    let segunda_data = Number(data.data_final.split('-').join(''));

    if(dia_atual < primeira_data) {
        codigo_erro = '001';

    } else if(dia_atual < segunda_data) {
        codigo_erro = '002';
    
    } else if(primeira_data > segunda_data) {
        codigo_erro = '003';
    }

    let erro;

    try {
        if(codigo_erro != undefined){
            erro = new Erro(codigo_erro);
            throw new Error(erro);
        }
        return false;

    } catch {
        console.log(erro.lancarMensagem());
        return true;
    }
}

function verificacaoAcaoResultado(dados_brutos) {
    let codigo_erro;
    let erro;

    try{
        if(dados_brutos.quotes.length == 0){
            codigo_erro = '011';
            erro = new Erro(codigo_erro)
            throw new Error(erro);
        }
        return false;
    } catch {
        console.log(erro.lancarMensagem());
        return true;
    }
}

function tratarDados(dados_brutos){
    const QUANTIDADE_OPERACOES = 4; 
    let dados_tratados = [];

    for(let i = 0; i < dados_brutos.quotes.length; i++){

        // Monta a estrutura para tratar os dados coletados pela API
        const dados_estruturados = [
            dados_brutos.quotes[i].date,
            String(dados_brutos.quotes[i].high), 
            String(dados_brutos.quotes[i].low), 
            String(dados_brutos.quotes[i].open),
            String(dados_brutos.quotes[i].close),
            String(dados_brutos.quotes[i].volume)
        ];
        
        // Tratar números com decimais, começa no 1 pois não mexe em data.
        for(let i = 1; i < (QUANTIDADE_OPERACOES + 1); i++){
            let numeroDecimal = false
    
            // Descobrir se o número é quebrado
            for(let j = 0; j < dados_estruturados[i]; j++){
                if(dados_estruturados[i][j] == '.'){
                    numeroDecimal = true;
                    break;
                } else if (j == (dados_estruturados[i].length - 1)){
                    // Caso ele não seja decimal, acrescenta 
                    dados_estruturados[i] = dados_estruturados[i] + '.00';
                }
            }
    
            // Pegar duas casas decimais
            if(numeroDecimal == true){
                let tratamento = dados_estruturados[i].split('.');
                tratamento[1] = tratamento[1].slice(0, 2);
                dados_estruturados[i] = tratamento.join('.');
            }
        }

        // Tratar a data
        let dia = dados_estruturados[0].getDate();
        let mes = (dados_estruturados[0].getMonth() + 1);
        let ano = dados_estruturados[0].getFullYear();

        // Acrescenta o leading zero
        if(dia < 10) {
            dia = '0' + dia;
        }
        if(mes < 10){
            mes = '0' + mes;
        }

        dados_estruturados[0] = dia + '-' + mes + '-' + ano;
    
        dados_tratados.push(new cotacaoDia(dados_estruturados[0], dados_estruturados[1], dados_estruturados[2], dados_estruturados[3], dados_estruturados[4], dados_estruturados[5]));
    }
    return dados_tratados;
}

async function extrairInformacoes(){

    const codigo_acao = 'AAPL';

    const data = {
        // Ano, mês, dia
        data_inicial: '2025-01-03',
        data_final: '2025-01-31'
    }

    // De acordo com a documentação da API, o dia inicial e final não podem ser iguais. Por conta disso, é necessário pular um dia;
    // Condição mais intuitiva para o usuário;
    if(data.data_inicial == data.data_final){
        data.data_final = calcularProximoDia(data);
    }

    // Verifica se as datas inseridas são válidas
    let dataInvalida = verificacaoData(data);
    if(dataInvalida == true){
        return;
    }

    let periodo = {period1: data.data_inicial, period2: data.data_final};
    const dados_brutos = await yahooFinance.chart(codigo_acao, periodo);

    let naoEncontrouAcoes = verificacaoAcaoResultado(dados_brutos);
    if(naoEncontrouAcoes == true){
        return;
    }

    dados_tratados = tratarDados(dados_brutos);
    
    // Caso queira converter para dólar
    let converter_dolar = true;

    if(converter_dolar){
        await cotacaoDolar(dados_tratados, data);
    }
}
extrairInformacoes();