const express    = require('express');
//const http       = require("node:http");
const translate = require('node-google-translate-skidz');//importar libreria para traducir
const path       = require('path');
const app        = express();
const port       = process.env.PORT || 3000;

//middlewares 
app.use(express.static('Public/'));
app.use(express.json());//para leer json


// Ruta para  la traducción
app.get('/traducir/:text', function(request, response) {
    const textoAtraducir = request.params.text;
    
    translate({
        text: textoAtraducir,
        source: 'auto', // Autodetectar el idioma de origen
        target: 'es'   // Traducir siempre al español
    }, function(result) {
        console.log(result);
        response.send(result); // Enviar el resultado al navegador
    });
});

  // Ruta para servir el archivo index.html
app.use(express.static(__dirname + "/Public/"));
app.get('/', function(request, responce){
    responce.sendFile(path.join(__dirname, 'index.html'));
})


// Ruta para servir verImagenesAdicionales.html
app.use(express.static(__dirname + "/Public/"));
app.get('/', function(request, responce){
    responce.sendFile(path.join(__dirname, 'imagenesAdicionales.html'));
})


   // Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor express escuchando en el puerto ${port}`);
});