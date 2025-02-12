class cotacaoDia {
    constructor(data, alta, baixa, abertura, fechamento, volume){
        this.data = data;
        this.alta = alta;
        this.baixa = baixa;
        this.abertura = abertura;
        this.fechamento = fechamento;
        this.volume = volume;
    }
}

class Erro {
    constructor(codigo){
        this.codigo = codigo;
        this.mensagem = {
            1: 'A data inicial é maior que a data atual.',
            2: 'A data final é maior que a data atual.',
            3: 'A data inicial é maior a data final.',
            4: 'Não foi achado nenhuma ação dentro do código e período inserido',
            5: 'Não foi possível converter a moeda para real'
        }
    }

    lancarMensagem() {
        return this.mensagem[this.codigo];
    }
}

module.exports = { cotacaoDia, Erro };