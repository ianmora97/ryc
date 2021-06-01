const express = require('express');
const router = express.Router();
const db = require('../database')
const chalk = require('chalk');

router.post('/opiniones/like', (req, res) => {
    // requestBody = JSON.parse((req.body.id_opinion))
    console.log(req.body)

    db.query("call insert_like(?,?)",
        [req.body.id_opinion, req.body.id_usuario],
        (error, rows, fields) => {
            if (!error) {
                db.query("call obtener_cant_likes(?)",
                    [req.body.id_opinion],
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

router.post('/opiniones/dislike', (req, res) => {
    // requestBody = JSON.parse((req.body.id_opinion))
    console.log(req.body)

    db.query("call insert_dislike(?,?)",
        [req.body.id_opinion, req.body.id_usuario],
        (error, rows, fields) => {
            if (!error) {
                db.query("call obtener_cant_dislikes(?)",
                    [req.body.id_opinion],
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

router.get('/opiniones/like', (req, res) => {
    // requestBody = JSON.parse((req.body.id_opinion))
    console.log(req.body)

    db.query("call obtener_cant_likes(?)",
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

router.get('/opiniones/dislike', (req, res) => {
    // requestBody = JSON.parse((req.body.id_opinion))
    console.log(req.body)

    db.query("call obtener_cant_dislikes(?)",
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



module.exports = router;
