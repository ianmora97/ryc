const express = require('express');
const session = require('express-session');
const chalk = require('chalk');
const path = require('path');
const app = express();
require('dotenv').config();

// Se configuran las variables del servidor
app.set('port',80); //en cual puerto corre
app.set('views', path.join(__dirname,'views')); //la carpeta 'views' es para las vistas
app.set('view engine', 'ejs');//el motor es 'ejs' la misma mierda que 'jsp'(Java)

// Middlewares (que pasa entre las rutas y las vistas {peticiones HTTP})
app.use(express.json()); // deja pasar peticiones con formato JSON
app.use(express.urlencoded({extended:false})); // deja pasar peticiones por parametros y formularios

app.use(session({ 
    secret:'secretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname));

//Rutas
app.use(require('./routes/main.routes'));
app.use(require('./routes/perfil.routes'));

const server = app.listen( app.get('port'), ()=>{
    console.log('Server running in', chalk.yellowBright('http://localhost:80'));
});

// WebSocket