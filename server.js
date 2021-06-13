const express = require('express');
const session = require('express-session');
const chalk = require('chalk');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');
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

const storage = multer.diskStorage({
    destination: path.join(__dirname,'/images/Perfil'),
    filename: (req, file, cb) => {
        cb(null,uuid.v4() + path.extname(file.originalname).toLocaleLowerCase());
    }   
});

app.use(multer({
    storage,
    dest: path.join(__dirname,'images/Perfil'),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }
        cb("Error: Archivo debe ser un formato valido");
    }
}).single('image'));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname,'/images')));

//Rutas
app.use(require('./routes/main.routes'));
app.use(require('./routes/perfil.routes'));
app.use(require('./routes/comentarios.routes'));
app.use(require('./routes/opiniones.routes'));

const server = app.listen( app.get('port'), ()=>{
    console.log('Server running in', chalk.yellowBright('http://localhost:80'));
});

// WebSocket