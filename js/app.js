const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


window.addEventListener('load',  () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();

    //validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){

        //mensaje de error
        mostrarError('Ambos campos son obligatorios');

        return;
    }
    //consultar la API
    consultarAPI(ciudad, pais);


}


function mostrarError(mensaje){
    const alerta = document.querySelector('.error');

    if (!alerta) {
             //crear una alerta
     const alerta = document.createElement('div');

     alerta.classList.add('border-red-400', 'py-3', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'error');

     alerta.innerHTML = `
        <strong class="font-bold">¡Error!</strong>
        <span class="block">${mensaje}</span>
     `;

     container.appendChild(alerta);

     setTimeout(() => {
        alerta.remove();
     }, 3800);
    }

}

function consultarAPI(ciudad, pais){
    
    const appID = 'a02a92d3e55954522a609736febcfed1';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

    spinner(); //muestra un spinner de carga
    
    fetch(url)
        .then( repuesta => repuesta.json())
        .then( datos => {
            limipiarHTML(); //Limpia el HTML previo

            if (datos.cod === "404") {
                
                mostrarError('Ciudad no encontrada')
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos){
    const {name, main: {temp, temp_max, temp_min, humidity}, weather:{0:{icon}}} = datos; //estoy haciendo destructuring al main que que es un objeto de la api que nos retorna los datos que necesitamos, y estoy extrayendo main de su objeto principal por eso aplico el destructuring a main tambien

    console.log(datos);

    const centigrados = kelvinaCentigrados(temp);
    const max = kelvinaCentigrados(temp_max);
    const min = kelvinaCentigrados(temp_min);

    const imagen = ` <img class="imgClima" src="images/${icon}.png">`

    const nameCiudad = document.createElement('h2');
    nameCiudad.innerHTML = `Clima en ${name} ${imagen}`;
    nameCiudad.classList.add('textsh');

    const actual = document.createElement('h1');
    actual.innerHTML = `${centigrados} &#8451`; //lo que sigue de la variable es una entidad de HTML que representa los grados centigrados
    actual.classList.add('actual', 'textsh');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451  /  Min: ${min} &#8451`;
    tempMax.classList.add('max');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad: ${humidity} %`;
    humedad.classList.add('humedad');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white', 'hola');
    resultadoDiv.appendChild(nameCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(humedad);

    resultado.appendChild(resultadoDiv);

}

//hacemos la conversion de grados kelvin a grados centigrados

const kelvinaCentigrados = grados => parseInt(grados - 273.15); 


function limipiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}


function spinner(){
    limipiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-chase');

    divSpinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(divSpinner);
}