const express    = require('express');
const path       = require('path');
const app        = express();
const port       = 3000;

app.use(express.static('public'));

/*app.get('/', (req, res) => {
    res.send('Hola desde mi servidor express en Google Drive');
});*/

/*app.use(express.static(__dirname + "/public/"));
app.get('/', function(request, responce){
    responce.sendFile(path.join(__dirname, 'index.html'));
})*/

/*app.get('/',   
    (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });*/

app.listen(port, () => {
    console.log(`Servidor express en Google Drive escuchando en el puerto ${port}`);
});