const boton = document.getElementById('botoFetchPersonajes');
const div = document.getElementById('personajes');

/*
Este código hace lo siguiente:

Solicita una lista de IDs de objetos del Met Museum.
Toma los primeros 20 IDs de esa lista.
Hace solicitudes paralelas para obtener los detalles de cada uno de esos 20 objetos.
Una vez que tiene todos los detalles, llama a renderObjetos para mostrar los objetos en la página.
*/ 

boton.addEventListener('click', () => {
    console.log('Fetch API');
    //fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects') 
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects?hasImages=true') // solicita una lista de IDs de objetos del museo con imagenes hasImages=true
        .then((response) => response.json()) // respuesta de la API en formato JSON
        .then((data) => {
            const objectIDs = data.objectIDs.slice(0, 40); // obtiene los primeros 20 objetos IDs de la lista
            return Promise.all(objectIDs.map(id => fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json()))); // para cada ID en objectIDs, hace una solicitud a la API para obtener el objeto correspondiente
        })
        .then((objetos) => renderObjetos(objetos)); // El arreglo de objetos se pasa como argumento a renderObjetos para renderizar las tarjetas
});

function renderObjetos(objetos) {
    div.innerHTML = ''; // Limpiar el contenido anterior
    objetos.forEach(obj => {
        //if (obj.primaryImageSmall) { // verifica que el objeto tenga una imagen
            
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${obj.primaryImageSmall}" alt="${obj.title}">
            <h3>ID: ${obj.objectID}</h3>
            <h3>Titulo: ${obj.title}</h3>
            <h4>Cultura: ${obj.culture}</h3>
            <h4>Disanstía: ${obj.dynasty}</h3>
        `;  //<p>${obj.artistDisplayName}</p>
        div.appendChild(card);
        //} // cierre del if
    });
}