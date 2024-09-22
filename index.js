const express    = require('express');
const http       = require("node:http");
const path       = require('path');
const app        = express();
const port       = process.env.PORT || 3000;

app.use(express.static('Public/'));



/*app.get('/', (req, res) => {
    res.send('Hola desde mi servidor express en Google Drive');
});*/

app.use(express.static(__dirname + "/Public/"));
app.get('/', function(request, responce){
    responce.sendFile(path.join(__dirname, 'index.html'));
})

/*app.get('/',   
    (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
   });*/

app.listen(port, () => {
    console.log(`Servidor express en Google Drive escuchando en el puerto ${port}`);
});