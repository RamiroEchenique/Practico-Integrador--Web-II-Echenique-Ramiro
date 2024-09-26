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
        //--------para palabra a buscar----------------------------------------
        let termino = palabraClave.value;
        if (!palabraClave.value) {
            termino = "*";
        }

        //--------para ubicacion------------------------------------------------
        console.log("ubi: ", ubicacion.value);
        let ubi = "";
        if (ubicacion.value && ubicacion.value !== "0") {
            const selectedOption = ubicacion.options[ubicacion.selectedIndex];
            ubi = `&geoLocation=${selectedOption.text}`;
            console.log("ubi: ", ubi);
        }

        //--------para departamentos--------------------------------------------
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

        //---------------------------------fin -----------
    
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
}


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


//----------------- Mostrar objetos al inicio ---------------------------------

    console.log('click mostrar todo')
    //fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11&hasImages=true')
    //fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11')
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects') // devuelvo los objetos ordenados por ID
        .then(response => response.json())
        .then(data => {
            console.log("data: ",data);
            const objectIDs = data.objectIDs.slice(114201, 114209); // muestra al azar 
            console.log("objectIDs: ",objectIDs); 
            const promises = objectIDs.map(id => fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json()));
            return Promise.all(promises);
        })
        .then(objects => renderObjetos(objects))
        .catch(error => console.error('Error:', error));


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
            <img src="${imagenMuseo}" alt="${obj.title}" title="Fecha de creacion: ${obj.objectDate} ">
            <!--<h3>ID: ${obj.objectID}</h3> -->
            <h3 class="titulo-tarjeta"><span id="titulo-traducido${obj.objectID}">No disponible</span></h3>
            <h4 class="dinastia-cultura">Dinastía: <span id="dinastia-traducida${obj.objectID}">No disponible</span></h4>   
            <h4 class="dinastia-cultura">Cultura: <span id="cultura-traducida${obj.objectID}">No disponible</span></h4>
            ${obj.additionalImages && obj.additionalImages.length > 0 ?
                 `<button class="boton-tarjeta" onclick="window.location.href='imagenesAdicionales.html?objectID=${obj.objectID}'">Ver más imágenes</button>` : ''}
        `;  
        div.appendChild(card);
        
        // Fetch para traduccion del titulo
        if (obj.title != ""){
        fetch(`/traducir/${encodeURIComponent(obj.title)}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`titulo-traducido${obj.objectID}`).innerText = data.translation;
            })
            .catch(error => console.error('Error:', error));
        }

        // Fetch para traduccion de la dinastia
        if (obj.dynasty != ""){
            fetch(`/traducir/${encodeURIComponent(obj.dynasty)}`)
            //fetch(`/traducir/${encodeURIComponent("how are you?")}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`dinastia-traducida${obj.objectID}`).innerText = data.translation;
            })
            .catch(error => console.error('Error:', error));
        }

        // Fetch para traduccion de cultura
        if (obj.culture != ""){
            fetch(`/traducir/${encodeURIComponent(obj.culture)}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`cultura-traducida${obj.objectID}`).innerText = data.translation;
            })
            .catch(error => console.error('Error:', error));
        }
    });
}
//--------------------------------------------------------------------------------------