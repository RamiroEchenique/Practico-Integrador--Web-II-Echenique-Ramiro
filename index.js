const express    = require('express');
//const http       = require("node:http");
const translate = require('node-google-translate-skidz');//importar libreria para traducir
const path       = require('path');
const app        = express();
const port       = process.env.PORT || 3000;

//middlewares 
app.use(express.static('Public/'));
app.use(express.json());//para leer json

/*app.get('/', (req, res) => {
    res.send('Hola desde mi servidor express en Google Drive');
});*/

// Ruta para  la traducción
app.get('/traducir', function(request, response) {
    
    const cultura = request.body.cultura;
    const titulo = request.body.titulo;
    const dinastia = request.body.dinastia;
    
    translate({
        text: request.params.text,
        source: 'en',
        target: 'es'
    }, function(result) {
        console.log(result); //
        response.send(result); // Enviar el resultado al navegador
    });
});
  // Ruta para servir el archivo index.html
app.use(express.static(__dirname + "/Public/"));
app.get('/', function(request, responce){
    responce.sendFile(path.join(__dirname, 'index.html'));
})

/*app.get('/',   
    (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });*/

   // Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor express en Google Drive escuchando en el puerto ${port}`);
});