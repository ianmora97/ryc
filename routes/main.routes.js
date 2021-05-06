const express = require('express');
const router = express.Router();
const db = require('../database')

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    db.query("call obtener_usuario(?,?)", [req.query.username,req.query.password], (error,rows,fields)=>{
        if(!error){
            req.session.user = rows[0];
            let user = req.session.user;
            res.render('sesion', { user });
        }else{
            res.send({status: 500})
        }
    })
});

router.get('/sesion', (req, res) => {
    let user = req.session.usuario;
    res.render('sesion', { user });
});

module.exports = router;