const boton = document.getElementById('botonMostrarObras');
const botonBuscar=document.getElementById('botonBuscar');
const departamentos=document.getElementById('departamentos');
const palabraClave=document.getElementById('PalabraAbuscar');
const ubicacion=document.getElementById('ubicacion');
const div = document.getElementById('obras');


const sitioBase = 'https://collectionapi.metmuseum.org/public/collection/v1/';


//-------------------------Llenar con los departamentos el select -------------------------------------
llenarSelectDepartamentos();

function llenarSelectDepartamentos() {

    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
    .then(response => response.json())
    .then (data=>{
        console.log("DataDepartamentos",data);
        //console.log("DataDepartamentos",data.department);  

        const select = document.getElementById('departamentos');// para obtener el elemento <select> donde se agregarán las opciones
        const option = document.createElement('option');
        option.value=0; option.textContent="Todos"
        select.appendChild(option); //agrega la opcion por defecto "todos"
        data.departments.forEach(departamento => {
            const option = document.createElement('option');
            //console.log("optionA: ",option);
            option.value = departamento.departmentId;
            option.textContent = departamento.displayName;
            select.appendChild(option); //Este método agrega la etiqueta <option> recién creada como hijo del elemento <select>
        }); 
    })

}

//-----------------------funcion buscar----------------------------------------------------
let paginaActual=1;
const ItemsPorPagina=20;

botonBuscar.addEventListener('click', (event) => {
    console.log('click buscar');
    event.preventDefault(); // Evita que el formulario se envíe
    paginaActual = 1; // Reinicia la página actual en cada busqueda
    BuscaryPintar();
});

function BuscaryPintar(){
    //botonBuscar.addEventListener('click', (event) => {
        //console.log('click buscar');
        // event.preventDefault(); // Evita que el formulario se envíe
        //--------para palabra a buscar-------
        let termino = palabraClave.value;
        if (!palabraClave.value) {
            termino = "*";
        }

        //--------para ubicacion-------------
        console.log("ubi: ", ubicacion.value);
        let ubi = "";
        if (ubicacion.value && ubicacion.value !== "0") {
            const selectedOption = ubicacion.options[ubicacion.selectedIndex];
            ubi = `&geoLocation=${selectedOption.text}`;
            console.log("ubi: ", ubi);
        }

        //--------para departamentos----------
        let dpto = "";
        if (departamentos.value && departamentos.value !== "0") {
            dpto = `&departmentId=${departamentos.value}`;
            console.log("dpto: ", dpto);
        }

        // Construcción de la URL
        let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${termino}`;

        if (ubi) { // se evalua como verdadero sino es un cadena vacia como ""
            console.log('if ubi', ubi);
            url += ubi;
        }
        if (dpto) { // se evalua como verdadero sino es un cadena vacia como ""
            console.log('if dpto: ', dpto);
            url += dpto;
        }
        console.log('URL:', url);

        //---------------------------------fin gpt-----------
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.objectIDs) {               //console.log("data.objectIDs: ", data.objectIDs); 
                    const totalItems = data.total; //console.log("totalItems: ", totalItems);
                    const totalPaginas = Math.ceil(totalItems / ItemsPorPagina); //console.log("totalPages: ", totalPages);// Math.ceil redondea hacia arriba
                    const inicio = (paginaActual - 1) * ItemsPorPagina;
                    const fin = inicio + ItemsPorPagina;
                    const dataId = data.objectIDs.slice(inicio, fin); console.log("dataId: ", dataId); // Obtener los primeros 20 IDs
                    
                    const promises = dataId.map(id => 
                    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
                        .then(res => res.json())
                );
    
                Promise.all(promises)
                    .then(objects => {
                        renderObjetos(objects)
                        renderPaginas(totalPaginas)
                    })
                    .catch(error => console.error('Error:', error));
            }else{
                console.log("no hay objetos");
            }
            })
            .catch(error => console.error('Error:', error));
            
    //});

}
// paginacion sin limite
/*function renderPaginas(totalPaginas) {
    const paginacionDiv = document.getElementById('paginacion');
    paginacionDiv.innerHTML = '';//limpio el div de paginacion

    for (let i = 1; i <= totalPaginas; i++) {
        const BotonPagina = document.createElement('button');
        BotonPagina.textContent = i;
        BotonPagina.addEventListener('click', () => {
            paginaActual = i;
            BuscaryPintar();
        });
        paginacionDiv.appendChild(BotonPagina);
    }
}*/

// paginacion con limite
const maxBotonesPaginacion = 10;
function renderPaginas(totalPaginas) {
    const paginacionDiv = document.getElementById('paginacion');
    paginacionDiv.innerHTML = ''; // Limpiar el div de paginación

    // Calcular el rango de páginas a mostrar
    const BotonPrimero = Math.max(1, paginaActual - Math.floor(maxBotonesPaginacion / 2));
    const BotonFinal = Math.min(totalPaginas, BotonPrimero + maxBotonesPaginacion - 1);

    // Botón "Anterior"
    if (BotonPrimero> 1) {
        const botonAnterior = document.createElement('button');
        botonAnterior.textContent = 'Anterior';
        botonAnterior.addEventListener('click', () => {
            paginaActual -=  - 1;
            BuscaryPintar();
        });
        paginacionDiv.appendChild(botonAnterior);
    }

    // Botones de páginas
    for (let i = BotonPrimero; i <= BotonFinal; i++) {
        const BotonPagina = document.createElement('button');
        BotonPagina.textContent = i;
        BotonPagina.className = (i === paginaActual) ? 'active' : '';
        BotonPagina.addEventListener('click', () => {
            paginaActual = i;
            BuscaryPintar();
        });
        paginacionDiv.appendChild(BotonPagina);
    }

    // Botón "Siguiente"
    if (BotonFinal < totalPaginas) {
        const botonSiguiente = document.createElement('button');
        botonSiguiente.textContent = 'Siguiente';
        botonSiguiente.addEventListener('click', () => {
            paginaActual += 1;
            BuscaryPintar();
        });
        paginacionDiv.appendChild(botonSiguiente);
    }
}


//----------------- Mostrar todos los objetos sin busqueda---------------------------------
boton.addEventListener('click', () => {
    console.log('click mostrar todo')
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

//-------------------Render Objetos ------------------------------------------------
function renderObjetos(objetos) {
    console.log("objetos: ",objetos);
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
//--------------------------------------------------------------------------------------