const express = require('express');
const router = express.Router();
const db = require('../database')
const jwt = require('jsonwebtoken');

// Authorization: Bearer <token>
function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader === undefined) {
        res.redirect('/api/not_allowed');
    } else {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
}

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    db.query("call obtener_usuario(?,?)", [req.query.username, req.query.password], (error, rows, fields) => {
        if (!error) {
            let user = rows[0];
            jwt.sign({ user }, 'secretKeyToken', (err, token) => {
                res.redirect('/home/show/');
            });
        } else {
            res.send({ status: 500 })
        }
    })
});

router.get('/sesion', ensureToken, (req, res) => {
    let user = req.session.usuario;
    var decoded = jwt.decode(req.token);
    // get the decoded payload and header
    var decoded = jwt.decode(req.token, { complete: true });
    console.log(decoded.payload);
    res.render('sesion', { user });
});

router.get('/register/show', (req, res) => {
    res.render('register');
});

router.post('/register/insert', (req, res) => {

    db.query("call insertar_usuario(?,?,?)", [req.body.email, req.body.name, req.body.password], (error, rows, fields) => {
        if (!error) {
            let user = {
                name: req.body.name,
                email: req.body.email
            }
            console.log(user)
            req.session.usuario = user;
            console.log(req.session.usuario)
            res.send({ status: 200 })
        } else {
            res.send({ status: 500 })
        }
    })
});

router.get('/home/show', (req, res) => {
    db.query("call obtener_opiniones_cursos_seguidos(?);", [16], (error, rows, fields) => {
        if (!error) {
            console.log(rows)
            let opiniones = rows[0];
            res.render('home', { opiniones });
        } else {
            console.log(error)
            res.send({ status: 200 })
        }

    })
});
module.exports = router;
