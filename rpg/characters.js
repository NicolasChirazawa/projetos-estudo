class Hero {
    constructor(name, life, attack, stamina){
        this.name = name;
        this.life = life;
        this.attack = attack;
        this.stamina = stamina;

        this.max_life = life;
        this.max_stamina = stamina;
    }

    weak_attack() {

        // Quantidade de energia mínima para o ataque
        if(this.stamina < 10){ 
            console.log(`${this.name} não tem energia suficiente para esse ataque`);
            return -1;
        }

        // O ataque é desferido
        this.stamina = this.stamina - 10;

        // Errar o ataque
        const random_number_miss = Math.floor(Math.random() * 100);
        // Chance de errar
        const miss_chance = 5;

        if(random_number_miss <= miss_chance){
            console.log(`${this.name} errou o ataque...`);
            return 0;
        }
        
        // Dano ser crítico
        const random_number_critical = Math.floor(Math.random() * 100);
        // Chance do dano ser crítico
        const critical_chance = 5;

        if(random_number_critical <= critical_chance){
            let damage = Math.floor(this.attack * 1.15);
            console.log(`Acerto crítico, ${this.name} causou ${damage} de dano!`);
            return damage;
        }

        const possibilidades = [-1, 1];
        const variable_operator_attack = possibilidades[Math.floor(Math.random() * possibilidades.length)];
        const variable_number_attack = Math.floor(Math.random() * 3);

        const damage = (variable_number_attack * variable_operator_attack) + this.attack;

        console.log(`${this.name} causou ${damage} de dano`);
        return damage;
    }

    strong_attack() {
        
        // Quantidade de energia mínima para o ataque
        if(this.stamina < 20){ 
            console.log(`${this.name} não tem energia suficiente para esse ataque`)
            return -1;
        }

        // O ataque é desferido
        this.stamina = this.stamina - 20;

        // Chance de errar o ataque
        const random_number_miss = Math.floor(Math.random() * 100);
        const miss_chance = 15;

        if(random_number_miss <= miss_chance){
            console.log('${this.name} errou o ataque...')
            return
        }
        
        // Chance do dano ser crítico
        const random_number_critical = Math.floor(Math.random() * 100);
        const critical_chance = 3;

        if(random_number_critical <= critical_chance){
            let damage = Math.floor(this.attack * 1.15);
            console.log(`Acerto crítico, ${this.name} causou ${damage} de dano!`);
            return damage;
        }

        const possibilidades = [-1, 1];
        const variable_operator_attack = possibilidades[Math.floor(Math.random() * possibilidades.length)];
        const variable_number_attack = Math.floor(Math.random() * 3);
        const strong_attack_bonus = 10

        const damage = (variable_number_attack * variable_operator_attack) + this.attack + strong_attack_bonus;

        console.log(`${this.name} causou ${damage} de dano`);
        return damage;
    }

    recover_stamina(){
        let recovered_stamina = 15;

        if(recovered_stamina + this.stamina > this.max_stamina){
            recovered_stamina = this.max_stamina - this.stamina;
        }

        this.stamina = this.stamina + recovered_stamina;
        console.log(`${this.name} recuperou ${recovered_stamina} de stamina.`)
    }

    show_status(){
        // Divide em 5 a vida máxima
        const division_life = this.max_life / 5;
        const square_amount_life = Math.floor(this.life / division_life);

        console.log('■'.repeat(square_amount_life) + '-'.repeat(5 - square_amount_life));
        console.log(`Vida atual: ${this.life} / ${this.max_life} \n`);

        // Divide em 5 a stamina máxima
        const division_stamina = this.max_stamina / 5;
        const square_amount_stamina = Math.floor(this.stamina / division_stamina);
        
        console.log('■'.repeat(square_amount_stamina) + '-'.repeat(5 - square_amount_stamina));
        console.log(`Energia atual: ${this.stamina} / ${this.max_stamina}`);
    }
}

class Enemy {
    constructor(name, life, attack, stamina){
        this.name = name;
        this.life = life;
        this.attack = attack;
        this.stamina = stamina;

        this.max_life = life;
        this.max_stamina = stamina;
    }

    weak_attack() {

        // Quantidade de energia mínima para o ataque
        if(this.stamina < 5){ 
            console.log(`${this.name} não tem energia para esse ataque`);
            return -1;
        }

        // O ataque é desferido
        this.stamina = this.stamina - 5;

        // Errar o ataque
        const random_number_miss = Math.floor(Math.random() * 100);
        // Chance de errar
        const miss_chance = 5;

        if(random_number_miss <= miss_chance){
            console.log(`${this.name} errou o ataque...`);
            return
        }
        
        // Dano ser crítico
        const random_number_critical = Math.floor(Math.random() * 100);
        // Chance do dano ser crítico
        const critical_chance = 5;

        if(random_number_critical <= critical_chance){
            let damage = Math.floor(this.attack * 1.15);
            console.log(`Acerto crítico, ${this.name} causou ${damage} dano!`);
            return damage;
        }

        const possibilidades = [-1, 1];
        const variable_operator_attack = possibilidades[Math.floor(Math.random() * possibilidades.length)];
        const variable_number_attack = Math.floor(Math.random() * 3);

        const damage = (variable_number_attack * variable_operator_attack) + this.attack;

        console.log(`${this.name} causou ${damage} de dano`);
        return damage;
    }

    strong_attack() {
        
        // Quantidade de energia mínima para o ataque
        if(this.stamina < 10){ 
            console.log(`${this.name} não tem enegia insuficiente para esse ataque`);
            return -1;
        }

        // O ataque é desferido
        this.stamina = this.stamina - 10;

        // Chance de errar o ataque
        const random_number_miss = Math.floor(Math.random() * 100);
        const miss_chance = 15;

        if(random_number_miss <= miss_chance){
            console.log(`${this.name} errou o ataque...`)
            return 0;
        }
        
        // Chance do dano ser crítico
        const random_number_critical = Math.floor(Math.random() * 100);
        const critical_chance = 3;

        if(random_number_critical <= critical_chance){
            let damage = Math.floor(this.attack * 1.15);
            console.log(`Acerto crítico. ${this.name} causou ${damage} de dano!`);
            return damage;
        }

        const possibilidades = [-1, 1];
        const variable_operator_attack = possibilidades[Math.floor(Math.random() * possibilidades.length)];
        const variable_number_attack = Math.floor(Math.random() * 3);
        const strong_attack_bonus = 10

        const damage = (variable_number_attack * variable_operator_attack) + this.attack + strong_attack_bonus;

        console.log(`${this.name} causou ${damage} de dano`);
        return damage;
    }

    recover_stamina(){
        let recovered_stamina = 7;

        if(recovered_stamina + this.stamina > this.max_stamina){
            recovered_stamina = this.max_stamina - this.stamina;
        }

        this.stamina = this.stamina + recovered_stamina;

        console.log(`${this.name} recuperou ${recovered_stamina} de stamina.`)
    }

    show_status(){
        // Divide em 5 a vida máxima
        const division_life = this.max_life / 5;
        const square_amount_life = Math.floor(this.life / division_life);

        console.log('■'.repeat(square_amount_life) + '-'.repeat(5 - square_amount_life));
        console.log(`(${this.name}) Vida atual: ${this.life} / ${this.max_life} \n`);

        // Divide em 5 a stamina máxima
        const division_stamina = this.max_stamina / 5;
        const square_amount_stamina = Math.floor(this.stamina / division_stamina);
    
        console.log('■'.repeat(square_amount_stamina) + '-'.repeat(5 - square_amount_stamina));
        console.log(`(${this.name}) Energia atual: ${this.stamina} / ${this.max_stamina}`);
    }
}

class Slime extends Enemy {
    constructor(name, life, attack, stamina, color){
        super(name, life, attack, stamina);
        this.color = color;
    }
}

module.exports = {Hero, Enemy, Slime};