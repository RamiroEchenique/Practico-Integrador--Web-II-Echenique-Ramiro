const express    = require('express');
const app        = express();
const port       = 3000;

app.use(express.static('Public'));

/*app.get('/', (req, res) => {
    res.send('Hola desde mi servidor express en Google Drive');
});*/

app.listen(port, () => {
    console.log(`Servidor express en Google Drive escuchando en el puerto ${port}`);
});