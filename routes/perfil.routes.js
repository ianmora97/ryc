const express = require('express');
const router = express.Router();
const db = require('../database')
const jwt = require('jsonwebtoken');


router.get('/api/perfil/cursos', (req, res) => {
    db.query("call obtener_cursos_estudiante(?)",
        [req.query.id],
        (error, rows, fields) => {
            if (!error) {
                if (rows[0].length !== 0) {
                    res.send(rows[0]);
                } else {
                    let error = { status: 404 }
                    res.send({ error });
                }
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

router.get('/api/perfilProfe/cursos', (req, res) => {
    db.query("call obtener_cursos_profesor(?)",
        [req.query.id],
        (error, rows, fields) => {
            if (!error) {
                if (rows[0].length !== 0) {
                    res.send(rows[0]);
                } else {
                    let error = { status: 404 }
                    res.send({ error });
                }
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

router.get('/perfil/cambiarNombreUsuario', (req, res) => {
    db.query("call update_usuario_username(?,?)",
        [req.query.id, req.query.val],
        (error, rows, fields) => {
            if (!error) {
                req.session.usuario.username = req.query.val;
                res.send(rows);
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

router.get('/perfil/cambiarCorreo', (req, res) => {
    db.query("call update_usuario_correo(?,?)",
        [req.query.id, req.query.val],
        (error, rows, fields) => {
            if (!error) {
                req.session.usuario.correo = req.query.val;
                res.send(rows);
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

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

router.get('/api/cursos', (req, res) => {
    db.query("call obtener_cursos_estudiante_actual(?,?)",
        [req.query.id, 1],
        (error, rows, fields) => {
            if (!error) {
                if (rows[0].length !== 0) {
                    res.send(rows[0]);
                } else {
                    let error = { status: 404 }
                    res.send({ error });
                }
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

module.exports = router;
