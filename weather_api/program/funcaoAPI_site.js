function getInputs(){
    const paramters = [];

    const city = document.getElementById("city_input");
    paramters.push(String(city.value));

    const api_key = document.getElementById("key_api_input");
    paramters.push(String(api_key.value));

    return paramters;
}

/**  Tipagem
    @param {string} city
    @param {string} api_key
    
    @returns {object}
*/

async function requestInformations(city, api_key){
    let weather_data;
    let status_error = '';

    try{
        // Documentação da API para fazer o request (https://app.swaggerhub.com/apis-docs/WeatherAPI.com/WeatherAPI/1.0.2#/APIs/realtime-weather)
        const requestion = await fetch(`https://api.weatherapi.com/v1/current.json?q=${city}&lang=pt&key=${api_key}`);

        // Meio de pegar o 'body' antes de encerrar o request e assim, teria apenas o body.
        const data = await requestion.json();

        if(requestion.status != '200'){
            status_error = data;
            // O 'throw' leva ao 'catch'
            throw new Error (JSON.stringify(data, null, 4));
        }

        const date = data.location.localtime.split(' ');
        // Usa o '-' para separar (aaaa / mm / dd), inverte os valores do array (dd / mm / aaaa), e os junta num único valor com o '-' novamente.
        date[0] = date[0].split('-').reverse('').join('-');
        
        /* Poderia também inserir como chave, mas por serem várias entradas, acho da outra forma mais legível.
            weather_data['icon'] = data.current.condition.icon;
        */

        weather_data = {
            date: date[0],
            hour: date[1],
            country: data.location.country,
            city: data.location.name,
            temperature: data.current.temp_c + '°C',
            state: data.current.condition.text,
            icon: 'http:' + data.current.condition.icon,
        }
    } catch (e) {
        console.error(e);
    }
    finally {
        let response = [];
        let isError;

        if(status_error != ''){
            isError = true;
            response = [status_error, isError]
        } else {
            isError = false;
            response = [weather_data, isError];
        }
        return response;
    }
}

function createDiv(){
    const newDiv = document.createElement("div");
    const footer = document.getElementById("footer");
    
    document.body.insertBefore(newDiv, footer);

    return newDiv;
}

function createDivError(error_data){
    const divError = document.getElementById("error_div");
    const error_message = document.createElement("p");

    error_message.innerHTML = error_data.error.message;
    divError.append(error_message);
}

function createDivWeather(weather_data){
    // Div que acomoda toda a seção do clima
    const divWeather = document.getElementById("weather_div");
    
    // Div para o quadrado do painel do clima
    const panelWeather = document.createElement("div");
    divWeather.append(panelWeather);
    panelWeather.id = 'panelWeather';

    // Div da primeira coluna do painel
    const firstLayer = document.createElement("div");
    panelWeather.append(firstLayer);
    firstLayer.id = 'firstLayer';

    // Dar cidade e país
    const city_country_text = document.createElement("p");
    city_country_text.innerHTML = weather_data.country + ', ' + weather_data.city;

    // Dar dia e hora
    const hour_day_text = document.createElement("p");
    hour_day_text.innerHTML = weather_data.date + ' ' + weather_data.hour; 

    firstLayer.append(city_country_text, hour_day_text);

    // Div da segunda coluna do painel
    const secondLayer = document.createElement("div");
    panelWeather.append(secondLayer);
    secondLayer.id = 'secondLayer'; 

    // Plotagem do ícone e temperatura
    const icon = document.createElement("img");
    icon.setAttribute("src", weather_data.icon);

    const temperature = document.createElement("p");
    temperature.innerHTML = weather_data.temperature;

    secondLayer.append(icon, temperature);

    // Div da terceira coluna do painel
    const thirdLayer = document.createElement("div");
    panelWeather.append(thirdLayer);
    thirdLayer.id = 'thirdLayer';

    const state = document.createElement("p");
    state.innerHTML = weather_data.state;

    thirdLayer.append(state);
}

function resetDiv(){
    const error_div = document.getElementById("error_div");
    const weather_div = document.getElementById("weather_div");

    if(error_div != null){
        error_div.parentElement.removeChild(error_div);
    } else if (weather_div != null) {
        weather_div.parentElement.removeChild(weather_div);
    }
}

async function showInformation() {
    resetDiv();

    // Captura os campos (cidade e chave da API).
    const inputs = getInputs();

    // Retorna os dados do erro ou do tempo e um identificador de qual dos dois é.
    const data = await requestInformations(inputs[0], inputs[1]);

    // Cria uma nova div, e volta a div criar
    newDiv = createDiv();

    if(data[1] == false){
        newDiv.id = 'weather_div';

        weather_data = data[0];
        createDivWeather(weather_data);
    } else {
        newDiv.id = 'error_div';

        error_data = data[0];
        createDivError(error_data);
    }
}