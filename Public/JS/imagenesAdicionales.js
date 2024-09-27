document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const objectID = params.get('objectID');

    if (objectID) {
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
            .then(response => response.json())
            .then(data => {
                // Actualiza el título y los datos del objeto
                document.getElementById('datos-obra').innerText = `Fecha de creación: ${data.objectDate || 'No disponible'} | Cultura: ${data.culture || 'No disponible'}`;
                
                // Fetch para traducción del título
                fetch(`/traducir/${encodeURIComponent(data.title)}`)
                .then(response => response.json())
                .then(traduccionData => {
                    document.getElementById('titulo-obra').innerText = traduccionData.translation || 'Título no disponible';
                })
                .catch(error => console.error('Error:', error));

                // Fetch para traducción de la cultura
                fetch(`/traducir/${encodeURIComponent(data.culture)}`)
                .then(response => response.json())
                .then(traduccionData => {
                    const datosObra = document.getElementById('datos-obra');
                    datosObra.innerText = datosObra.innerText.replace(data.culture, traduccionData.translation || 'Cultura no disponible');
                })
                .catch(error => console.error('Error:', error));

                // Fetch para traducción de la fecha
                fetch(`/traducir/${encodeURIComponent(data.objectDate)}`)
                .then(response => response.json())
                .then(traduccionData => {
                    const datosObra = document.getElementById('datos-obra');
                    datosObra.innerText = datosObra.innerText.replace(data.objectDate, traduccionData.translation || 'Fecha no disponible');
                })
                .catch(error => console.error('Error:', error));

                // Carga las imágenes adicionales
                const imagenesAdicionalesDiv = document.getElementById('imagenes-adicionales');
                data.additionalImages.forEach(imageUrl => {
                    const webLargeImageUrl = imageUrl.replace('/original/', '/web-large/');
                    const img = document.createElement('img');
                    img.src = webLargeImageUrl;
                    img.alt = `Imagen adicional de ${data.title}`;
                    imagenesAdicionalesDiv.appendChild(img);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Añade el evento al botón "Volver"
    document.getElementById('boton-volver').addEventListener('click', () => {
        history.back();
    });
});

