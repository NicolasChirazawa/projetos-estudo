let listaPontos = [];
let listaPontosRemovidos = [];

addEventListener("click", (e) => {
    colocarPonto(e);
});

function colocarPonto(valor){
    
    // Se clicar sobre qualquer botão, não executa
    if(valor.target.nodeName == "BUTTON") { return }

    // Cria o quadrado e dá a classe
    const novaDiv = document.createElement("div");
    novaDiv.id = "quadrado";

    // Indica a posição
    novaDiv.style.left = valor.clientX + 'px';
    novaDiv.style.top = valor.clientY + 'px';

    // Adiciona oa HTML
    const seletor = document.getElementById("pontos").appendChild(novaDiv);

    // Coloca na pilha
    listaPontos.push(novaDiv);
}

function tirarPonto(){
    
    // Interrompe a retira de elementos não existentes
    if(listaPontos.length == 0) { return } 

    listaPontosRemovidos[listaPontosRemovidos.length] = listaPontos[listaPontos.length - 1];

    listaPontos[listaPontos.length - 1].remove();
    listaPontos.pop();

    console.log(listaPontos)
    console.log(listaPontosRemovidos)
}

function recuperarPonto(){
    
    // Interrompe a retira de elementos não existentes
    if(listaPontosRemovidos.length == 0) { return } 

    const seletor = document.getElementById("pontos").appendChild(listaPontosRemovidos[listaPontosRemovidos.length - 1]);

    listaPontos.push(listaPontosRemovidos[listaPontosRemovidos.length - 1])
    listaPontosRemovidos.pop();

    console.log(listaPontosRemovidos)
}