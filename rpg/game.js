const {declareHero, declareEnemies, sleep, hero_turn, check_enemy, enemy_turn, check_hero, enemy_status} = require('./functions')

async function main() {

    console.log('[1]: Guerreiro | Mais vida \n' +
                '[2]: Bárbaro | Mais ataque \n');

    let hero = declareHero();

    console.clear();
    await sleep(1);

    console.log(`Um novo ${hero.name} nasce para lutar contra o mal!`);

    await sleep(1,5);
    console.clear();
    await sleep(1);

    console.log('[1]: Fácil | 2 Inimigos \n' + 
                '[2]: Médio | 4 Inimigos \n' +
                '[3]: Difícil | 5 Inimigos (Boss)');

    let enemies = declareEnemies();

    await sleep(1);
    console.clear();
    await sleep(1);

    let enemy_counter = 0;
    let closing_text = ''

    while(true) {
        
        hero_turn(hero, enemies[enemy_counter]);

        // Se derrotou o inimigo, a condicao é maior que 0
        let enemy_life_check = check_enemy(enemies, enemy_counter);
        if(enemy_life_check == 'Derrota'){ 

            // Condição que todos os inimigos foram derrotados / Fim do jogo
            if(enemy_counter == enemies.length - 1){ 
                closing_text = 'O herói venceu';
                break;
            }

            // Acrescenta o inimigo
            enemy_counter++;
        }

        enemy_turn(hero, enemies[enemy_counter]);
    
        let hero_check_life = check_hero(hero);
        if(hero_check_life == 'Derrota') {
            // Fim do jogo
            closing_text = 'Os monstros venceram'
            break;
        }

        enemy_status(enemies[enemy_counter]);
    }
    
    await sleep(1);
    console.clear();
    console.log(`${closing_text}`);
}

main();