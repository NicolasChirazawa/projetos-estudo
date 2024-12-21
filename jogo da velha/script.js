const SEM_LANCE = 0;
const JOGO_EM_ANDAMENTO = '';

const jogo = {
   
    /*
     0: Sem lance,
     1: Lance X,
     2: Lance Y
    */

    posicaoValor: [SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE],
    lance: 1,
    quantidadeLance: 0,
    resultado: JOGO_EM_ANDAMENTO,
}

const resultado = {

    /*
        1: Empate
        2: Vitória do X
        3: Vitória do O
    */
    score: [0, 0, 0],
}


addEventListener("click", (e) => {

    //Obtenho a tag clicada e o id indicado
    let valor = [e.target.localName, Number(e.target.attributes.id?.nodeValue)];

    if(valor[0] != 'td' && valor[0] != 'p') { return }

    // Verificação para certificar se o jogo está encerrado
    if(jogo.resultado != JOGO_EM_ANDAMENTO) { 
        console.log(jogo.resultado);
        return 
    }

    // Verificação sobre validade ou não do lance
    if(jogada(valor) == 'Inválido') { 
        mudarTextoLinha("Lance Inválido");
        return 
    };

    // Caso caia num return, independente do resultado, vai entrar no if
    let conclusao = condicaoVitoria();

    if(conclusao == 'Vitória do O' || conclusao == 'Vitória do X' || conclusao == 'Empate'){
        pontuador(jogo.resultado);
        mudarFrasePontuador(jogo.resultado);
        mudarTextoLinha(jogo.resultado);
        gerarBotaoReiniciar();
    }
})

function mudarTextoLinha (texto) {
    let frase = document.getElementById("frase");
    frase.innerHTML = `${texto}`
}

function jogada(valor) {
    
    if (jogo.posicaoValor[valor[1] - 1] != SEM_LANCE) { 
        console.log('teste')
        return 'Inválido'
    } else {
        jogo.posicaoValor[valor[1] - 1] = jogo.lance;
        mudarCaractere(valor);
        passarLance();
    }
}

function mudarCaractere (valor) {
    let letra = document.getElementById(String(valor[1]));

    if(jogo.lance == 1){
        letra.children[0].innerHTML = 'X';
    } else {
        letra.children[0].innerHTML = 'O';
    }
}

function passarLance() {
    if(jogo.lance % 2 == 0){
        jogo.lance = 1;
        mudarTextoLinha("Vez do X");
    } else {
        jogo.lance++;
        mudarTextoLinha("Vez do O");
    }
}

function condicaoVitoria() {
    
    // Vitória
    for(let i = 0; i < jogo.posicaoValor.length; i++){
        // Verificação horizontal
        for(let j = 1; j <= 2; j++){
            if (jogo.posicaoValor[0 + (i * 3)] == j && jogo.posicaoValor[1 + (i * 3)] == j && jogo.posicaoValor[2 + (i * 3)] == j){

                console.log('horizontal');
                jogo.resultado = j % 2 == 0 ? 'Vitória do O' : 'Vitória do X';
                
                return jogo.resultado;
            }

        // Verificação vertical
            if (jogo.posicaoValor[0 + i] == j && jogo.posicaoValor[3 + i] == j && jogo.posicaoValor[6 + i] == j){
                console.log('vertical');
                jogo.resultado = j % 2 == 0 ? 'Vitória do O' : 'Vitória do X';
                
                return jogo.resultado;
            }
        }
    }
    for(let i = 1; i <= 2; i++){
        // Verificação diagonais
        if(jogo.posicaoValor[0] == i && jogo.posicaoValor[4] == i && jogo.posicaoValor[8] == i){
            console.log("diagonal");
            jogo.resultado = i % 2 == 0 ? 'Vitória do O' : 'Vitória do X';
            
            return jogo.resultado;
        }
        if(jogo.posicaoValor[2] == i && jogo.posicaoValor[4] == i && jogo.posicaoValor[6] == i){
            console.log("diagonal");
            jogo.resultado = i % 2 == 0 ? 'Vitória do O' : 'Vitória do X';
            
            return jogo.resultado;
        }
    }

    // Contador de lance para testar empate
    jogo.quantidadeLance++;

    // Empate
    if(jogo.quantidadeLance == 9) { 
        jogo.resultado = 'Empate'; 
        
        return jogo.resultado;
    }
}

function pontuador(conclusao) {

    if(conclusao == 'Vitória do X'){
        resultado.score[1]++;
    } else if (conclusao == 'Vitória do O'){
        resultado.score[2]++;
    } else {
        resultado.score[0]++;
    }
}

function mudarFrasePontuador(conclusao){
    
    //Transformar o 'possibilidades' num hashmap para organização

    let resposta = '';
    let contador = 0;
    let possibilidades = [['Empate', "empate"], ['Vitória do X', "pontoX"], ['Vitória do O', "pontoO"]];

    // Descobrindo quem mudou
    for(let i = 0; i < possibilidades.length; i++){
        if(possibilidades[i][0] == conclusao){
            resposta = possibilidades[i];
            break;
        }
        contador++;
    }

    console.log(resposta);
    console.log(contador);

    let frase = document.getElementById(`${resposta[1]}`);
    frase.innerHTML = resposta[0] + ": " + resultado.score[contador];

    //console.log(frase);
}

function gerarBotaoReiniciar() {
    const novoBotao = document.createElement("button");
    const textoBotao = document.createTextNode("Reiniciar");

    novoBotao.appendChild(textoBotao);
    let frase = document.getElementById("frase");
    document.body.insertBefore(novoBotao, frase.nextSibling);

    novoBotao.classList.add('botaoEstilo');

    // Adicionar função de reiniciar
    novoBotao.addEventListener("click", () => {
        reiniciar();
        novoBotao.remove();
        mudarTextoLinha("Nova partida");
    })
}

function reiniciar() {   
    jogo.posicaoValor = [SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE, SEM_LANCE]

    for(let i = 0; i < (jogo.posicaoValor.length); i++){
        let textoInterno = document.getElementById(`${i + 1}`);

        textoInterno.children[0].innerHTML = '';
        jogo.lance = 1;
        jogo.quantidadeLance = 0;
        jogo.resultado = JOGO_EM_ANDAMENTO;
    }
}