const readlineSync = require('readline-sync');
const character = require('./characters');

function declareHero() {

    // Declarado fora do while por causa do return, ia ter problema de escopo
    let hero;

    // Deve permanecer em execução até dar o 'break';
    while (true) {
        let id = readlineSync.question('Escolha seu heroi: ');
        let exit = false;
        
        let life, attack, stamina;

        switch(id){
            case '1':

                // Valores base
                life = 80;
                attack = 15;
                stamina = 30;

                hero = new character.Hero('Guerreiro', life, attack, stamina);

                exit = true;
                break;

            case '2':

                // Valores base + randômicos
                life = 50;
                attack = 20;
                stamina = 40;

                hero = new character.Hero('Bárbaro', life, attack, stamina);

                exit = true;
                break;

            default:
                console.log('Insira um valor válido');
        }

        if(exit == true) { break }
    }

    return hero;
}

function declareEnemies(){
    
    // Quantidade de inimigos de acordo com a dificuldade escolhida (easy / medium / hard)
    let difficulty = [2, 4, 5];
    let enemies = [];

    while(true) {
        let id = readlineSync.question('\n' + 'Qual a dificuldade que voce escolhera? ');

        // É necessário usar o 'id' como número
        id = Number(id);

        // Para o loop
        let stop = false;

        // Aqui é mais interessante mudar a lógica pois os inimigos são os mesmos quando redeclarados, nesse sentido, é diferente do 'Hero'.
        if(id >= 1 && id <= difficulty.length) {

            // A quantidade de inimigos é baseado no array difficulty, como array começa no 0, subtai-se 1.
            for(let i = 0; i < difficulty[id - 1]; i++){
                const colors = ['amarelo', 'laranja', 'vermelho', 'verde', 'roxo'];
                
                const life = 30 + Math.floor(Math.random() * 5);
                const attack = 10 + Math.floor(Math.random() * 5);
                const stamina = 10 + Math.floor(Math.random() * 5);
                const color = colors[Math.floor(Math.random() * colors.length)];

                enemies.push(new character.Slime("Slime", life, attack, stamina, color));
                stop = true;
            }
        } else {
            console.log('Insira um valor válido');
        }

        if(stop == true) { break }
    }
    return enemies;
}

async function sleep (seconds){
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

function hero_turn(hero, enemies){
    
    while(true) {
        // Está aqui, não no 'game.js', por conta de poder aparecer mais de uma vez no mesmo turno do herói
        console.log('[1] Ataque fraco \n' +
                    '[2] Ataque forte \n' +
                    '[3] Recarregar energia \n' +
                    '[4] Ver status do herói');

        let id = readlineSync.question("Qual e a sua opcao? ");
        
        let finish_turn = false;

        switch(id){
            case '1':

                console.clear();
                const weak_attack_value = hero.weak_attack();

                if(weak_attack_value != -1){
                    enemies.life = enemies.life - weak_attack_value;
                    finish_turn = true;
                }

                break;
            
            case '2':

                console.clear();
                const strong_attack_value = hero.strong_attack();

                if(strong_attack_value != -1){
                    enemies.life = enemies.life - strong_attack_value;
                    finish_turn = true;
                }
                
                break;
            
            case '3':

                console.clear();
                hero.recover_stamina();
                finish_turn = true;
                break;

            case '4':

                console.clear();
                hero.show_status();

                readlineSync.question('\n' + 'Pressione [Enter] para seguir...', {hideEchoBack: true, mask: ''});
                console.clear();
                
                // Não tem finish turn
                break;

            default:
                console.log('Insira um valor válido.')
        }

        if(finish_turn == true) { break }
    }
}

function check_enemy(enemies, enemy_number){
    if(enemies[enemy_number].life <= 0){
        return 'Derrota';
    }
}

function enemy_turn(hero, enemies){
    
    let id = Math.floor((Math.random() * 2) + 1);
    let finish_turn = false;
    let ataque_invalido = false;

    while(true) {

        if(ataque_invalido == true){ id = 3 }

        switch(id){
            case 1:

                const weak_attack_value = enemies.weak_attack();

                if(weak_attack_value != -1){
                    hero.life = hero.life - weak_attack_value;
                    finish_turn = true;
                } else {
                    ataque_invalido = true;
                }

                break;
            
            case 2:
                const strong_attack_value = enemies.strong_attack();

                if(strong_attack_value != -1){
                    hero.life = hero.life - strong_attack_value;
                    finish_turn = true;
                } else {
                    ataque_invalido = true;
                }
                
                break;
            
            case 3:

                enemies.recover_stamina();
                finish_turn = true;
                break;
        }

        if(finish_turn == true) { break }
    }
}

function check_hero(hero){
    if(hero.life <= 0){
        return 'Derrota'
    }
}

function enemy_status(enemies){
    enemies.show_status();
    console.log('');
}

module.exports = {declareHero, declareEnemies, sleep, hero_turn, check_enemy, enemy_turn, check_hero, enemy_status}