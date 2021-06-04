const express = require('express');
const router = express.Router();
const db = require('../database')


router.get('/comentarios', (req, res) => {
    db.query("call obtener_comentarios(?)",
    [req.query.id_opinion],
    (error, rows, fields) => {
        if (!error) {
            let comentarios = rows[0]
            res.send(comentarios);
        } else {
            console.error(error)
            let error = { status: 404 }
            res.send({ error });
        }
    })
});

router.put('/comentarios', (req, res) => {
    var usuario = req.body.id_usuario
    if(req.body.anonimo === "true"){
        var usuario = null
    }
    db.query("call insert_comentario(?,?,?)",
    [req.body.id_opinion, req.body.comentario_text, usuario],
    (error, rows, fields) => {
        if (!error) {
            let result = { status: 200 }
            res.send({result});
        } else {
            console.error(error)
            let error = { status: 404 }
            res.send({ error });
        }
    })
});

router.get('/comentarios/meEnoja', (req, res) => {

    db.query("call obtener_cant_me_enoja(?)",
        [req.body.id_opinion],
        (error, rows, fields) => {
            if (!error) {
                res.send(rows[0]);
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

router.post('/comentarios/meEnoja', (req, res) => {

    db.query("call insert_enoja(?,?)",
        [req.body.id_comentario, req.body.id_usuario],
        (error, rows, fields) => {
            if (!error) {
                db.query("call obtener_cant_me_enoja(?)",
                    [req.body.id_comentario],
                    (error, rows, fields) => {
                        if (!error) {
                            res.send(rows[0][0]);
                        } else {
                            let error = { status: 404 }
                            res.send({ error });
                        }
                    })
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

router.post('/comentarios/ok', (req, res) => {

    db.query("call insert_ok(?,?)",
        [req.body.id_comentario, req.body.id_usuario],
        (error, rows, fields) => {
            if (!error) {
                db.query("call obtener_cant_ok(?)",
                    [req.body.id_comentario],
                    (error, rows, fields) => {
                        if (!error) {
                            res.send(rows[0][0]);
                        } else {
                            let error = { status: 404 }
                            res.send({ error });
                        }
                    })
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

router.post('/comentarios/serio', (req, res) => {

    db.query("call insert_serio(?,?)",
        [req.body.id_comentario, req.body.id_usuario],
        (error, rows, fields) => {
            if (!error) {
                db.query("call obtener_cant_serio(?)",
                    [req.body.id_comentario],
                    (error, rows, fields) => {
                        if (!error) {
                            res.send(rows[0][0]);
                        } else {
                            let error = { status: 404 }
                            res.send({ error });
                        }
                    })
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});

router.post('/comentarios/toxico', (req, res) => {
    db.query("call insert_toxico(?,?)",
        [req.body.id_comentario, req.body.id_usuario],
        (error, rows, fields) => {
            if (!error) {
                db.query("call obtener_cant_toxico(?)",
                    [req.body.id_comentario],
                    (error, rows, fields) => {
                        if (!error) {
                            res.send(rows[0][0]);
                        } else {
                            let error = { status: 404 }
                            res.send({ error });
                        }
                    })
            } else {
                let error = { status: 404 }
                res.send({ error });
            }
        })
});
module.exports = router;

