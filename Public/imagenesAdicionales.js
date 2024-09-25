document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const objectID = params.get('objectID');

    if (objectID) {
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
            .then(response => response.json())
            .then(data => {
                // Actualiza el título y los datos del objeto
                document.getElementById('titulo-obra').innerText = data.title || 'Título no disponible';
                document.getElementById('datos-obra').innerText = `Fecha de creación: ${data.objectDate || 'No disponible'} | Cultura: ${data.culture || 'No disponible'}`;

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

//  evento al botón de volver
/*document.getElementById('volver-btn').addEventListener('click', () => {
    window.history.back();
});*/

});

