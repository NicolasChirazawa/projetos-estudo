require('dotenv').config();

/**  Tipagem
    @param {string} api 
    @param {string} cidade
    
    @returns {object}
*/
async function requestInformations(city){
    try{
        // Trazer a chave do dot.env
        const requestion = await fetch(`https://api.weatherapi.com/v1/current.json?q=${city}&lang=pt&key=${process.env.API_KEY}`);

        // Caso caia aqui, vai para o catch
        if(requestion.statusText != 'OK'){
            throw new Error(`${requestion.statusText}`)
        }

        const data = await requestion.json();

        let date = data.location.localtime.split(' ');
        // Usa o '-' para separar (aaaa / mm / dd), inverte os valores do array (dd / mm / aaaa), e os junta num único valor com o '-' novamente
        date[0] = date[0].split('-').reverse('').join('-');
        
        /* Poderia também inserir como chave, mas por serem várias entradas, não acho que faça sentido
            values['icon'] = data.current.condition.icon;
        */

        const values = {
            date: date[0],
            hour: date[1],
            country: data.location.country,
            city: data.location.name,
            temperature: data.current.temp_c + '°C',
            state: data.current.condition.text,
            icon: data.current.condition.icon
        };

        console.log(values);
        return values;
    } catch (e) {
        console.error(e);
    }
}

requestInformations('Sao Paulo');