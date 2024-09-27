document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const objectID = params.get('objectID');

    if (objectID) {
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('datos-obra').innerText = `Fecha de creación: ${data.objectDate || 'No disponible'} | Cultura: ${data.culture || 'No disponible'}`;

                // Fetch para traducción del título
                if (data.title) {
                    fetch(`/traducir/${encodeURIComponent(data.title)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }
                            return response.json();
                        })
                        .then(traduccionData => {
                            document.getElementById('titulo-obra').innerText = traduccionData.translation || 'Título no disponible';
                        })
                        .catch(error => console.error('Error en la traducción del título:', error));
                }

                // Fetch para traducción de la cultura
                if (data.culture) {
                    fetch(`/traducir/${encodeURIComponent(data.culture)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Falla en la respuesta de la red ' + response.statusText);
                            }
                            return response.json();
                        })
                        .then(traduccionData => {
                            const datosObra = document.getElementById('datos-obra');
                            datosObra.innerText = datosObra.innerText.replace(data.culture, traduccionData.translation || 'Cultura no disponible');
                        })
                        .catch(error => console.error('Error en la traducción de la cultura:', error));
                }

                // Fetch para traducción de la fecha
                if (data.objectDate) {
                    fetch(`/traducir/${encodeURIComponent(data.objectDate)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }
                            return response.json();
                        })
                        .then(traduccionData => {
                            const datosObra = document.getElementById('datos-obra');
                            datosObra.innerText = datosObra.innerText.replace(data.objectDate, traduccionData.translation || 'Fecha no disponible');
                        })
                        .catch(error => console.error('Error en la traducción de la fecha:', error));
                }

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
            .catch(error => console.error('Error en la obtención de datos del objeto:', error));
    }

    document.getElementById('boton-volver').addEventListener('click', () => {
        history.back();
    });
});
