const boton = document.getElementById('botonMostrarObras');
const div = document.getElementById('obras');


const sitioBase = 'https://collectionapi.metmuseum.org/public/collection/v1/';

llenarSelectDepartamentos();

function llenarSelectDepartamentos() {
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
    .then(response => response.json())
    .then (data=>{
        console.log("DataDepartamentos",data);
        //console.log("DataDepartamentos",data.department);  

        const select = document.getElementById('departamentos');// para obtener el elemento <select> donde se agregarán las opciones
        data.departments.forEach(departamento => {
            const option = document.createElement('option');
            //console.log("optionA: ",option);
            option.value = departamento.departmentId;
            option.textContent = departamento.displayName;
            select.appendChild(option); //Este método agrega la etiqueta <option> recién creada como hijo del elemento <select>
        }); 
    })

}


boton.addEventListener('click', () => {
    //fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11&hasImages=true')
    //fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11')
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects') // devuelvo los objetos ordenados por ID
        .then(response => response.json())
        .then(data => {
            console.log("data: ",data);
            const objectIDs = data.objectIDs.slice(0, 40); // Obtener los primeros 20 IDs
            console.log("objectIDs: ",objectIDs); 
            const promises = objectIDs.map(id => fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json()));
            return Promise.all(promises);
        })
        .then(objects => renderObjetos(objects))
        //.catch(error => console.error('Error:', error));
});

function renderObjetos(objetos) {
    div.innerHTML = ''; // Limpiar el contenido anterior
    objetos.forEach(obj => {
        let imagenMuseo;
        if (obj.primaryImageSmall) { // verifica que el objeto tenga una imagen
            imagenMuseo=obj.primaryImageSmall;
        }else{
            imagenMuseo='./Imagenes/sinImage2.jpeg';
        }
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${imagenMuseo}" alt="${obj.title}">
            <h3>ID: ${obj.objectID}</h3>
            <h3>Titulo: ${obj.title}</h3>
            <h4>Cultura: ${obj.culture}</h3>
            <h4>Dinastía: ${obj.dynasty}</h3>
        `;  //<p>${obj.artistDisplayName}</p>
        div.appendChild(card);
        // cierre del if
    });
}